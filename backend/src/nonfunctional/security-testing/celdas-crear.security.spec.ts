import { CeldasService } from 'src/celdas/celdas.service';

describe('Security Testing - Crear celda (Backend)', () => {
  it('no debe persistir tipo y sensor que no existan', async () => {
    const celdaRepo = { create: jest.fn(), save: jest.fn() };
    const service = new CeldasService(
      celdaRepo as any,
      { findOne: jest.fn(async () => null) } as any,
      { findOne: jest.fn(async () => null) } as any,
      { findParqueaderoById: jest.fn(async () => ({ id: 1 })) } as any,
    );

    await expect(service.crear({ idParqueadero: 1, idTipoCelda: 99, idSensor: 88, estado: 'LIBRE' } as any)).rejects.toThrow();
    expect(celdaRepo.save).not.toHaveBeenCalled();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 5c8ed22fb786ea560cc3dd99e8c132c204f43ab6
