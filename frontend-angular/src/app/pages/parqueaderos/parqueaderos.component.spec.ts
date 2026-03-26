import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ParqueaderosComponent } from './parqueaderos.component';
import { ParqueaderosService } from '../../services/parqueaderos.service';
import { AuthService } from '../../services/autenticacion.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { RolUsuario } from '../../models/shared.model';
import { CrearParqueaderoDto } from '../../models/parqueadero.model';

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

const mockParqueaderoNuevo = (): CrearParqueaderoDto => ({
  nombre: 'Parqueadero Nuevo',
  capacidadTotal: 75,
  ubicacion: 'Sur',
  idEmpresa: 1,
});

describe('ParqueaderosComponent - HU-04: Gestionar Parqueaderos (Caja Blanca)', () => {
  let component: ParqueaderosComponent;
  let fixture: ComponentFixture<ParqueaderosComponent>;

  // Las instancias de los spies se crean una vez pero se reconfiguran en cada beforeEach
  let parqueaderosServiceSpy: jasmine.SpyObj<ParqueaderosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let mockDialogRef: any;

  beforeEach(async () => {
    // Se crean spies frescos en cada test → elimina el estado compartido entre pruebas
    parqueaderosServiceSpy = jasmine.createSpyObj('ParqueaderosService', ['getByEmpresa', 'create']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'isAdministrador']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    // Crear mock del dialog ref con afterClosed que puede ser reconfigurado
    mockDialogRef = {
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(null))
    };

    // Valores por defecto: respuestas vacías exitosas para todas las peticiones
    // Así cada test parte de un estado limpio y predecible
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(of([]));
    parqueaderosServiceSpy.create.and.returnValue(of(mockParqueaderos()[0]));
    authServiceSpy.getUsuarioActual.and.returnValue(mockUsuario());
    authServiceSpy.isAdministrador.and.returnValue(true);
    dialogSpy.open.and.returnValue(mockDialogRef);

    await TestBed.configureTestingModule({
      imports: [ParqueaderosComponent],
      providers: [
        { provide: ParqueaderosService, useValue: parqueaderosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ParqueaderosComponent);
    component = fixture.componentInstance;
  });

  // ══════════════════════════════════════════════════════════════════════════
  // ngOnInit() → obtenerEmpresaUsuario() + cargarParqueaderos() — Inicialización
  // ══════════════════════════════════════════════════════════════════════════
  describe('ngOnInit() — inicialización del componente', () => {

    it('Camino 1: Debería inicializar correctamente con usuario administrador y empresa válida', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(mockParqueaderos()));

      // Act
      fixture.detectChanges(); // Dispara ngOnInit

      // Assert
      expect(component.idEmpresa).toBe(1);
      expect(component.usuarioIsAdmin).toBeTrue();
      expect(component.parqueaderos).toEqual(mockParqueaderos());
      expect(component.loading).toBeFalse();
      expect(parqueaderosServiceSpy.getByEmpresa).toHaveBeenCalledWith(1);
    });

    it('Camino 2: Debería inicializar con lista vacía si la empresa no tiene parqueaderos', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(of([]));

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.parqueaderos).toEqual([]);
      expect(component.loading).toBeFalse();
    });

    it('Camino 3: Debería manejar error al cargar parqueaderos en inicialización', () => {
      // Arrange
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(throwError(() => new Error('Error API')));
      spyOn(console, 'error');

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error al cargar parqueaderos:', jasmine.any(Error));
    });

    it('Camino 4: No debería cargar parqueaderos si no hay usuario autenticado', () => {
      // Arrange
      authServiceSpy.getUsuarioActual.and.returnValue(null);

      // Act
      fixture.detectChanges();

      // Assert
      expect(component.idEmpresa).toBeNull();
      expect(component.loading).toBeFalse();
      expect(parqueaderosServiceSpy.getByEmpresa).not.toHaveBeenCalled();
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // cargarParqueaderos() — Carga de parqueaderos por empresa
  // ══════════════════════════════════════════════════════════════════════════
  describe('cargarParqueaderos() — obtención de parqueaderos', () => {

    it('Camino 1: Debería cargar parqueaderos correctamente cuando hay datos', () => {
      // Arrange
      component.idEmpresa = 1;
      const parqueaderos = mockParqueaderos();
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(parqueaderos));

      // Act
      (component as any).cargarParqueaderos();

      // Assert
      expect(component.parqueaderos).toEqual(parqueaderos);
      expect(component.loading).toBeFalse();
      expect(parqueaderosServiceSpy.getByEmpresa).toHaveBeenCalledWith(1);
    });

    it('Camino 2: Debería manejar error al obtener parqueaderos', () => {
      // Arrange
      component.idEmpresa = 1;
      parqueaderosServiceSpy.getByEmpresa.and.returnValue(throwError(() => new Error('Error API')));
      spyOn(console, 'error');

      // Act
      (component as any).cargarParqueaderos();

      // Assert
      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalledWith('Error al cargar parqueaderos:', jasmine.any(Error));
    });

    it('Camino 3: No debería hacer nada si no hay idEmpresa', () => {
      // Arrange
      component.idEmpresa = null;

      // Act
      (component as any).cargarParqueaderos();

      // Assert
      expect(parqueaderosServiceSpy.getByEmpresa).not.toHaveBeenCalled();
    });

  });

  // ══════════════════════════════════════════════════════════════════════════
  // crearParqueadero() — Creación de parqueaderos
  // ══════════════════════════════════════════════════════════════════════════
  describe('crearParqueadero() — creación de parqueaderos', () => {

    it('Camino 1: Debería agregar parqueadero a la lista si el backend responde éxito', () => {
      // Arrange
      component.parqueaderos = [mockParqueaderos()[0]];
      const datosParqueadero = mockParqueaderoNuevo();
      const parqueaderoCreado = { ...datosParqueadero, id: 3 };
      parqueaderosServiceSpy.create.and.returnValue(of(parqueaderoCreado));

      // Act
      (component as any).crearParqueadero(datosParqueadero);

      // Assert
      expect(parqueaderosServiceSpy.create).toHaveBeenCalledWith(datosParqueadero);
      expect(component.parqueaderos).toContain(parqueaderoCreado);
      expect(component.parqueaderos.length).toBe(2);
    });

    it('Camino 2: Debería manejar error al crear parqueadero', () => {
      // Arrange
      component.parqueaderos = [mockParqueaderos()[0]];
      const datosParqueadero = mockParqueaderoNuevo();
      const error = new Error('Error de validación');
      parqueaderosServiceSpy.create.and.returnValue(throwError(() => error));
      spyOn(console, 'error');

      // Act
      (component as any).crearParqueadero(datosParqueadero);

      // Assert
      expect(parqueaderosServiceSpy.create).toHaveBeenCalledWith(datosParqueadero);
      expect(console.error).toHaveBeenCalledWith('Error crear parqueaero', error);
      expect(component.parqueaderos.length).toBe(1); // Lista original no se modifica
    });

  });

});

describe('ParqueaderosComponent - Validación de Caminos (AAA) Dilan y Vale', () => {
  let component: ParqueaderosComponent;
  let fixture: ComponentFixture<ParqueaderosComponent>;
  let parqueaderosServiceSpy: jasmine.SpyObj<ParqueaderosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockMatDialog = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(null)
    })
  };

  beforeEach(async () => {
    // Arrange (setup de spies y TestBed)
    parqueaderosServiceSpy = jasmine.createSpyObj('ParqueaderosService', ['getByEmpresa', 'create']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual', 'isAdministrador']);

    authServiceSpy.getUsuarioActual.and.returnValue({ id: 1, idEmpresa: 10 } as any);
    authServiceSpy.isAdministrador.and.returnValue(true);
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [
        ParqueaderosComponent
      ],
      providers: [
        { provide: ParqueaderosService, useValue: parqueaderosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .overrideComponent(ParqueaderosComponent, {
      set: {
        providers: [
          { provide: MatDialog, useValue: mockMatDialog }
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParqueaderosComponent);
    component = fixture.componentInstance;

    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  it('Camino 1: Usuario crea parqueadero exitosamente', fakeAsync(() => {
    // Arrange
    const datos = { nombre: 'P1', ubicacion: 'C1', capacidadTotal: 10, idEmpresa: 10 };
    mockMatDialog.open.and.returnValue({
      afterClosed: () => of(datos)
    });
    parqueaderosServiceSpy.create.and.returnValue(of({ id: 1, ...datos } as any));

    // Act
    component.ngOnInit();
    component.abrirModalCrear();
    tick();

    // Assert
    expect(parqueaderosServiceSpy.create).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Parqueadero creado');
  }));

  it('Camino 2: El backend falla al crear parqueadero', fakeAsync(() => {
    // Arrange
    mockMatDialog.open.and.returnValue({
      afterClosed: () => of({ nombre: 'Error' })
    });
    parqueaderosServiceSpy.create.and.returnValue(throwError(() => new Error('Fail')));

    // Act
    component.ngOnInit();
    component.abrirModalCrear();
    tick();

    // Assert
    expect(console.error).toHaveBeenCalled();
  }));

  it('Camino 3: Usuario cancela la creación del parqueadero', fakeAsync(() => {
    // Arrange
    mockMatDialog.open.and.returnValue({
      afterClosed: () => of(null)
    });

    // Act
    component.ngOnInit();
    component.abrirModalCrear();
    tick();

    // Assert
    expect(parqueaderosServiceSpy.create).not.toHaveBeenCalled();
  }));
});