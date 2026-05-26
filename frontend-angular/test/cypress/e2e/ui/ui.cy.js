const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('UI (E2E)', () => {
  it('iniciar sesion muestra textos clave', () => {
    cy.visit('/login');

    cy.contains('mat-card-title', 'Parkontrol');
    cy.contains('button', 'Iniciar Sesion');
  });

  it('crear celda muestra tabla y estados', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/cells/parqueadero/*', { fixture: 'celdas.json' });

    cy.visitWithAuth('/celdas', adminUser);

    cy.get('[data-cy=celdas-table] tbody tr').should('have.length.at.least', 1);
    cy.get('[data-cy=celdas-table]').contains('td', 'LIBRE');
  });

  it('finalizar reserva muestra accion en reservas abiertas', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' });

    cy.visitWithAuth('/reservas', adminUser);

    cy.get('[data-cy=reserva-finalizar]').should('exist');
  });

  it('consultar ocupacion muestra porcentaje', () => {
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' });
    cy.intercept('GET', '**/views/historial-reservas*', { fixture: 'historial-reservas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/vistas', adminUser);

    cy.get('[data-cy=ocupacion-table]').contains('td', '30%');
  });

  it('generar factura electronica muestra lista', () => {
    cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/facturacion', adminUser);
    cy.contains('[role=tab]', 'Facturas').click();

    cy.contains('th', 'ID Pago');
    cy.contains('td', '9001');
  });
});
