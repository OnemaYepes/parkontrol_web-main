const { z } = require('zod');
const aiConfig = require('./ai-config');

const Stagehand = {
  isAIEnabled() {
    return aiConfig.isAIEnabled;
  },

  aiProvider() {
    return aiConfig.getActiveProvider();
  },

  ai(prompt) {
    if (!this.isAIEnabled()) {
      throw new Error('AI no está habilitado. Configura OPENAI_API_KEY o OLLAMA_HOST en frontend-angular/.env');
    }

    if (this.aiProvider() === 'Ollama') {
      return cy.task('ollama', { prompt });
    }

    throw new Error(`Proveedor AI no soportado: ${this.aiProvider()}`);
  },

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
