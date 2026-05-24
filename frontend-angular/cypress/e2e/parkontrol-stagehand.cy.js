const Stagehand = require('../support/stagehand');

describe('Parkontrol Stagehand flows para IA + funcionalidades', () => {
  const adminEmail = 'admin1@example.com';
  const adminPassword = 'AdminPass1';
  const randomId = () => Math.floor(Math.random() * 1000000);
  const uniqueEmail = () => `cypress-stagehand-${Date.now()}-${randomId()}@example.com`;
  const uniquePlate = () => `STG${randomId()}`;
  const uniqueParqueadero = () => `Stagehand Parqueadero ${Date.now()}-${randomId()}`;

  it('FUNCIONALIDAD 1: Registrar usuario', () => {
    Stagehand.registerUsuario({
      nombre: 'Stagehand Admin',
      correo: uniqueEmail(),
      contrasena: 'Admin1234',
      idEmpresa: '1',
    });
  });

  it('FUNCIONALIDAD 2: Crear parqueadero (HU-03)', () => {
    Stagehand.createParqueadero({
      nombre: uniqueParqueadero(),
      ubicacion: 'Ubicacion Stagehand',
      capacidad: 25,
      adminEmail,
      adminPassword,
    });
  });

  it('FUNCIONALIDAD 3: Registrar vehículo (HU-10)', () => {
    Stagehand.registerVehiculo({
      placa: uniquePlate(),
      tipoVehiculo: '1',
      adminEmail,
      adminPassword,
    });
  });

  it('FUNCIONALIDAD 4: Crear reserva (HU-13)', () => {
    Stagehand.createReserva({
      placa: uniquePlate(),
      adminEmail,
      adminPassword,
    });
  });

  it('FUNCIONALIDAD 5: Registrar pago (HU-18)', () => {
    Stagehand.registerPago({
      placa: uniquePlate(),
      metodoPago: '1',
      adminEmail,
      adminPassword,
    });
  });
});
