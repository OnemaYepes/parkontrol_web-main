import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TarifasComponent } from './tarifas.component';
import { TarifasService } from '../../services/tarifas.service';
import { ParqueaderosService } from '../../services/parqueaderos.service';
import { AuthService } from '../../services/autenticacion.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { RolUsuario } from '../../models/shared.model';

// ─────────────────────────────────────────────────────────────────────────────
// Fábricas de datos de prueba
// ─────────────────────────────────────────────────────────────────────────────
const mockUsuario = (overrides: Partial<Usuario> = {}): Usuario => ({
  id: 1,
  idEmpresa: 1,
  nombre: 'Admin',
  correo: 'admin@test.com',
  rol: RolUsuario.ADMINISTRADOR,
  ...overrides,
});

const mockParqueaderos = () => [
  { id: 1, nombre: 'Parqueadero Central', capacidadTotal: 100, ubicacion: 'Centro', idEmpresa: 1 },
  { id: 2, nombre: 'Parqueadero Norte', capacidadTotal: 50, ubicacion: 'Norte', idEmpresa: 1 },
];

const mockTarifas = () => [
  { id: 1, idParqueadero: 1, idTipoVehiculo: 1, precioFraccionHora: 1000, precioHoraAdicional: 2000, parqueadero: mockParqueaderos()[0], tipoVehiculo: { id: 1, nombre: 'Carro' } },
  { id: 2, idParqueadero: 1, idTipoVehiculo: 2, precioFraccionHora: 800, precioHoraAdicional: 1500, parqueadero: mockParqueaderos()[0], tipoVehiculo: { id: 2, nombre: 'Moto' } },
];

const mockTarifaNueva = () => ({
  idParqueadero: 1,
  idTipoVehiculo: 1,
  precioFraccionHora: 1200,
  precioHoraAdicional: 2500,
});

const mockTarifaActualizada = () => ({
  precioFraccionHora: 1300,
  precioHoraAdicional: 2600,
});

