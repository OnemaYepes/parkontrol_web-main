type AuthUser = {
  id: number;
  correo: string;
  nombreRol: 'ADMINISTRADOR' | 'OPERADOR';
  idEmpresa: number;
};

const base64UrlEncode = (value: object): string => {
  const json = JSON.stringify(value);
  const base64 = btoa(json);
  return base64.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const buildJwt = (user: AuthUser): string => {
  const header = base64UrlEncode({ alg: 'none', typ: 'JWT' });
  const now = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode({
    id: user.id,
    correo: user.correo,
    nombreRol: user.nombreRol,
    idEmpresa: user.idEmpresa,
    exp: now + 60 * 60
  });
  return `${header}.${payload}.`;
};

Cypress.Commands.add('visitWithAuth', (path: string, user: AuthUser) => {
  const token = buildJwt(user);
  cy.visit(path, {
    onBeforeLoad(win) {
      win.localStorage.setItem('auth_token', token);
    }
  });
});

Cypress.Commands.add('stubLogin', (user: AuthUser) => {
  const token = buildJwt(user);
  cy.intercept('POST', '**/auth/login', { access_token: token }).as('login');
});
