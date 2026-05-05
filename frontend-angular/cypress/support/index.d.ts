type AuthUser = {
  id: number;
  correo: string;
  nombreRol: 'ADMINISTRADOR' | 'OPERADOR';
  idEmpresa: number;
};

declare namespace Cypress {
  interface Chainable {
    visitWithAuth(path: string, user: AuthUser): Chainable<void>;
    stubLogin(user: AuthUser): Chainable<void>;
  }
}