describe('TarifasComponent - HU-27: Crear Tarifa (Caja Blanca)', () => {
  let component: TarifasComponent;
  let fixture: ComponentFixture<TarifasComponent>;

  // Las instancias de los spies se crean una vez pero se reconfiguran en cada beforeEach
  let tarifasServiceSpy: jasmine.SpyObj<TarifasService>;
  let parqueaderosServiceSpy: jasmine.SpyObj<ParqueaderosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Se crean spies frescos en cada test → elimina el estado compartido entre pruebas
    tarifasServiceSpy = jasmine.createSpyObj('TarifasService', ['create', 'getByParqueadero', 'update']);
    parqueaderosServiceSpy = jasmine.createSpyObj('ParqueaderosService', ['getByEmpresa']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Valores por defecto: respuestas vacías exitosas para todas las peticiones
    // Así cada test parte de un estado limpio y predecible
    tarifasServiceSpy.create.and.returnValue(of(mockTarifas()[0]));
    tarifasServiceSpy.getByParqueadero.and.returnValue(of([]));
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(mockParqueaderos()));
    authServiceSpy.getUsuarioActual.and.returnValue(mockUsuario());
    dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);

    await TestBed.configureTestingModule({
      imports: [TarifasComponent],
      providers: [
        { provide: TarifasService, useValue: tarifasServiceSpy },
        { provide: ParqueaderosService, useValue: parqueaderosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasComponent);
    component = fixture.componentInstance;
    // Configurar parqueaderos para evitar llamadas iniciales
    component.parqueaderos = mockParqueaderos();
    component.parqueaderoSeleccionado = 1;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // abrirModalCrear() — Flujo de creación de tarifa
  // ══════════════════════════════════════════════════════════════════════════
  describe('abrirModalCrear() — creación de tarifas', () => {

    it('Camino 1: Debería crear tarifa y recargar lista si el backend responde éxito', () => {
      // Arrange
      const tarifaData = mockTarifaNueva();
      dialogSpy.open.and.returnValue({ afterClosed: () => of(tarifaData) } as any);
      tarifasServiceSpy.create.and.returnValue(of(mockTarifas()[0]));

      // Act
      component.abrirModalCrear();

      // Assert
      expect(tarifasServiceSpy.create).toHaveBeenCalledWith(tarifaData);
      expect(tarifasServiceSpy.getByParqueadero).toHaveBeenCalledWith(1);
    });

    it('Camino 2: Debería mostrar error específico si el tipo de vehículo no existe (404)', fakeAsync(() => {
      // Arrange
      const error404 = { status: 404, error: { message: 'Tipo de vehículo no encontrado' } };
      dialogSpy.open.and.returnValue({ afterClosed: () => of(mockTarifaNueva()) } as any);
      tarifasServiceSpy.create.and.returnValue(throwError(() => error404));

      // Act
      component.abrirModalCrear();
      tick();

      // Assert
      expect(component.errorMessage).toBe('No existe el tipo de vehiculo con el id ingresado');
      tick(5000);
      expect(component.errorMessage).toBe('');
    }));

    it('Camino 3: Debería mostrar error genérico ante fallas del servidor (500)', fakeAsync(() => {
      // Arrange
      const error500 = { status: 500 };
      dialogSpy.open.and.returnValue({ afterClosed: () => of(mockTarifaNueva()) } as any);
      tarifasServiceSpy.create.and.returnValue(throwError(() => error500));

      // Act
      component.abrirModalCrear();
      tick();

      // Assert
      expect(component.errorMessage).toBe('Error al crear la tarifa');
      tick(5000);
      expect(component.errorMessage).toBe('');
    }));

    it('Camino 4: No debería llamar al servicio si el usuario cancela el modal', () => {
      // Arrange
      dialogSpy.open.and.returnValue({ afterClosed: () => of(null) } as any);

      // Act
      component.abrirModalCrear();

      // Assert
      expect(tarifasServiceSpy.create).not.toHaveBeenCalled();
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // abrirModalEditar() — Flujo de edición de tarifa
  // ══════════════════════════════════════════════════════════════════════════
  describe('abrirModalEditar() — edición de tarifas', () => {

    it('Camino 1: Debería actualizar tarifa y recargar lista si el backend responde éxito', () => {
      // Arrange
      const tarifaExistente = mockTarifas()[0];
      const datosEditados = mockTarifaActualizada();
      const dialogSpyEdit = jasmine.createSpyObj('MatDialog', ['open']);
      const tarifasServiceSpyEdit = jasmine.createSpyObj('TarifasService', ['update', 'getByParqueadero']);
      
      dialogSpyEdit.open.and.returnValue({ afterClosed: () => of(datosEditados) } as any);
      tarifasServiceSpyEdit.update.and.returnValue(of({ ...tarifaExistente, ...datosEditados }));
      tarifasServiceSpyEdit.getByParqueadero.and.returnValue(of([]));

      // Configurar el componente con los spies
      component.parqueaderoSeleccionado = 1;
      (component as any).tarifasService = tarifasServiceSpyEdit;
      (component as any).dialog = dialogSpyEdit;

      // Act
      component.abrirModalEditar(tarifaExistente);

      // Assert
      expect(tarifasServiceSpyEdit.update).toHaveBeenCalledWith(tarifaExistente.id, datosEditados);
      expect(tarifasServiceSpyEdit.getByParqueadero).toHaveBeenCalledWith(1);
    });

    it('Camino 2: Debería mostrar error y limpiarlo tras 5s si la API falla', fakeAsync(() => {
      // Arrange
      const tarifaExistente = mockTarifas()[0];
      const error500 = { status: 500 };
      const dialogSpyEdit = jasmine.createSpyObj('MatDialog', ['open']);
      const tarifasServiceSpyEdit = jasmine.createSpyObj('TarifasService', ['update', 'getByParqueadero']);
      
      dialogSpyEdit.open.and.returnValue({ afterClosed: () => of(mockTarifaActualizada()) } as any);
      tarifasServiceSpyEdit.update.and.returnValue(throwError(() => error500));

      // Configurar el componente con los spies
      (component as any).tarifasService = tarifasServiceSpyEdit;
      (component as any).dialog = dialogSpyEdit;

      // Act
      component.abrirModalEditar(tarifaExistente);
      tick();

      // Assert
      expect(component.errorMessage).toBe('Error al actualizar la tarifa');
      tick(5000);
      expect(component.errorMessage).toBe('');
    }));

    it('Camino 3: No debería llamar al servicio si el usuario cancela el modal', () => {
      // Arrange
      const tarifaExistente = mockTarifas()[0];
      const dialogSpyEdit = jasmine.createSpyObj('MatDialog', ['open']);
      const tarifasServiceSpyEdit = jasmine.createSpyObj('TarifasService', ['update', 'getByParqueadero']);
      
      dialogSpyEdit.open.and.returnValue({ afterClosed: () => of(null) } as any);

      // Configurar el componente con los spies
      (component as any).tarifasService = tarifasServiceSpyEdit;
      (component as any).dialog = dialogSpyEdit;

      // Act
      component.abrirModalEditar(tarifaExistente);

      // Assert
      expect(tarifasServiceSpyEdit.update).not.toHaveBeenCalled();
    });

  });

});

describe('TarifasComponent - HU-28: Listar Tarifas (Caja Blanca)', () => {
  let component: TarifasComponent;
  let fixture: ComponentFixture<TarifasComponent>;

  // Las instancias de los spies se crean una vez pero se reconfiguran en cada beforeEach
  let tarifasServiceSpy: jasmine.SpyObj<TarifasService>;
  let parqueaderosServiceSpy: jasmine.SpyObj<ParqueaderosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    // Se crean spies frescos en cada test → elimina el estado compartido entre pruebas
    tarifasServiceSpy = jasmine.createSpyObj('TarifasService', ['getByParqueadero']);
    parqueaderosServiceSpy = jasmine.createSpyObj('ParqueaderosService', ['getByEmpresa']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Valores por defecto: respuestas vacías exitosas para todas las peticiones
    // Así cada test parte de un estado limpio y predecible
    tarifasServiceSpy.getByParqueadero.and.returnValue(of([]));
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(mockParqueaderos()));
    authServiceSpy.getUsuarioActual.and.returnValue(mockUsuario());

    await TestBed.configureTestingModule({
      imports: [TarifasComponent],
      providers: [
        { provide: TarifasService, useValue: tarifasServiceSpy },
        { provide: ParqueaderosService, useValue: parqueaderosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasComponent);
    component = fixture.componentInstance;
    spyOn(console, 'error'); // Para capturar logs de error
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ngOnInit() → cargarParqueaderos() — Inicialización del componente
  // ══════════════════════════════════════════════════════════════════════════
  describe('cargarParqueaderos() — inicialización y validación de usuario', () => {

    it('Camino 1: No debería cargar nada si no hay usuario autenticado', () => {
      // Arrange
      authServiceSpy.getUsuarioActual.and.returnValue(null);

      // Act
      fixture.detectChanges(); // Dispara ngOnInit → cargarParqueaderos()

      // Assert
      expect(component.loading).toBeFalse();
      expect(parqueaderosServiceSpy.getByEmpresa).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith('No hay usuario autenticado');
    });

    it('Camino 2: No debería cargar nada si el usuario no tiene idEmpresa', () => {
      // Arrange
      authServiceSpy.getUsuarioActual.and.returnValue({ nombre: 'Sin empresa', idEmpresa: null } as any);

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.loading).toBeFalse();
      expect(parqueaderosServiceSpy.getByEmpresa).not.toHaveBeenCalled();
    });

    it('Camino 3: Debería manejar error al obtener parqueaderos', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(throwError(() => new Error('Error API')));

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error cargando los parqueaderos', jasmine.any(Error));
    });

    it('Camino 4: Debería detenerse si la empresa no tiene parqueaderos', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(of([]));

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.parqueaderos.length).toBe(0);
      expect(component.loading).toBeFalse();
      expect(tarifasServiceSpy.getByParqueadero).not.toHaveBeenCalled();
    });

    it('Camino 5: Debería cargar parqueaderos y seleccionar el primero automáticamente', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(mockParqueaderos()));

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.parqueaderos).toEqual(mockParqueaderos());
      expect(component.parqueaderoSeleccionado).toBe(1);
      expect(tarifasServiceSpy.getByParqueadero).toHaveBeenCalledWith(1);
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // cargarTarifas() — Carga de tarifas por parqueadero
  // ══════════════════════════════════════════════════════════════════════════
  describe('cargarTarifas() — obtención de tarifas', () => {

    it('Camino 1: Debería manejar error al obtener tarifas', () => {
      // Arrange
      component.parqueaderoSeleccionado = 1;
      tarifasServiceSpy.getByParqueadero.and.returnValue(throwError(() => new Error('Error tarifas')));

      // Act
      (component as any).cargarTarifas(1);

      // Assert
      expect(component.tarifas).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error no cargaron las tarifas', jasmine.any(Error));
    });

    it('Camino 2: Debería cargar tarifas correctamente', () => {
      // Arrange
      component.parqueaderoSeleccionado = 1;
      const tarifas = mockTarifas();
      tarifasServiceSpy.getByParqueadero.and.returnValue(of(tarifas));

      // Act
      (component as any).cargarTarifas(1);

      // Assert
      expect(component.tarifas).toEqual(tarifas);
      expect(component.loading).toBeFalse();
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // onParqueaderoCambia() — Cambio de parqueadero seleccionado
  // ══════════════════════════════════════════════════════════════════════════
  describe('onParqueaderoCambia() — cambio de selección', () => {

    it('Camino 1: Debería actualizar parqueadero seleccionado y recargar tarifas', () => {
      // Arrange
      const nuevoId = 2;
      spyOn(console, 'log');

      // Act
      component.onParqueaderoCambia(nuevoId);

      // Assert
      expect(component.parqueaderoSeleccionado).toBe(nuevoId);
      expect(tarifasServiceSpy.getByParqueadero).toHaveBeenCalledWith(nuevoId);
      expect(console.log).toHaveBeenCalledWith('tarifas obtenidas', jasmine.any(Object));
    });

  });

});

// Vale y dilan

describe('HU-07: Consultar parqueadero por ID (FRONT)', () => {

  let component: TarifasComponent;
  let fixture: ComponentFixture<TarifasComponent>;

  let tarifasServiceMock: any;
  let parqueaderosServiceMock: any;
  let authServiceMock: any;
  let dialogMock: any;

  beforeEach(async () => {

    tarifasServiceMock = {
      getByParqueadero: jasmine.createSpy('getByParqueadero').and.returnValue(of([])),
      create: jasmine.createSpy('create').and.returnValue(of({})),
      update: jasmine.createSpy('update').and.returnValue(of({}))
    };

    parqueaderosServiceMock = {
      getByEmpresa: jasmine.createSpy('getByEmpresa').and.returnValue(of([
        { id: 1, nombre: 'Central' }
      ]))
    };

    authServiceMock = {
      getUsuarioActual: jasmine.createSpy('getUsuarioActual').and.returnValue({
        idEmpresa: 10
      })
    };

    dialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(null)
      })
    };

    await TestBed.configureTestingModule({
      imports: [TarifasComponent],
      providers: [
        { provide: TarifasService, useValue: tarifasServiceMock },
        { provide: ParqueaderosService, useValue: parqueaderosServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatDialog, useValue: dialogMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TarifasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    it('Camino 1-2-3: debe cargar parqueaderos y consultar tarifas por ID', () => {

    expect(parqueaderosServiceMock.getByEmpresa).toHaveBeenCalledWith(10);

    expect(component.parqueaderoSeleccionado).toBe(1);

    expect(tarifasServiceMock.getByParqueadero).toHaveBeenCalledWith(1);
    })
})