import request from 'supertest';

describe('Security - Usuarios', () => {
  const url = 'http://localhost:3000';

  it('no debe permitir crear usuario sin contraseña', async () => {
    // Arrange
    const usuario = {
      nombre: 'Ana',
      correo: 'ana@test.com',
      idEmpresa: 1
    };

    // Act
    const res = await request(url)
      .post('/usuarios/operador')
      .send(usuario);

    // Assert
    expect(res.status).toBe(400);
  });
});