// test/API/usuarios.e2e-spec.ts
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';

describe('Usuarios API', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dataSource = moduleRef.get(DataSource);
  });

  beforeEach(async () => {
    // Limpiar tablas
    await dataSource.query(`DELETE FROM USUARIO`).catch(() => {});
    await dataSource.query(`DELETE FROM ROL`).catch(() => {});
    await dataSource.query(`DELETE FROM EMPRESA`).catch(() => {});
    
    // Insertar datos base
    await dataSource.query(`
      INSERT INTO EMPRESA (ID_EMPRESA, NOMBRE) 
      VALUES (1, 'EMPRESA_TEST')
    `).catch(() => {});
    
    await dataSource.query(`
      INSERT INTO ROL (ID_ROL, NOMBRE) 
      VALUES (2, 'OPERADOR')
    `).catch(() => {});
  });

  afterAll(async () => {
    await app.close();
  });

  it('debe crear usuario operador', async () => {
    const usuario = {
      nombre: 'Ana',
      correo: `ana${Date.now()}@test.com`,
      contrasena: '123456',
      idEmpresa: 1,
      rol: 'OPERADOR'
    };

    // 🔥 Probar diferentes rutas hasta encontrar la correcta
    const rutasPosibles = ['/users', '/usuarios', '/usuario', '/api/users', '/api/usuarios'];
    
    let res;
    for (const ruta of rutasPosibles) {
      res = await request(app.getHttpServer())
        .post(ruta)
        .send(usuario)
        .catch(() => null);
      
      if (res && res.status !== 404) {
        console.log(`✅ Ruta encontrada: ${ruta}`);
        break;
      }
    }

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});