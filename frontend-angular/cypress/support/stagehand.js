const { z } = require('zod');

const Stagehand = {
  // Robust input filler for Material inputs that may be covered by decorations
  fillInput(selector, value) {
    return cy.get(selector, { timeout: 10000 }).then(($el) => {
      const el = cy.wrap($el);
      el.scrollIntoView();
      // ensure focus by clicking the field's container first
      el.click({ force: true });
      // clear and type using force to avoid overlay decorations blocking actions
      el.clear({ force: true });
      if (value !== undefined && value !== null) {
        el.type(String(value), { force: true });
      }
      return el;
    });
  },

  act(instruction) {
    const command = instruction.toLowerCase();

    if (command.includes('inicio de sesión') || command.includes('login')) {
      return cy.get('[data-cy="login-submit"]').click();
    }

    if (command.includes('registrar usuario') || command.includes('registro')) {
      return cy.get('[data-cy="registro-submit"]').click();
    }

    if (command.includes('crear parqueadero')) {
      return cy.get('[data-cy="parqueadero-submit"]').click();
    }

    if (command.includes('finalizar') && command.includes('reserva')) {
      return cy.get('button').contains('Finalizar').click();
    }

    if (command.includes('enviar pago') || command.includes('procesar pago')) {
      return cy.get('[data-cy="pago-submit"]').click();
    }

    throw new Error(`No se encontró un mapeo para act(): ${instruction}`);
  },

  observe() {
    return cy.url().then((url) =>
      cy.document().then((document) => ({
        url,
        title: document.title,
        hasSpinner: document.querySelectorAll('mat-spinner').length > 0,
        hasLoginButton:
          !!document.querySelector('[data-cy="login-submit"]') ||
          !!document.querySelector('[data-cy="login-correo"]') ||
          !!document.querySelector('button[type="submit"]'),
        hasRegisterButton: !!document.querySelector('[data-cy="registro-submit"]'),
      }))
    );
  },

  extract(schema) {
    const fields = Object.entries(schema.shape);

    return Promise.all(
      fields.map(([key, zodSchema]) => {
        const selector = zodSchema._def.description;
        if (!selector) {
          throw new Error(`El schema Zod debe incluir el selector CSS en description() para la clave ${key}`);
        }

        return cy.get(selector).then(($el) => {
          // handle inputs and non-input elements
          const tag = $el.prop('tagName').toLowerCase();
          if (tag === 'input' || tag === 'textarea' || tag === 'select') {
            return cy.wrap($el).invoke('val').then((value) => ({ key, value }));
          }
          return cy.wrap($el).invoke('text').then((value) => ({ key, value: value.trim() }));
        });
      })
    ).then((results) => {
      const data = results.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});
      return schema.parse(data);
    });
  },

  agent({ goal, data }) {
    const objective = goal.toLowerCase();
    // If OpenAI key is provided in Cypress env, ask the LLM for a plan and execute it.
    const openaiKey = (typeof Cypress !== 'undefined' && Cypress.env && Cypress.env('OPENAI_API_KEY')) || null;
    if (openaiKey) {
      return this.llmAgent({ goal, data });
    }

    if (objective.includes('registrar usuario')) {
      return this.registerUsuario(data);
    }

    if (objective.includes('crear parqueadero')) {
      return this.createParqueadero(data);
    }

    if (objective.includes('registrar vehículo') || objective.includes('registrar vehiculo')) {
      return this.registerVehiculo(data);
    }

    if (objective.includes('crear reserva')) {
      return this.createReserva(data);
    }

    if (objective.includes('registrar pago')) {
      return this.registerPago(data);
    }

    throw new Error(`Agent no reconoce el objetivo: ${goal}`);
  },

  buildPrompt(goal, data) {
    const instruction = `Eres un asistente que transforma un objetivo de prueba en una lista secuencial de pasos ejecutables por Cypress. Devuelve solo JSON con una clave "steps" que es un arreglo. Cada paso debe ser un objeto con {"action": "visit|fill|click|wait|assert", "selector": "<css>", "value": "<texto opcional>"}. Ejemplo: {steps:[{"action":"visit","selector":"/login"},{"action":"fill","selector":"[data-cy=login-correo]","value":"user@example.com"},{"action":"click","selector":"[data-cy=login-submit]"}]}
Objetivo:${goal}
Datos:${JSON.stringify(data || {})}`;
    return instruction;
  },

  llmAgent({ goal, data }) {
    const prompt = this.buildPrompt(goal, data);
    return cy.task('openai', { prompt }).then((res) => {
      if (!res) throw new Error('Empty response from OpenAI task');
      if (res.error) throw new Error(`OpenAI error: ${res.error}`);
      let content = res.result || '';
      // try to extract JSON
      let parsed;
      try {
        // sometimes the model wraps JSON in markdown
        const jsonText = content.replace(/^```json\s*/, '').replace(/```$/g, '').trim();
        parsed = JSON.parse(jsonText);
      } catch (e) {
        throw new Error(`No se pudo parsear JSON de OpenAI: ${e.message}\nResponse:\n${content}`);
      }

      if (!parsed.steps || !Array.isArray(parsed.steps)) {
        throw new Error('OpenAI did not return steps array');
      }

      // execute steps sequentially
      const performStep = (step) => {
        const action = (step.action || '').toLowerCase();
        if (action === 'visit') {
          return cy.visit(step.selector);
        }
        if (action === 'fill') {
          return this.fillInput(step.selector, step.value);
        }
        if (action === 'click') {
          return cy.get(step.selector, { timeout: 10000 }).click({ force: true });
        }
        if (action === 'wait') {
          const t = parseInt(step.value, 10) || 500;
          return cy.wait(t);
        }
        if (action === 'assert') {
          return cy.get(step.selector, { timeout: 10000 }).should('be.visible');
        }
        // unknown action: ignore
        return cy.log(`Unknown action from LLM: ${action}`);
      };

      return parsed.steps.reduce((chain, step) => chain.then(() => performStep(step)), cy.wrap(null));
    });
  },

  registerUsuario({ nombre, correo, contrasena, idEmpresa }) {
    cy.visit('/registro');
    this.fillInput('[data-cy="registro-nombre"]', nombre);
    this.fillInput('[data-cy="registro-correo"]', correo);
    this.fillInput('[data-cy="registro-contrasena"]', contrasena);
    this.fillInput('[data-cy="registro-idEmpresa"]', idEmpresa);
    // try to click the submit button using a robust selector
    return cy.get('[data-cy="registro-submit"]', { timeout: 10000 }).then(($btn) => cy.wrap($btn).click({ force: true }));
  },

  createParqueadero({ nombre, ubicacion, capacidad, adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.visit('/parqueaderos');
    cy.get('[data-cy="parqueadero-nuevo"]', { timeout: 10000 }).click({ force: true });
    this.fillInput('[data-cy="parqueadero-nombre"]', nombre);
    this.fillInput('[data-cy="parqueadero-ubicacion"]', ubicacion);
    this.fillInput('[data-cy="parqueadero-capacidad"]', capacidad);
    return cy.get('[data-cy="parqueadero-submit"]', { timeout: 10000 }).click({ force: true });
  },

  registerVehiculo({ placa, tipoVehiculo = '1', adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, tipoVehiculo);
    return cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  },

  createReserva({ placa, adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    return cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  },

  registerPago({ placa, metodoPago = '1', adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.finalizeReservation(placa, metodoPago);
    return cy.contains('Pago procesado exitosamente', { timeout: 15000 }).should('be.visible');
  },
};

module.exports = Stagehand;
