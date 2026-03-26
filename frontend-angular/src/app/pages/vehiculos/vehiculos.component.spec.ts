import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { VehiculosComponent } from './vehiculos.component';
import { VehiculosService } from '../../services/vehiculos.service';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

describe('VehiculosComponent', () => {
  let component: VehiculosComponent;
  let fixture: ComponentFixture<VehiculosComponent>;
  let vehiculosServiceSpy: jasmine.SpyObj<VehiculosService>;

  const vehiculoMock = {
    id: 1,
    placa: 'ABC123',
    idTipoVehiculo: 1,
    tipoVehiculo: { id: 1, nombre: 'Carro' }
  };

  beforeEach(async () => {
    vehiculosServiceSpy = jasmine.createSpyObj('VehiculosService', ['getByPlaca', 'create']);

    await TestBed.configureTestingModule({
      imports: [VehiculosComponent, ReactiveFormsModule],
      providers: [
        { provide: VehiculosService, useValue: vehiculosServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VehiculosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Espías para utilidades de consola
    spyOn(console, 'log');
    spyOn(console, 'error');
  });

  // ==========================================
  // HU-11: BUSCAR VEHÍCULO POR PLACA
  // ==========================================
  describe('Pruebas de Búsqueda (onBuscar)', () => {
    
    it('debe buscar un vehiculo y asignarlo cuando el servicio responde correctamente', () => {
      component.searchForm.setValue({ placa: 'ABC123' });
      vehiculosServiceSpy.getByPlaca.and.returnValue(of(vehiculoMock));

      component.onBuscar();

      expect(vehiculosServiceSpy.getByPlaca).toHaveBeenCalledWith('ABC123');
      expect(component.vehiculo).toEqual(vehiculoMock);
      expect(component.loading).toBeFalse();
    });

    it('debe mostrar mensaje cuando el vehiculo no existe (Error 404)', () => {
      component.searchForm.setValue({ placa: 'ZZZ999' });
      const error = new HttpErrorResponse({ status: 404 });
      vehiculosServiceSpy.getByPlaca.and.returnValue(throwError(() => error));

      component.onBuscar();

      expect(component.vehiculo).toBeNull();
      expect(component.errorMessage).toBe('No existe vehiculo con la placa ingresada');
    });

    it('debe mostrar mensaje de error cuando falla el servicio (Error 500)', () => {
      component.searchForm.setValue({ placa: 'ABC123' });
      const error = new HttpErrorResponse({ status: 500 });
      vehiculosServiceSpy.getByPlaca.and.returnValue(throwError(() => error));

      component.onBuscar();

      expect(component.errorMessage).toBe('Error al buscar el vehiculo');
    });

    it('no debe llamar al servicio si el formulario de búsqueda es inválido', () => {
      component.searchForm.setValue({ placa: '' });
      component.onBuscar();
      expect(vehiculosServiceSpy.getByPlaca).not.toHaveBeenCalled();
    });

    it('debe limpiar los resultados y el formulario al ejecutar limpiarBusqueda()', () => {
      component.vehiculo = vehiculoMock;
      component.searchForm.setValue({ placa: 'ABC123' });

      component.limpiarBusqueda();

      expect(component.vehiculo).toBeNull();
      expect(component.searchForm.value.placa).toBeNull();
    });
  });

  // ==========================================
  // HU: CREAR VEHÍCULO
  // ==========================================
  describe('Pruebas de Creación (onCrear)', () => {

    it('no debería enviar datos si el formulario de creación es inválido', () => {
      component.createForm.setValue({ placa: '', idTipoVehiculo: null });
      component.onCrear();
      expect(vehiculosServiceSpy.create).not.toHaveBeenCalled();
    });

    it('debería crear el vehículo exitosamente y limpiar el mensaje después de 3s', fakeAsync(() => {
      vehiculosServiceSpy.create.and.returnValue(of(vehiculoMock));
      component.createForm.setValue({ placa: 'ABC123', idTipoVehiculo: 1 });

      component.onCrear();
      tick();

      expect(component.mensajeExito).toBe('Vehículo creado exitosamente');
      expect(component.vehiculo).toEqual(vehiculoMock);
      
      tick(3000); // Avanzar el tiempo del temporizador
      expect(component.mensajeExito).toBe('');
    }));

    it('debería mostrar error si la placa ya existe (Error 409)', fakeAsync(() => {
      const errorResponse = { status: 409 };
      vehiculosServiceSpy.create.and.returnValue(throwError(() => errorResponse));
      component.createForm.setValue({ placa: 'DUP123', idTipoVehiculo: 1 });

      component.onCrear();
      tick();

      expect(component.errorMessage).toBe('Ya existe un vehiculo con la placa ingresada');
      
      tick(5000);
      expect(component.errorMessage).toBe('');
    }));

    it('debería mostrar error si el tipo de vehículo no existe (Error 404)', fakeAsync(() => {
      const errorResponse = { status: 404 };
      vehiculosServiceSpy.create.and.returnValue(throwError(() => errorResponse));
      component.createForm.setValue({ placa: 'NEW123', idTipoVehiculo: 99 });

      component.onCrear();
      tick();

      expect(component.errorMessage).toBe('No existe el tipo de vehiculo con el ID ingresado');
    }));

    it('debería mostrar error general ante falla desconocida (Error 500)', fakeAsync(() => {
      vehiculosServiceSpy.create.and.returnValue(throwError(() => ({ status: 500 })));
      component.createForm.setValue({ placa: 'ERR123', idTipoVehiculo: 1 });

      component.onCrear();
      tick();

      expect(component.errorMessage).toBe('Error al crear el vehiculo');
    }));
  });
});