describe('Parkontrol Cypress E2E flows', () => {
  const adminEmail = 'admin1@example.com';
  const adminPassword = 'AdminPass1';

  const randomId = () => Math.floor(Math.random() * 1000000);
  const uniqueEmail = () => `cypress-user-${Date.now()}@example.com`;
  const uniquePlate = () => `CYP${randomId()}`;
  const uniqueParqueadero = () => `Cypress Parqueadero ${randomId()}`;

  it('FUNCIONALIDAD 1: Registrar usuario', () => {
    cy.visit('/registro');
    cy.get('input[formControlName="nombre"]').type('Cypress Admin', { force: true });
    cy.get('input[formControlName="correo"]').type(uniqueEmail(), { force: true });
    cy.get('input[formControlName="contrasena"]').type('Prueba123456', { force: true });
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 15000 }).should('include', '/login');
    cy.contains('Iniciar Sesion', { timeout: 10000 }).should('be.visible');
  });

  it('FUNCIONALIDAD 2: Crear parqueadero (HU-03)', () => {
    const parqueaderoName = uniqueParqueadero();
    cy.login();
    cy.visit('/parqueaderos');
    cy.contains('button', 'Nuevo Parqueadero').click();
    cy.get('input[formcontrolname="nombre"]').type(parqueaderoName);
    cy.get('input[formcontrolname="ubicacion"]').type('Cypress Test Location');
    cy.get('input[formcontrolname="capacidadTotal"]').clear().type('25');
    cy.contains('button', /crear|guardar/i).click();
    cy.contains('td', parqueaderoName, {
      timeout: 15000
    }).should('be.visible');
  });

  it('FUNCIONALIDAD 3: Registrar vehículo (HU-10)', () => {
    const placa = uniquePlate();

    cy.login();

    cy.visit('/vehiculos');

    cy.get('.create-form input[formcontrolname="placa"]')
      .type(placa);

    cy.contains('button', 'Registrar Vehiculo')
      .click();

    cy.contains('td', placa, {
      timeout: 15000
    }).should('be.visible');
  });

  it('FUNCIONALIDAD 4: Crear reserva (HU-13)', () => {
    const placa = 'LZV779';
    cy.login();

    cy.visit('/reservas');

    // Abrir modal
    cy.contains('button', 'Nueva Reserva')
      .click();

    // Placa
    cy.get('input[formcontrolname="placa"]')
      .type(placa);

    // Selector de celda
    cy.get('mat-select[formcontrolname="idCelda"]')
      .click();

    // Seleccionar primera opción
    cy.get('mat-option')
      .contains('Celda #')
      .first()
      .click();

    // Submit
    cy.contains('button', /crear|guardar|reservar/i)
      .click();

    // Validación
    cy.contains(placa, {
      timeout: 15000
    }).should('be.visible');
  });

  it('FUNCIONALIDAD 5: Registrar pago (HU-18)', () => {
    const placa = 'LZV779';
    const metodoPago = '1';

    cy.login();

    // Ir a reservas
    cy.visit('/reservas');

    // Buscar reserva y finalizarla
    cy.contains('td', placa, { timeout: 15000 })
      .parents('tr')
      .within(() => {
        cy.contains('button', 'Finalizar')
          .click();
      });

    // Modal de pago
    cy.get('mat-dialog-container', { timeout: 10000 })
      .should('be.visible');

    // Método de pago
    cy.get('mat-dialog-container input[formcontrolname="idMetodoPago"]')
      .type(metodoPago);

    // Submit
    cy.get('mat-dialog-container button[type="submit"]')
      .click({ force: true });

    // Validación
    cy.contains('Pago procesado exitosamente', {
      timeout: 15000
    }).should('be.visible');
  });
});