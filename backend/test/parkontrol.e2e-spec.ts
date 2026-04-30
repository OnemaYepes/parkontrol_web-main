import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request  from 'supertest';
import { AppModule } from '../src/app.module';

describe('Parkontrol E2E - Pruebas de API, Seguridad y Regresión', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Importante para probar la seguridad de los DTOs
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  // --- HU: Buscar vehículo por placa (API + SEGURIDAD) ---
  describe('Vehículos (HU03)', () => {
    it('GET /vehicles/placa/:placa - Éxito', () => {
      return request(app.getHttpServer())
        .get('/vehicles/placa/ABC123')
        .expect(200);
    });

    it('Seguridad: Rechazar placas inválidas (DTO Validation)', () => {
      return request(app.getHttpServer())
        .post('/vehicles')
        .send({ placa: 'A', idTipoVehiculo: 1 }) // Placa muy corta (< 3)
        .expect(400);
    });
  });

  // --- HU: Listar celdas por parqueadero (API + REGRESIÓN) ---
  describe('Celdas (HU02)', () => {
    it('GET /cells/parqueadero/:id - Estructura de datos correcta', async () => {
      const response = await request(app.getHttpServer())
        .get('/cells/parqueadero/1')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('Regresión: Actualizar estado de celda no debe romper el detalle', async () => {
      await request(app.getHttpServer())
        .patch('/cells/1/estado')
        .send({ estado: 'OCUPADO' })
        .expect(200);

      // Verificamos que el detalle del parqueadero siga accesible
      await request(app.getHttpServer())
        .get('/parking-lots/1')
        .expect(200);
    });
  });

  // --- HU: Listar clientes de facturación (API) ---
  describe('Facturación (HU04)', () => {
    it('GET /invoicing/clientes - Retorna lista', () => {
      return request(app.getHttpServer())
        .get('/invoicing/clientes')
        .expect(200);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});