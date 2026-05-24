Cypress.Commands.add('loginAsAdmin', (email = 'admin1@example.com', password = 'AdminPass1') => {
  cy.visit('/login');
  cy.robustType('[data-cy="login-correo"]', email);
  cy.robustType('[data-cy="login-contrasena"]', password);
  cy.get('[data-cy="login-submit"]', { timeout: 10000 }).click({ force: true });
  cy.url({ timeout: 15000 }).should('include', '/dashboard');
});

Cypress.Commands.add('createVehicle', (placa, tipoVehiculo = '1') => {
  cy.visit('/vehiculos');
  cy.robustType('[data-cy="vehiculo-placa"]', placa);
  cy.robustType('[data-cy="vehiculo-tipo"]', tipoVehiculo);
  cy.get('[data-cy="vehiculo-submit"]', { timeout: 10000 }).click({ force: true });
  cy.contains('Vehículo creado exitosamente', { timeout: 10000 }).should('be.visible');
});

Cypress.Commands.add('createReservation', (placa) => {
  cy.visit('/reservas');
  cy.get('[data-cy="reserva-nueva"]').click();
  cy.robustType('[data-cy="reserva-placa"]', placa);
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
  cy.robustType('[data-cy="pago-metodo"]', metodoPago);
  cy.get('[data-cy="pago-submit"]', { timeout: 10000 }).click({ force: true });
  cy.contains('Pago procesado exitosamente', { timeout: 15000 }).should('be.visible');
});

// Robust typing helper to work around Material decorations that overlap inputs
Cypress.Commands.add('robustType', (selector, value) => {
  return cy.get(selector, { timeout: 10000 }).then(($el) => {
    const el = cy.wrap($el);
    el.scrollIntoView();
    el.click({ force: true });
    el.clear({ force: true });
    el.type(String(value), { force: true });
    return el;
  });
});
