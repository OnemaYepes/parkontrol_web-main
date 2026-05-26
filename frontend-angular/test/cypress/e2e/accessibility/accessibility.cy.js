const adminUser = {
  id: 1,
  correo: 'admin@demo.com',
  nombreRol: 'ADMINISTRADOR',
  idEmpresa: 10
};

describe('Accesibilidad basica (E2E)', () => {
  it('iniciar sesion: campos requeridos y boton accesible', () => {
    cy.visit('/login');
    cy.get('input[formControlName="correo"]').should('have.attr', 'aria-required', 'true');
    cy.get('input[formControlName="contrasena"]').should('have.attr', 'aria-required', 'true');
    cy.get('button[type="submit"]').should('contain.text', 'Iniciar Sesion');
  });

  it('finalizar reserva: boton de accion visible', () => {
    cy.intercept('GET', '**/parking-lots/empresa/*', { fixture: 'parqueaderos.json' });
    cy.intercept('GET', '**/reservations/parqueadero/*', { fixture: 'reservas.json' });

    cy.login();
    cy.visit('/reservas');

    cy.contains('button', 'Finalizar').should('be.visible');
  });

  it('generar factura electronica: tabs y boton visible', () => {
    cy.intercept('GET', '**/invoicing/clientes', { fixture: 'clientes.json' });
    cy.intercept('GET', '**/views/facturacion*', { fixture: 'facturacion.json' });

    cy.login();
    cy.visit('/facturacion');

    cy.contains('[role=tab]', 'Facturas').click();
    cy.get('app-facturas-lista').should('be.visible');
  });
});
