import request from 'supertest';

describe('Performance Smoke Tests - Parkontrol', () => {
  const url = 'http://localhost:3000';

  // HU02: Listar celdas por parqueadero
  it('HU02: Listar celdas debe responder en menos de 500ms', async () => {
    const idParqueadero = 1;
    const inicio = Date.now();

    await request(url)
      .get(`/cells/parqueadero/${idParqueadero}`)
      .expect((res) => {
        // Aceptamos 200 o 404 para medir latencia de consulta
        if (res.status !== 200 && res.status !== 404) {
          throw new Error(`Error inesperado: ${res.status}`);
        }
      });

    const duracion = Date.now() - inicio;
    console.log(` Latencia Listar Celdas (ID ${idParqueadero}): ${duracion}ms`);
    expect(duracion).toBeLessThan(500);
  });

  // HU05: Listar reportes por parqueadero
  it('HU05: Listar reportes debe responder en menos de 800ms', async () => {
    const idParqueadero = 1;
    const inicio = Date.now();

    await request(url)
      .get(`/reports/parqueadero/${idParqueadero}`)
      .expect((res) => {
        if (res.status !== 200 && res.status !== 404) {
          throw new Error(`Error inesperado: ${res.status}`);
        }
      });

    const duracion = Date.now() - inicio;
    console.log(` Latencia Listar Reportes (ID ${idParqueadero}): ${duracion}ms`);
    expect(duracion).toBeLessThan(800);
  });
  
  // HU03: Buscar vehículo por placa
  it('HU03: Buscar vehículo por placa debe ser rápido (<300ms)', async () => {
    const placa = 'ABC123';
    const inicio = Date.now();

    await request(url)
      .get(`/vehicles/placa/${placa}`)
      .expect((res) => {
        if (res.status !== 200 && res.status !== 404) {
          throw new Error(`Error inesperado: ${res.status}`);
        }
      });

    const duracion = Date.now() - inicio;
    console.log(` Latencia Buscar Vehículo (${placa}): ${duracion}ms`);
    expect(duracion).toBeLessThan(300);
  });
});