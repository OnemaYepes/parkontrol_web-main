const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Facturacion', () => {
  it('genera una factura electronica', () => {
    cy.fixture('facturacion.json').then((initialFacturas) => {
      let facturas = [...initialFacturas];

      cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' }).as('getClientes');
      cy.intercept('GET', '**/views/facturacion*', (req) => {
        req.reply(facturas);
      }).as('getFacturas');
      cy.intercept('POST', '**/invoicing/facturas', (req) => {
        const newFactura = {
          idFacturaElectronica: 999,
          tipoDocumento: 'CC',
          numeroDocumento: '123456',
          correo: 'cliente@demo.com',
          idPago: req.body.idPago,
          monto: 25000,
          metodoPago: 'EFECTIVO',
          fechaPago: '2026-05-05T12:05:00.000Z',
          cufe: req.body.cufe,
          urlPdf: 'http://example.com/factura.pdf',
          enviada: 0
        };
        facturas = [...facturas, newFactura];
        req.reply({ fixture: 'factura-creada.json' });
      }).as('crearFactura');

      cy.visitWithAuth('/facturacion', adminUser);
      cy.wait(['@getClientes', '@getFacturas']);

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
      cy.wait('@getFacturas');

      cy.get('[data-cy=facturacion-exito]').should('contain.text', 'Factura creada exitosamente');
    });
  });
});
