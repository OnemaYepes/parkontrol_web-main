const Stagehand = {
  registerUsuario({ nombre, correo, contrasena, idEmpresa }) {
    cy.visit('/registro');
    cy.get('[data-cy="registro-nombre"]').clear().type(nombre);
    cy.get('[data-cy="registro-correo"]').clear().type(correo);
    cy.get('[data-cy="registro-contrasena"]').clear().type(contrasena);
    cy.get('[data-cy="registro-idEmpresa"]').clear().type(idEmpresa);
    cy.get('[data-cy="registro-submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/login');
    cy.contains('Iniciar Sesion', { timeout: 10000 }).should('be.visible');
  },

  createParqueadero({ nombre, ubicacion, capacidad, adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.visit('/parqueaderos');
    cy.get('[data-cy="parqueadero-nuevo"]').click();
    cy.get('[data-cy="parqueadero-nombre"]').clear().type(nombre);
    cy.get('[data-cy="parqueadero-ubicacion"]').clear().type(ubicacion);
    cy.get('[data-cy="parqueadero-capacidad"]').clear().type(capacidad.toString());
    cy.get('[data-cy="parqueadero-submit"]').click();
    cy.contains('td', nombre, { timeout: 15000 }).should('be.visible');
  },

  registerVehiculo({ placa, tipoVehiculo = '1', adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, tipoVehiculo);
    cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  },

  createReserva({ placa, adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.contains('td', placa, { timeout: 15000 }).should('be.visible');
  },

  registerPago({ placa, metodoPago = '1', adminEmail, adminPassword }) {
    cy.loginAsAdmin(adminEmail, adminPassword);
    cy.createVehicle(placa, '1');
    cy.createReservation(placa);
    cy.finalizeReservation(placa, metodoPago);
    cy.contains('Pago procesado exitosamente', { timeout: 15000 }).should('be.visible');
  },
};

module.exports = Stagehand;
