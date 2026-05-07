const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Reservas', () => {
  it('finaliza una reserva con pago', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' }).as('getParqueaderos');
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' }).as('getReservas');
    cy.intercept('POST', '**/payments', { fixture: 'pago-creado.json' }).as('crearPago');

    cy.visitWithAuth('/reservas', adminUser);
    cy.wait(['@getParqueaderos', '@getReservas']);

    cy.get('[data-cy=reserva-finalizar]').first().click();
    cy.get('[data-cy=pago-metodo]').clear().type('1');
    cy.get('[data-cy=pago-submit]').click();

    cy.wait('@crearPago').then(({ request }) => {
      expect(Number(request.body.idReserva)).to.eq(101);
      expect(Number(request.body.idMetodoPago)).to.eq(1);
    });

    cy.get('[data-cy=reservas-exito]').should('contain.text', 'Pago procesado exitosamente');
  });
});
