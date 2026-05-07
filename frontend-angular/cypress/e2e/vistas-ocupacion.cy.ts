const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Vistas - ocupacion por parqueadero', () => {
  it('muestra la ocupacion de parqueaderos', () => {
    cy.intercept('GET', '**/views/ocupacion*', { fixture: 'ocupacion.json' }).as('getOcupacion');
    cy.intercept('GET', '**/views/historial-reservas*', { fixture: 'historial-reservas.json' });
    cy.intercept('GET', '**/views/ingresos*', { fixture: 'ingresos.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.visitWithAuth('/vistas', adminUser);
    cy.wait('@getOcupacion');

    cy.get('[data-cy=ocupacion-table]').contains('td', 'Parqueadero Central');
    cy.get('[data-cy=ocupacion-table]').contains('td', '100');
    cy.get('[data-cy=ocupacion-table]').contains('td', '30');
    cy.get('[data-cy=ocupacion-table]').contains('td', '70');
  });
});
