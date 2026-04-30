import request from 'supertest';

describe('Security - Pagos', () => {
  const url = 'http://localhost:3000';

  it('no debe permitir pagar dos veces la misma reserva', async () => {
    // Arrange
    const pago = {
      idReserva: 1,
      idMetodoPago: 1
    };

    // Act
    await request(url).post('/pagos').send(pago);
    const res = await request(url).post('/pagos').send(pago);

    // Assert
    expect(res.status).toBe(400);
  });
});