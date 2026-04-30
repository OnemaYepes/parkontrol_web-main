import request from 'supertest';

describe('Performance - Reservas', () => {
  const url = 'http://localhost:3000';

  it('debe responder en menos de 500ms', async () => {
    // Arrange
    const reserva = {
      idVehiculo: 1,
      idCelda: 1,
      estado: 'ABIERTA'
    };

    const inicio = Date.now();

    // Act
    await request(url).post('/reservas').send(reserva);

    const fin = Date.now();

    // Assert
    expect(fin - inicio).toBeLessThan(500);
  });
});