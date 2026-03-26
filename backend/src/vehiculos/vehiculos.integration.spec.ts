import { Test, TestingModule } from '@nestjs/testing';
import { VehiculosService } from './vehiculos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { TipoVehiculo } from 'src/shared/entities/tipo-vehiculo.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('VehiculosService - HU11 Buscar vehiculo por placa', () => {
  let service: VehiculosService;
  let vehiculoRepository: Repository<Vehiculo>;

  const mockVehiculoRepository = {
    findOne: jest.fn(),
  };

  const mockTipoVehiculoRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculosService,
        {
          provide: getRepositoryToken(Vehiculo),
          useValue: mockVehiculoRepository,
        },
        {
          provide: getRepositoryToken(TipoVehiculo),
          useValue: mockTipoVehiculoRepository,
        },
      ],
    }).compile();

    service = module.get<VehiculosService>(VehiculosService);
    vehiculoRepository = module.get<Repository<Vehiculo>>(getRepositoryToken(Vehiculo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * CAMINO 1
   * 1-2-3-4-5
   * Retorna vehículo encontrado
   */
  it('debe retornar el vehículo encontrado por placa', async () => {

    const vehiculoMock = {
      id: 1,
      placa: 'ABC123',
      tipoVehiculo: { id: 1, nombre: 'Carro' },
    };

    mockVehiculoRepository.findOne.mockResolvedValue(vehiculoMock);

    const result = await service.findByPlaca('abc123');

    expect(mockVehiculoRepository.findOne).toHaveBeenCalledWith({
      where: { placa: 'ABC123' },
      relations: ['tipoVehiculo'],
    });

    expect(result).toEqual(vehiculoMock);
  });


  /**
   * Caso cuando no existe vehículo
   */
  it('debe retornar null si el vehículo no existe', async () => {

    mockVehiculoRepository.findOne.mockResolvedValue(null);

    const result = await service.findByPlaca('ABC999');

    expect(mockVehiculoRepository.findOne).toHaveBeenCalled();
    expect(result).toBeNull();
  });

});

describe('VehiculosService (UNIT)', () => {
  let service: VehiculosService;

  const mockVehiculoRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTipoVehiculoRepository = {
    findOne: jest.fn(),
  };

  const crearVehiculoMock = (id: number, placa: string, tipo: string) => ({
    id,
    placa,
    tipoVehiculo: { id: 1, nombre: tipo },
  });

  const crearTipoVehiculoMock = (id: number, nombre: string) => ({ id, nombre });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculosService,
        { provide: getRepositoryToken(Vehiculo), useValue: mockVehiculoRepository },
        { provide: getRepositoryToken(TipoVehiculo), useValue: mockTipoVehiculoRepository },
      ],
    }).compile();

    service = module.get<VehiculosService>(VehiculosService);
    jest.clearAllMocks();
  });

  const dtoBase = { placa: 'ABC123', idTipoVehiculo: 1 };

  it('C1: Debe fallar si la placa ya existe', async () => {
    mockVehiculoRepository.findOne.mockResolvedValue({ id: 1, placa: 'ABC123' });

    await expect(service.crear(dtoBase as any)).rejects.toThrow(ConflictException);
    expect(mockTipoVehiculoRepository.findOne).not.toHaveBeenCalled();
    expect(mockVehiculoRepository.save).not.toHaveBeenCalled();
  });

  it('C2: Debe fallar si el tipo de vehículo no existe', async () => {
    mockVehiculoRepository.findOne.mockResolvedValue(null);
    mockTipoVehiculoRepository.findOne.mockResolvedValue(null);

    await expect(service.crear(dtoBase as any)).rejects.toThrow(NotFoundException);
    expect(mockVehiculoRepository.save).not.toHaveBeenCalled();
  });

  it('C3: Debe crear vehículo correctamente', async () => {
    const tipoVehiculoMock = crearTipoVehiculoMock(1, 'CARRO');
    const vehiculoMock = crearVehiculoMock(1, 'ABC123', 'CARRO');

    mockVehiculoRepository.findOne.mockResolvedValue(null);
    mockTipoVehiculoRepository.findOne.mockResolvedValue(tipoVehiculoMock);
    mockVehiculoRepository.create.mockReturnValue(vehiculoMock);
    mockVehiculoRepository.save.mockResolvedValue(vehiculoMock);

    const result = await service.crear(dtoBase as any);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.placa).toBe('ABC123');
    expect(mockVehiculoRepository.save).toHaveBeenCalled();
  });

  it('C4: Debe encontrar vehículo por placa', async () => {
    const vehiculoMock = crearVehiculoMock(1, 'ABC123', 'CARRO');
    mockVehiculoRepository.findOne.mockResolvedValue(vehiculoMock);

    const result = await service.findByPlaca('ABC123');

    expect(result).toBeDefined();
    expect(result?.placa).toBe('ABC123');
  });

  it('C5: Debe encontrar vehículo por ID', async () => {
    const vehiculoMock = crearVehiculoMock(1, 'ABC123', 'CARRO');
    mockVehiculoRepository.findOne.mockResolvedValue(vehiculoMock);

    const result = await service.findVehiculoById(1);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  it('C6: Debe fallar al buscar vehículo por ID que no existe', async () => {
    mockVehiculoRepository.findOne.mockResolvedValue(null);

    await expect(service.findVehiculoById(999)).rejects.toThrow(NotFoundException);
  });
});