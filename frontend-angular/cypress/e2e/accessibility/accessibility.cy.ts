const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Accesibilidad basica (E2E)', () => {
  it('iniciar sesion: campos requeridos y boton accesible', () => {
    cy.visit('/login');

    cy.get('[data-cy=login-email]').should('have.attr', 'aria-required', 'true');
    cy.get('[data-cy=login-password]').should('have.attr', 'aria-required', 'true');
    cy.get('[data-cy=login-submit]').should('contain.text', 'Iniciar Sesion');
  });

  it('crear celda: foco y encabezados visibles', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' }).as('getParqueaderos');
    cy.intercept('GET', '**/cells/parqueadero/*', { fixture: 'celdas.json' }).as('getCeldas');

    cy.visitWithAuth('/celdas', adminUser);

    cy.wait(['@getParqueaderos', '@getCeldas']);
    cy.get('[data-cy=celdas-nueva]').should('not.be.disabled').focus().should('have.focus');
    cy.get('[data-cy=celdas-table] th').should('have.length.at.least', 4);
  });

  it('finalizar reserva: boton de accion visible', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' });

    cy.visitWithAuth('/reservas', adminUser);

    cy.contains('button', 'Finalizar').should('be.visible');
  });

  it('ocupacion por parqueadero: tabla con encabezados', () => {
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/views/historial-reservas*', { fixture: 'historial-reservas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/vistas', adminUser);

    cy.get('[data-cy=ocupacion-table] th').should('have.length.at.least', 4);
  });

  it('generar factura electronica: tabs y boton visible', () => {
    cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/facturacion', adminUser);

    cy.contains('[role=tab]', 'Facturas').click();
    cy.get('[data-cy=factura-nueva]').should('be.visible');
  });
});
