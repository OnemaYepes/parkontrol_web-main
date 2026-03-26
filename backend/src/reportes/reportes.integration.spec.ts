import { Test, TestingModule } from '@nestjs/testing';
import { ReportesService } from './reportes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { Reporte } from './entities/reporte.entity';
import { Periodo } from 'src/shared/entities/periodo.entity';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

describe('ReportesService - HU37 findByParqueadero', () => {
  let service: ReportesService;
  let reporteRepository: jest.Mocked<Repository<Reporte>>;

  const mockReporteRepository = {
    find: jest.fn(),
  };

  const mockPeriodoRepository = {};
  const mockParqueaderosService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportesService,
        {
          provide: getRepositoryToken(Reporte),
          useValue: mockReporteRepository,
        },
        {
          provide: getRepositoryToken(Periodo),
          useValue: mockPeriodoRepository,
        },
        {
          provide: ParqueaderosService,
          useValue: mockParqueaderosService,
        },
      ],
    }).compile();

    service = module.get<ReportesService>(ReportesService);
    reporteRepository = module.get(getRepositoryToken(Reporte));

    jest.clearAllMocks();
  });

  // ✅ CAMINO 1: 1-2-3-4 → Retorna lista de reportes
  it('debe retornar reportes por parqueadero ordenados por id DESC', async () => {
    const idParqueadero = 5;

    const reportesMock = [
      { id: 10 },
      { id: 9 },
    ] as Reporte[];

    reporteRepository.find.mockResolvedValue(reportesMock);

    const resultado = await service.findByParqueadero(idParqueadero);

    // 🔥 Verifica la query completa (MUY IMPORTANTE)
    expect(reporteRepository.find).toHaveBeenCalledWith({
      where: { parqueadero: { id: idParqueadero } },
      relations: ['parqueadero', 'periodo'],
      order: { id: 'DESC' },
    });

    expect(resultado).toEqual(reportesMock);
  });
});

describe('ReportesService', () => {
  let service: ReportesService;
  let reporteRepository;
  let periodoRepository;
  let parqueaderosService;

  const mockReporte = { id: 1, urlArchivo: 'test.pdf' };
  const mockParqueadero = { id: 10, nombre: 'Parqueadero Central' };
  const mockPeriodo = { id: 5, nombre: '2024-01' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportesService,
        {
          provide: getRepositoryToken(Reporte),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Periodo),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ParqueaderosService,
          useValue: {
            findParqueaderoById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportesService>(ReportesService);
    reporteRepository = module.get(getRepositoryToken(Reporte));
    periodoRepository = module.get(getRepositoryToken(Periodo));
    parqueaderosService = module.get(ParqueaderosService);
  });

  // --- PRUEBA PARA EL CAMINO 1 (DIAGRAMA HU-37) ---
  describe('findByParqueadero (Camino 1: Nodos 1-2-3-4)', () => {
    it('debe retornar una lista de reportes ordenados descendente', async () => {
      const mockReportes = [mockReporte];
      reporteRepository.find.mockResolvedValue(mockReportes);

      const result = await service.findByParqueadero(10);

      // Verificación de lógica del diagrama
      expect(reporteRepository.find).toHaveBeenCalledWith({
        where: { parqueadero: { id: 10 } },
        relations: ['parqueadero', 'periodo'],
        order: { id: 'DESC' }, // Nodo 3
      });
      expect(result).toEqual(mockReportes); // Nodo 4
    });
  });

  // --- PRUEBAS PARA COVERAGE > 80% ---
  describe('findReporteById', () => {
    it('debe retornar un reporte si existe', async () => {
      reporteRepository.findOne.mockResolvedValue(mockReporte);
      expect(await service.findReporteById(1)).toEqual(mockReporte);
    });

    it('debe lanzar NotFoundException si no existe', async () => {
      reporteRepository.findOne.mockResolvedValue(null);
      await expect(service.findReporteById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('crear', () => {
    it('debe crear un reporte exitosamente', async () => {
      parqueaderosService.findParqueaderoById.mockResolvedValue(mockParqueadero);
      periodoRepository.findOne.mockResolvedValue(mockPeriodo);
      reporteRepository.create.mockReturnValue(mockReporte);
      reporteRepository.save.mockResolvedValue(mockReporte);

      const dto = { idParqueadero: 10, idPeriodo: 5, urlArchivo: 'test.pdf' };
      const result = await service.crear(dto);

      expect(result).toEqual(mockReporte);
    });

    it('debe lanzar error si el periodo no existe', async () => {
      periodoRepository.findOne.mockResolvedValue(null);
      const dto = { idParqueadero: 1, idPeriodo: 99, urlArchivo: '...' };
      await expect(service.crear(dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('actualizarUrl', () => {
    it('debe actualizar la url del reporte', async () => {
      jest.spyOn(service, 'findReporteById').mockResolvedValue({ ...mockReporte } as any);
      reporteRepository.save.mockResolvedValue({ ...mockReporte, urlArchivo: 'new.pdf' });

      const result = await service.actualizarUrl(1, 'new.pdf');
      expect(result.urlArchivo).toBe('new.pdf');
    });
  });
});