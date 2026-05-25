describe('Parkontrol Browser Use flows (sin Stagehand)', () => {
  const adminEmail = 'admin1@example.com';
  const adminPassword = 'AdminPass1';
  const backendApi = 'http://localhost:3000/api';
  const randomId = () => Math.floor(Math.random() * 1000000);
  const uniqueEmail = () => `browseruse-${Date.now()}-${randomId()}@example.com`;
  const uniquePlate = () => `BU${randomId()}`;
  const uniqueParqueadero = () => `BrowserUse Parqueadero ${Date.now()}-${randomId()}`;

  const ensureAdminExists = () => {
    cy.request({
      method: 'POST',
      url: `${backendApi}/auth/register`,
      body: {
        nombre: 'Admin BrowserUse',
        correo: adminEmail,
        contrasena: adminPassword,
        idEmpresa: 1,
        rol: 'ADMINISTRADOR',
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect([200, 201, 409]).to.include(response.status);
    });
  };

  before(() => {
    ensureAdminExists();
  });

  it('FUNCIONALIDAD 1: Registrar usuario operador (HU-01)', () => {
    const email = uniqueEmail();
    cy.visit('/registro');
    cy.robustType('[data-cy="registro-nombre"]', 'Operador BrowserUse');
    cy.robustType('[data-cy="registro-correo"]', email);
    cy.robustType('[data-cy="registro-contrasena"]', 'Operador123!');
    // idEmpresa puede ser un select o input según la app
    cy.get('[data-cy="registro-idEmpresa"]', { timeout: 10000 }).then(($el) => {
      if ($el.is('input') || $el.is('textarea')) {
        cy.robustType('[data-cy="registro-idEmpresa"]', '1');
      } else {
        cy.get('[data-cy="registro-idEmpresa"]').click({ force: true });
        cy.get('mat-option').contains('1').first().click({ force: true });
      }
    });
    cy.get('[data-cy="registro-submit"]', { timeout: 10000 }).click({ force: true });
    // Espera que no sigamos en la página de registro (redirige a login o dashboard)
    cy.url({ timeout: 10000 }).should((u) => {
      expect(u).to.not.include('/registro');
    });
  });

  it('FUNCIONALIDAD 2: Crear parqueadero (HU-03)', () => {
    const nombre = uniqueParqueadero();
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.visit('/parqueaderos');
    cy.get('[data-cy="parqueadero-nuevo"]', { timeout: 10000 }).click({ force: true });
    cy.robustType('[data-cy="parqueadero-nombre"]', nombre);
    cy.robustType('[data-cy="parqueadero-ubicacion"]', 'Ubicacion BrowserUse');
    cy.robustType('[data-cy="parqueadero-capacidad"]', '30');
    cy.get('[data-cy="parqueadero-submit"]', { timeout: 10000 }).click({ force: true });
    // Verificar que el parqueadero aparece en la lista
    cy.contains(nombre, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 3: Registrar vehículo (HU-10)', () => {
    const placa = uniquePlate();
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.contains(placa, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 4: Crear reserva (HU-13)', () => {
    const placa = uniquePlate();
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.contains(placa, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 5: Registrar pago (HU-18)', () => {
    const placa = uniquePlate();
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.finalizeReservation(placa, '1');
    cy.contains('Pago procesado exitosamente', { timeout: 15000 }).should('be.visible');
  });
});
