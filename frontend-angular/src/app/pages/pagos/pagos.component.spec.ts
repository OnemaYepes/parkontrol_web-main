import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PagosComponent } from './pagos.component';
import { PagosService } from '../../services/pagos.service';
import { ParqueaderosService } from '../../services/parqueaderos.service';
import { AuthService } from '../../services/autenticacion.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FacturacionService } from '../../services/facturacion.service';
import { of, throwError } from 'rxjs';
import { Pago } from '../../models/pago.model';
import { Parqueadero } from '../../models/parqueadero.model';

describe('PagosComponent - Test sin Factura', () => {
  let component: PagosComponent;
  let fixture: ComponentFixture<PagosComponent>;

  let pagosServiceSpy: jasmine.SpyObj<PagosService>;
  let parqueaderosServiceSpy: jasmine.SpyObj<ParqueaderosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let facturasServiceSpy: jasmine.SpyObj<FacturacionService>;

  // --- Mocks ---
  const usuarioMock = { id: 1, idEmpresa: 1, nombre: 'Admin Test', correo: 'test@mail.com', rol: 'admin' };
  const parqueaderosMock: Parqueadero[] = [{ id: 1, nombre: 'Parqueadero Central', capacidadTotal: 50, ubicacion: 'Zona A', idEmpresa: 1 }];
  const pagosMock: Pago[] = [{ id: 1, monto: 1000, fechaPago: '2026-03-05', idReserva: 101, idMetodoPago: 1 }];

  // --- Mock de modal de creación de pago ---
  const mockDialogRefPago = jasmine.createSpyObj('MatDialogRef', {
    afterClosed: of({ idReserva: 101, idMetodoPago: 1, monto: 1000 }),
    close: null
  });

  beforeEach(async () => {
    pagosServiceSpy = jasmine.createSpyObj('PagosService', ['getByParqueadero', 'create']);
    parqueaderosServiceSpy = jasmine.createSpyObj('ParqueaderosService', ['getByEmpresa']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    facturasServiceSpy = jasmine.createSpyObj('FacturacionService', ['getFacturaPorPago']);

    // Retornos por defecto
    authServiceSpy.getUsuarioActual.and.returnValue(usuarioMock as any);
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(of(parqueaderosMock));
    pagosServiceSpy.getByParqueadero.and.returnValue(of(pagosMock));

    await TestBed.configureTestingModule({
      imports: [PagosComponent, MatDialogModule],
      providers: [
        { provide: PagosService, useValue: pagosServiceSpy },
        { provide: ParqueaderosService, useValue: parqueaderosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: FacturacionService, useValue: facturasServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PagosComponent);
    component = fixture.componentInstance;
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  // --- CREAR PAGO ÉXITO ---
  it('Debería crear un pago y mostrar mensaje de éxito', fakeAsync(() => {
    pagosServiceSpy.create.and.returnValue(of(pagosMock[0]));
    dialogSpy.open.and.returnValue(mockDialogRefPago);

    component.ngOnInit();
    tick();
    component.parqueaderoSeleccionado = 1;
    component.abrirModalCrear();
    tick();
    tick();

    expect(component.mensajeExito).toContain('Pago procesado exitosamente');
    expect(component.mensajeExito).toContain('1000');
    expect(pagosServiceSpy.getByParqueadero).toHaveBeenCalled();

    tick(3000);
    expect(component.mensajeExito).toBe('');
  }));

  // --- CREAR PAGO ERROR ---
  it('Debería capturar error al crear pago y limpiar mensaje', fakeAsync(() => {
    pagosServiceSpy.create.and.returnValue(throwError(() => new Error('Error de servidor')));
    dialogSpy.open.and.returnValue(mockDialogRefPago);

    component.ngOnInit();
    tick();
    component.parqueaderoSeleccionado = 1;
    component.abrirModalCrear();
    tick();
    tick();

    expect(component.errorMessage).toBe('Error al crear el pago.');

    tick(4000);
    expect(component.errorMessage).toBe('');
  }));

  // --- CARGA PARQUEADEROS ÉXITO ---
  it('Debería cargar parqueaderos y seleccionar el primero', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(component.parqueaderos.length).toBe(1);
    expect(component.parqueaderoSeleccionado).toBe(parqueaderosMock[0].id);
    expect(pagosServiceSpy.getByParqueadero).toHaveBeenCalledWith(parqueaderosMock[0].id);
  }));

  // --- CARGA PARQUEADEROS ERROR ---
  it('Debería mostrar error si falla carga de parqueaderos', fakeAsync(() => {
    parqueaderosServiceSpy.getByEmpresa.and.returnValue(throwError(() => new Error('Fallo')));
    component.ngOnInit();
    tick();

    expect(component.errorMessage).toBe('Error al cargar los parqueaderos');

    tick(4000);
    expect(component.errorMessage).toBe('');
  }));

  // --- CAMBIO DE PARQUEADERO ---
  it('Debería actualizar pagos al cambiar parqueadero', fakeAsync(() => {
    component.ngOnInit();
    tick();

    const nuevoParqueadero = 2;
    component.onParqueaderoCambia(nuevoParqueadero);

    expect(component.parqueaderoSeleccionado).toBe(nuevoParqueadero);
    expect(pagosServiceSpy.getByParqueadero).toHaveBeenCalledWith(nuevoParqueadero);
  }));
});