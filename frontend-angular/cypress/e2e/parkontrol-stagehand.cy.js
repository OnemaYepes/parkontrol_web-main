const Stagehand = require('../support/stagehand');
const { z } = require('zod');

describe('Parkontrol Stagehand flows para IA + funcionalidades', () => {
  const adminEmail = 'admin1@example.com';
  const adminPassword = 'AdminPass1';
  const randomId = () => Math.floor(Math.random() * 1000000);
  const uniqueEmail = () => `cypress-stagehand-${Date.now()}-${randomId()}@example.com`;
  const uniquePlate = () => `STG${randomId()}`;
  const uniqueParqueadero = () => `Stagehand Parqueadero ${Date.now()}-${randomId()}`;

  it('FUNCIONALIDAD 1: Registrar usuario', () => {
    Stagehand.agent({
      goal: 'Registrar usuario administrador',
      data: {
        nombre: 'Stagehand Admin',
        correo: uniqueEmail(),
        contrasena: 'Admin1234',
        idEmpresa: '1',
      },
    });
  });

  it('FUNCIONALIDAD 2: Crear parqueadero (HU-03)', () => {
    Stagehand.agent({
      goal: 'Crear parqueadero',
      data: {
        nombre: uniqueParqueadero(),
        ubicacion: 'Ubicacion Stagehand',
        capacidad: 25,
        adminEmail,
        adminPassword,
      },
    });
  });

  it('FUNCIONALIDAD 3: Registrar vehículo (HU-10)', () => {
    Stagehand.agent({
      goal: 'Registrar vehículo',
      data: {
        placa: uniquePlate(),
        tipoVehiculo: '1',
        adminEmail,
        adminPassword,
      },
    });
  });

  it('FUNCIONALIDAD 4: Crear reserva (HU-13)', () => {
    const placa = uniquePlate();
    Stagehand.agent({
      goal: 'Crear reserva',
      data: {
        placa,
        adminEmail,
        adminPassword,
      },
    });
  });

  it('FUNCIONALIDAD 5: Registrar pago (HU-18)', () => {
    const placa = uniquePlate();
    Stagehand.agent({
      goal: 'Registrar pago',
      data: {
        placa,
        metodoPago: '1',
        adminEmail,
        adminPassword,
      },
    });
  });

  it('Ejemplo de extract y observe', () => {
    cy.visit('/login');
    Stagehand.observe().then((state) => {
      expect(state.url).to.include('/login');
      expect(state.hasLoginButton).to.be.true;
    });

    const loginSchema = z.object({
      correo: z.string().optional().describe('[data-cy="login-correo"]'),
      contrasena: z.string().optional().describe('[data-cy="login-contrasena"]'),
    });

    Stagehand.extract(loginSchema).then((formData) => {
      expect(formData).to.have.keys(['correo', 'contrasena']);
    });
  });

  it('Prueba de Ollama local si está configurado', () => {
    if (!Stagehand.isAIEnabled() || Stagehand.aiProvider() !== 'Ollama') {
      cy.log('Ollama no configurado en frontend-angular/.env');
      return;
    }

    Stagehand.ai('Escribe un saludo breve en español.').then((respuesta) => {
      expect(respuesta).to.be.a('string');
      expect(respuesta.length).to.be.greaterThan(0);
    });
  });
});
