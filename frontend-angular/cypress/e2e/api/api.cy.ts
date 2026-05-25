const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('API (E2E con mocks)', () => {
  it('login envia credenciales al endpoint correcto', () => {
    const token = 'header.payload.';

    cy.intercept('POST', '**/auth/login', { access_token: token }).as('login');
    cy.intercept('GET', '**/companies/*', { fixture: 'empresa.json' });
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/reservations/activas', { fixture: 'reservas-activas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visit('/login');
    cy.get('[data-cy=login-email]').type('admin@demo.com', { force: true });
    cy.get('[data-cy=login-password]').type('password123', { force: true });
    cy.get('[data-cy=login-submit]').click();

    cy.wait('@login').then(({ request }) => {
      expect(request.body.correo).to.eq('admin@demo.com');
      expect(request.body.contrasena).to.eq('password123');
    });
  });

  it('crear celda envia payload correcto', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/cells/parqueadero/*', { fixture: 'celdas.json' });
    cy.intercept('POST', '**/cells', { fixture: 'celdas.json' }).as('createCelda');

    cy.visitWithAuth('/celdas', adminUser);
    cy.get('[data-cy=celdas-nueva]').click();

    cy.get('[data-cy=celda-parqueadero]').click();
    cy.contains('mat-option', 'Parqueadero Central').click();
    cy.get('[data-cy=celda-tipo]').clear().type('1');
    cy.get('[data-cy=celda-sensor]').clear().type('3');
    cy.get('[data-cy=celda-estado]').click();
    cy.contains('mat-option', 'Libre').click();
    cy.get('[data-cy=celda-submit]').click();

    cy.wait('@createCelda').then(({ request }) => {
      expect(Number(request.body.idParqueadero)).to.eq(1);
      expect(Number(request.body.idTipoCelda)).to.eq(1);
      expect(Number(request.body.idSensor)).to.eq(3);
      expect(request.body.estado).to.eq('LIBRE');
    });
  });

  it('finalizar reserva envia pago al endpoint correcto', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' });
    cy.intercept('POST', '**/payments', { fixture: 'pago-creado.json' }).as('crearPago');

    cy.visitWithAuth('/reservas', adminUser);
    cy.get('[data-cy=reserva-finalizar]').first().click();
    cy.get('[data-cy=pago-metodo]').clear().type('1');
    cy.get('[data-cy=pago-submit]').click();

    cy.wait('@crearPago').then(({ request }) => {
      expect(Number(request.body.idReserva)).to.eq(101);
      expect(Number(request.body.idMetodoPago)).to.eq(1);
    });
  });

  it('ocupacion por parqueadero consulta con idEmpresa', () => {
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' }).as('getOcupacion');
    cy.intercept('GET', '**/views/historial-reservas*', { fixture: 'historial-reservas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/vistas', adminUser);

    cy.wait('@getOcupacion')
      .its('request.url')
      .should('include', 'idEmpresa=10');
  });

  it('generar factura electronica envia el payload', () => {
    cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });
    cy.intercept('POST', '**/invoicing/facturas', { fixture: 'factura-creada.json' }).as('crearFactura');

    cy.visitWithAuth('/facturacion', adminUser);
    cy.contains('[role=tab]', 'Facturas').click();
    cy.get('[data-cy=factura-nueva]').click();

    cy.get('[data-cy=factura-id-pago]').clear().type('9001');
    cy.get('[data-cy=factura-cliente]').click();
    cy.contains('mat-option', '123456 - cliente@demo.com').click();
    cy.get('[data-cy=factura-cufe]').type('CUFE-NEW-001');
    cy.get('[data-cy=factura-submit]').click();

    cy.wait('@crearFactura').then(({ request }) => {
      expect(Number(request.body.idPago)).to.eq(9001);
      expect(Number(request.body.idClienteFactura)).to.eq(1);
      expect(request.body.cufe).to.eq('CUFE-NEW-001');
    });
  });
});
