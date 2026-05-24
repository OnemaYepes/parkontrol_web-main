Cypress.Commands.add('loginAsAdmin', (email = 'admin1@example.com', password = 'AdminPass1') => {
  cy.visit('/login');
  cy.get('[data-cy="login-correo"]').clear().type(email);
  cy.get('[data-cy="login-contrasena"]').clear().type(password);
  cy.get('[data-cy="login-submit"]').click();
  cy.url({ timeout: 15000 }).should('include', '/dashboard');
});

Cypress.Commands.add('createVehicle', (placa, tipoVehiculo = '1') => {
  cy.visit('/vehiculos');
  cy.get('[data-cy="vehiculo-placa"]').clear().type(placa);
  cy.get('[data-cy="vehiculo-tipo"]').clear().type(tipoVehiculo);
  cy.get('[data-cy="vehiculo-submit"]').click();
  cy.contains('Vehículo creado exitosamente', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('createReservation', (placa) => {
  cy.visit('/reservas');
  cy.get('[data-cy="reserva-nueva"]').click();
  cy.get('[data-cy="reserva-placa"]').clear().type(placa);
  cy.get('[data-cy="reserva-celda"]').click();
  cy.get('mat-option').contains('Celda #').first().click();
  cy.get('[data-cy="reserva-submit"]').click();
  cy.contains(placa, { timeout: 15000 }).should('be.visible');
});

Cypress.Commands.add('finalizeReservation', (placa, metodoPago = '1') => {
  cy.visit('/reservas');
  cy.contains('td', placa, { timeout: 15000 }).parents('tr').within(() => {
    cy.contains('button', 'Finalizar').click();
  });
  cy.get('[data-cy="pago-metodo"]').clear().type(metodoPago);
  cy.get('[data-cy="pago-submit"]').click();
  cy.contains('Pago procesado exitosamente', { timeout: 15000 }).should('be.visible');
});
