import { ReservasService } from 'src/reservas/reservas.service';

describe('Security Testing - Finalizar reserva (Backend)', () => {
  it('no debe cambiar estado de celda si falla por reserva inexistente', async () => {
    const celdasService = { findCeldaById: jest.fn(), actualizarEstado: jest.fn() };
    const service = new ReservasService(
      { findOne: jest.fn(async () => null), save: jest.fn() } as any,
      { findVehiculoById: jest.fn() } as any,
      celdasService as any,
    );

    await expect(service.finalizarReserva(404)).rejects.toThrow();
    expect(celdasService.actualizarEstado).not.toHaveBeenCalled();
  });
<<<<<<< HEAD
});
=======
});
>>>>>>> 5c8ed22fb786ea560cc3dd99e8c132c204f43ab6
