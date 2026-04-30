import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('Parqueaderos API (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = moduleFixture.get(DataSource);
  });

  beforeEach(async () => {
    await dataSource.query(`TRUNCATE TABLE PARQUEADERO CASCADE`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe crear parqueadero correctamente', async () => {

    // ✅ Insert seguro (evita duplicados)
    await dataSource.query(`
      INSERT INTO EMPRESA (ID_EMPRESA, NOMBRE)
      SELECT 1, 'EMPRESA_TEST' FROM DUAL
      WHERE NOT EXISTS (
        SELECT 1 FROM EMPRESA WHERE ID_EMPRESA = 1
      )
    `);

    const res = await request(app.getHttpServer())
      .post('/parking-lots')
      .send({
        nombre: 'Parking Test',
        capacidadTotal: 50,
        ubicacion: 'Medellín',
        idEmpresa: 1, // ✅ ahora sí coincide
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe('Parking Test');
  });
});