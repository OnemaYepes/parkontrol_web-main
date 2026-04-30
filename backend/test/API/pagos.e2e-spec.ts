import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PagosService } from '../../src/pagos/pagos.service';
import { ReservasService } from '../../src/reservas/reservas.service';

describe('Pagos API (e2e) - con mocks', () => {
  let app: INestApplication;

  const reservasMock = {
    crear: jest.fn().mockResolvedValue({
      id: 1,
    }),
  };

  const pagosMock = {
    crear: jest.fn().mockResolvedValue({
      id: 1,
      monto: 5000,
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ReservasService)
      .useValue(reservasMock)
      .overrideProvider(PagosService)
      .useValue(pagosMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe procesar pago correctamente', async () => {
    // 🔹 Crear reserva
    const reservaRes = await request(app.getHttpServer())
      .post('/reservations') // ✅ ruta correcta
      .send({
        fechaEntrada: new Date().toISOString(),
        fechaSalida: new Date().toISOString(),
      });

    expect(reservaRes.status).toBe(201);
    expect(reservaRes.body).toHaveProperty('id');

    // 🔹 Crear pago
    const pagoRes = await request(app.getHttpServer())
      .post('/payments') // ✅ ruta correcta
      .send({
        idReserva: reservaRes.body.id,
        monto: 5000,
        idMetodoPago: 1,
      });

    // 👇 Debug opcional (puedes quitarlo luego)
    // console.log(pagoRes.status, pagoRes.body);

    expect(pagoRes.status).toBe(201);
    expect(pagoRes.body).toHaveProperty('id');
    expect(pagoRes.body.monto).toBe(5000);
  });
});