const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Regresion (E2E)', () => {
  it('iniciar sesion navega al dashboard', () => {
    cy.stubLogin(adminUser);

    cy.intercept('GET', '**/companies/*', { fixture: 'empresa.json' });
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/reservations/activas', { fixture: 'reservas-activas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visit('/login');
    cy.get('[data-cy=login-email]').type('admin@demo.com', { force: true });
    cy.get('[data-cy=login-password]').type('password123', { force: true });
    cy.get('[data-cy=login-submit]').click();

    cy.url().should('include', '/dashboard');
  });

  it('crear celda actualiza la tabla', () => {
    cy.fixture('celdas.json').then((initialCeldas) => {
      let celdas = [...initialCeldas];

      cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
      cy.intercept('GET', '**/cells/parqueadero/*', (req) => req.reply(celdas));
      cy.intercept('POST', '**/cells', (req) => {
        const newCelda = {
          id: 3,
          idParqueadero: req.body.idParqueadero,
          idTipoCelda: req.body.idTipoCelda,
          idSensor: req.body.idSensor,
          estado: req.body.estado,
          tipoCelda: { id: req.body.idTipoCelda, nombre: 'Carro' },
          sensor: { id: req.body.idSensor, codigo: `S-${req.body.idSensor}`, tipo: 'ULTRASONICO' }
        };
        celdas = [...celdas, newCelda];
        req.reply(newCelda);
      });

      cy.visitWithAuth('/celdas', adminUser);
      cy.get('[data-cy=celdas-nueva]').click();
      cy.get('[data-cy=celda-parqueadero]').click();
      cy.contains('mat-option', 'Parqueadero Central').click();
      cy.get('[data-cy=celda-tipo]').clear().type('1');
      cy.get('[data-cy=celda-sensor]').clear().type('3');
      cy.get('[data-cy=celda-estado]').click();
      cy.contains('mat-option', 'Libre').click();
      cy.get('[data-cy=celda-submit]').click();

      cy.get('[data-cy=celdas-table]').contains('td', '3');
    });
  });

  it('finalizar reserva confirma mensaje de exito', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' });
    cy.intercept('POST', '**/payments', { fixture: 'pago-creado.json' });

    cy.visitWithAuth('/reservas', adminUser);
    cy.get('[data-cy=reserva-finalizar]').first().click();
    cy.get('[data-cy=pago-metodo]').clear().type('1');
    cy.get('[data-cy=pago-submit]').click();

    cy.get('[data-cy=reservas-exito]').should('contain.text', 'Pago procesado exitosamente');
  });

  it('consultar ocupacion muestra parqueadero', () => {
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/views/historial-reservas*', { fixture: 'historial-reservas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/vistas', adminUser);
    cy.get('[data-cy=ocupacion-table]').contains('td', 'Parqueadero Central');
  });

  it('generar factura electronica muestra mensaje', () => {
    cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });
    cy.intercept('POST', '**/invoicing/facturas', { fixture: 'factura-creada.json' });

    cy.visitWithAuth('/facturacion', adminUser);
    cy.contains('[role=tab]', 'Facturas').click();
    cy.get('[data-cy=factura-nueva]').click();

    cy.get('[data-cy=factura-id-pago]').clear().type('9001');
    cy.get('[data-cy=factura-cliente]').click();
    cy.contains('mat-option', '123456 - cliente@demo.com').click();
    cy.get('[data-cy=factura-cufe]').type('CUFE-NEW-001');
    cy.get('[data-cy=factura-submit]').click();

    cy.get('[data-cy=facturacion-exito]').should('contain.text', 'Factura creada exitosamente');
  });
});
