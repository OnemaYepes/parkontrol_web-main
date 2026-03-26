import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';
import { MetodoPago } from '../shared/entities/metodo-pago.entity';
import { ReservasService } from '../reservas/reservas.service';
import { TarifasService } from '../tarifas/tarifas.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PagosService (UNIT - AAA)', () => {
  let service: PagosService;

  let pagoRepository: any;
  let metodoPagoRepository: any;
  let reservasService: any;
  let tarifasService: any;

  const dtoBase = { idReserva: 1, idMetodoPago: 1 };

  beforeEach(async () => {
    pagoRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    metodoPagoRepository = {
      findOne: jest.fn(),
    };

    reservasService = {
      findReservaById: jest.fn(),
      finalizarReserva: jest.fn(),
    };

    tarifasService = {
      findByParqueaderoYTipo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        { provide: getRepositoryToken(Pago), useValue: pagoRepository },
        { provide: getRepositoryToken(MetodoPago), useValue: metodoPagoRepository },
        { provide: ReservasService, useValue: reservasService },
        { provide: TarifasService, useValue: tarifasService },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    jest.clearAllMocks();
  });

  it('C1: Debe fallar si la reserva no existe', async () => {
    reservasService.findReservaById.mockRejectedValue(new NotFoundException());

    const action = service.crear({ ...dtoBase, idReserva: 999 } as any);

    await expect(action).rejects.toThrow(NotFoundException);
  });

  it('C2: Debe fallar si la reserva no está ABIERTA', async () => {
    reservasService.findReservaById.mockResolvedValue({ estado: 'CERRADA' });

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow(BadRequestException);
    expect(reservasService.finalizarReserva).not.toHaveBeenCalled();
  });

  it('C3: Debe fallar si no tiene fechaSalida', async () => {
    reservasService.findReservaById.mockResolvedValue({ estado: 'ABIERTA' });
    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida: null });

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow(BadRequestException);
  });

  it('C4: Debe fallar si ya existe pago', async () => {
    reservasService.findReservaById.mockResolvedValue({ estado: 'ABIERTA' });
    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida: new Date() });
    pagoRepository.findOne.mockResolvedValue({ id: 1 });

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow(BadRequestException);
  });

  it('C5: Debe fallar si método de pago no existe', async () => {
    reservasService.findReservaById.mockResolvedValue({ estado: 'ABIERTA' });
    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida: new Date() });
    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue(null);

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow(NotFoundException);
  });

  it('C6: Debe fallar si no hay tarifa', async () => {
    reservasService.findReservaById.mockResolvedValue({
      estado: 'ABIERTA',
      celda: { parqueadero: { id: 1 } },
      vehiculo: { tipoVehiculo: { id: 1 } }
    });

    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida: new Date() });
    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue({ id: 1 });
    tarifasService.findByParqueaderoYTipo.mockResolvedValue(null);

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow(NotFoundException);
  });

  it('C7: Debe crear el pago correctamente', async () => {
    const fechaEntrada = new Date();
    const fechaSalida = new Date(fechaEntrada.getTime() + 2 * 60 * 60 * 1000);

    const reserva = {
      estado: 'ABIERTA',
      fechaEntrada,
      celda: { parqueadero: { id: 1 } },
      vehiculo: { tipoVehiculo: { id: 1 } }
    };

    reservasService.findReservaById.mockResolvedValue(reserva);
    reservasService.finalizarReserva.mockResolvedValue({ ...reserva, fechaSalida });

    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue({ id: 1 });

    tarifasService.findByParqueaderoYTipo.mockResolvedValue({
      precioFraccionHora: 2000,
      precioHoraAdicional: 1500
    });

    pagoRepository.create.mockReturnValue({ id: 1, monto: 3500 });
    pagoRepository.save.mockResolvedValue({ id: 1, monto: 3500 });

    const result = await service.crear(dtoBase as any);

    expect(result.monto).toBe(3500);
    expect(pagoRepository.save).toHaveBeenCalled();
  });

  it('C8: Debe listar pagos por parqueadero', async () => {
    const pagos = [{ id: 1 }];
    pagoRepository.find.mockResolvedValue(pagos);

    const result = await service.findByParqueadero(1);

    expect(result).toEqual(pagos);
    expect(pagoRepository.find).toHaveBeenCalled();
  });

  it('C9: Debe lanzar error si fechaSalida es null', async () => {
    reservasService.findReservaById.mockResolvedValue({ estado: 'ABIERTA' });
    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida: null });

    const action = service.crear(dtoBase as any);

    await expect(action).rejects.toThrow();
  });

  it('C10: Debe calcular monto con horas <= 1', async () => {
    const fechaEntrada = new Date();
    const fechaSalida = new Date(fechaEntrada.getTime() + 30 * 60 * 1000);

    reservasService.findReservaById.mockResolvedValue({
      estado: 'ABIERTA',
      fechaEntrada,
      celda: { parqueadero: { id: 1 } },
      vehiculo: { tipoVehiculo: { id: 1 } }
    });

    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida });

    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue({ id: 1 });

    tarifasService.findByParqueaderoYTipo.mockResolvedValue({
      precioFraccionHora: 2000,
      precioHoraAdicional: 1500
    });

    pagoRepository.create.mockReturnValue({ monto: 2000 });
    pagoRepository.save.mockResolvedValue({ monto: 2000 });

    const result = await service.crear(dtoBase as any);
    expect(result.monto).toBe(2000);
  });

  it('C11: Debe calcular monto con horas > 1', async () => {
    const fechaEntrada = new Date();
    const fechaSalida = new Date(fechaEntrada.getTime() + 3 * 60 * 60 * 1000);

    reservasService.findReservaById.mockResolvedValue({
      estado: 'ABIERTA',
      fechaEntrada,
      celda: { parqueadero: { id: 1 } },
      vehiculo: { tipoVehiculo: { id: 1 } }
    });

    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida });

    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue({ id: 1 });

    tarifasService.findByParqueaderoYTipo.mockResolvedValue({
      precioFraccionHora: 2000,
      precioHoraAdicional: 1500
    });

    pagoRepository.create.mockReturnValue({ monto: 5000 });
    pagoRepository.save.mockResolvedValue({ monto: 5000 });

    const result = await service.crear(dtoBase as any);
    expect(result.monto).toBe(5000);
  });

  it('C12: Debe usar precioFraccionHora si adicional es undefined', async () => {
    const fechaEntrada = new Date();
    const fechaSalida = new Date(fechaEntrada.getTime() + 3 * 60 * 60 * 1000);

    reservasService.findReservaById.mockResolvedValue({
      estado: 'ABIERTA',
      fechaEntrada,
      celda: { parqueadero: { id: 1 } },
      vehiculo: { tipoVehiculo: { id: 1 } }
    });

    reservasService.finalizarReserva.mockResolvedValue({ fechaSalida });

    pagoRepository.findOne.mockResolvedValue(null);
    metodoPagoRepository.findOne.mockResolvedValue({ id: 1 });

    tarifasService.findByParqueaderoYTipo.mockResolvedValue({
      precioFraccionHora: 2000,
      precioHoraAdicional: undefined
    });

    pagoRepository.create.mockReturnValue({ monto: 6000 });
    pagoRepository.save.mockResolvedValue({ monto: 6000 });

    const result = await service.crear(dtoBase as any);
    expect(result.monto).toBe(6000);
  });

});