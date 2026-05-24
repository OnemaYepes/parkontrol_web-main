describe('Parkontrol Cypress E2E flows', () => {
  const adminEmail = 'admin1@example.com';
  const adminPassword = 'AdminPass1';

  const randomId = () => Math.floor(Math.random() * 1000000);
  const uniqueEmail = () => `cypress-user-${Date.now()}@example.com`;
  const uniquePlate = () => `CYP${randomId()}`;
  const uniqueParqueadero = () => `Cypress Parqueadero ${randomId()}`;

  it('FUNCIONALIDAD 1: Registrar usuario', () => {
    cy.visit('/registro');
    cy.get('[data-cy="registro-nombre"]').type('Cypress Admin');
    cy.get('[data-cy="registro-correo"]').type(uniqueEmail());
    cy.get('[data-cy="registro-contrasena"]').type('Admin1234');
    cy.get('[data-cy="registro-idEmpresa"]').clear().type('1');
    cy.get('[data-cy="registro-submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/login');
    cy.contains('Iniciar Sesion', { timeout: 10000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 2: Crear parqueadero (HU-03)', () => {
    const parqueaderoName = uniqueParqueadero();

    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.visit('/parqueaderos');
    cy.get('[data-cy="parqueadero-nuevo"]').click();
    cy.get('[data-cy="parqueadero-nombre"]').type(parqueaderoName);
    cy.get('[data-cy="parqueadero-ubicacion"]').type('Cypress Test Location');
    cy.get('[data-cy="parqueadero-capacidad"]').clear().type('25');
    cy.get('[data-cy="parqueadero-submit"]').click();
    cy.contains('td', parqueaderoName, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 3: Registrar vehículo (HU-10)', () => {
    const placa = uniquePlate();

    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 4: Crear reserva (HU-13)', () => {
    const placa = uniquePlate();

    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 5: Registrar pago (HU-18)', () => {
    const placa = uniquePlate();

    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.finalizeReservation(placa, '1');
  });
});
