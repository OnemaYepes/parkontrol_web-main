const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Celdas', () => {
  it('crea una nueva celda', () => {
    cy.fixture('celdas.json').then((initialCeldas) => {
      let celdas = [...initialCeldas];

      cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' }).as('getParqueaderos');
      cy.intercept('GET', '**/cells/parqueadero/*', (req) => {
        req.reply(celdas);
      }).as('getCeldas');
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
      }).as('createCelda');

      cy.visitWithAuth('/celdas', adminUser);
      cy.wait(['@getParqueaderos', '@getCeldas']);

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
      cy.wait('@getCeldas');

      cy.get('[data-cy=celdas-table]').contains('td', '3');
    });
  });
});
