import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UsuariosComponent } from './usuarios.component';
import { UsuariosService } from '../../services/usuarios.service';
import { AuthService } from '../../services/autenticacion.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { CreateUsuarioDto, Usuario } from '../../models/usuario.model';
import { RolUsuario } from '../../models/shared.model';

describe('UsuariosComponent - Coverage Estable (AAA)', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let usuariosServiceSpy: jasmine.SpyObj<UsuariosService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockMatDialog = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: () => of(null)
    })
  };

  beforeEach(async () => {
    // Arrange: setup spies y reset de mocks
    usuariosServiceSpy = jasmine.createSpyObj('UsuariosService', ['getByEmpresa', 'create', 'delete']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUsuarioActual']);
    mockMatDialog.open.calls.reset();

    usuariosServiceSpy.getByEmpresa.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [UsuariosComponent],
      providers: [
        { provide: UsuariosService, useValue: usuariosServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    })
    .overrideComponent(UsuariosComponent, {
      set: { providers: [{ provide: MatDialog, useValue: mockMatDialog }] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
  });

  // =========================
  // NGONINIT / CARGA INICIAL
  // =========================
  it('ngOnInit: con empresa debe cargar usuarios', () => {
    // Arrange
    authServiceSpy.getUsuarioActual.and.returnValue({ idEmpresa: 10 } as Usuario);

    // Act
    component.ngOnInit();

    // Assert
    expect(usuariosServiceSpy.getByEmpresa).toHaveBeenCalledWith(10);
  });

  it('ngOnInit: sin usuario o empresa debe mostrar error', () => {
    // Arrange
    authServiceSpy.getUsuarioActual.and.returnValue(null);

    // Act
    component.ngOnInit();

    // Assert
    expect(component.errorMessage).toBe('no hay usuario autenticado o empresa asignada');
    expect(usuariosServiceSpy.getByEmpresa).not.toHaveBeenCalled();
  });

  // =========================
  // CARGAR USUARIOS
  // =========================
  it('cargarUsuariosPorEmpresa: éxito actualiza lista de usuarios', fakeAsync(() => {
    // Arrange
    const usuariosMock = [{ id: 1, nombre: 'Juan' }] as Usuario[];
    usuariosServiceSpy.getByEmpresa.and.returnValue(of(usuariosMock));

    // Act
    (component as any).cargarUsuariosPorEmpresa(10);
    tick();

    // Assert
    expect(component.usuarios).toEqual(usuariosMock);
    expect(component.loading).toBeFalse();
  }));

  it('cargarUsuariosPorEmpresa: error debe limpiar lista y mostrar mensaje', fakeAsync(() => {
    // Arrange
    usuariosServiceSpy.getByEmpresa.and.returnValue(throwError(() => ({ status: 500 })));

    // Act
    (component as any).cargarUsuariosPorEmpresa(10);
    tick();

    // Assert
    expect(component.errorMessage).toBe('Error al cargar usuarios');
    expect(component.usuarios.length).toBe(0);
    expect(component.loading).toBeFalse();
  }));

  // =========================
  // MODAL Y CREACIÓN
  // =========================
  it('abrirModalCrear: debe llamar create cuando el modal retorna datos', fakeAsync(() => {
    // Arrange
    const mockUsuarioDto: CreateUsuarioDto = { 
      nombre: 'Nuevo', correo: 'a@a.com', contrasena: '1', rol: RolUsuario.OPERADOR, idEmpresa: 10 
    };
    authServiceSpy.getUsuarioActual.and.returnValue({ idEmpresa: 10 } as Usuario);
    mockMatDialog.open.and.returnValue({ afterClosed: () => of(mockUsuarioDto) });
    usuariosServiceSpy.create.and.returnValue(of({} as Usuario));

    // Act
    component.abrirModalCrear();
    tick();

    // Assert
    expect(usuariosServiceSpy.create).toHaveBeenCalledWith(mockUsuarioDto);
  }));

  it('crearUsuario: error 409 debe mostrar mensaje de correo existente', fakeAsync(() => {
    // Arrange
    usuariosServiceSpy.create.and.returnValue(throwError(() => ({ status: 409 })));

    // Act
    (component as any).crearUsuario({} as CreateUsuarioDto);
    tick();

    // Assert
    expect(component.errorMessage).toBe('Ya existe un usuario con el correo ingresado');

    // Act: limpiar mensaje
    tick(3000);

    // Assert
    expect(component.errorMessage).toBe('');
  }));

  // =========================
  // ELIMINAR USUARIO
  // =========================
  it('eliminarUsuario: éxito debe recargar la lista', fakeAsync(() => {
    // Arrange
    component.usuarioActual = { idEmpresa: 10 } as Usuario;
    usuariosServiceSpy.delete.and.returnValue(of(void 0));
    usuariosServiceSpy.getByEmpresa.and.returnValue(of([]));

    // Act
    component.eliminarUsuario(1);
    tick();

    // Assert
    expect(usuariosServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(usuariosServiceSpy.getByEmpresa).toHaveBeenCalledWith(10);
    expect(component.mensajeExito).toBe('Usuario operador eliminado exitosamente');
  }));

  it('eliminarUsuario: error 403 debe informar restricción de rol', fakeAsync(() => {
    // Arrange
    usuariosServiceSpy.delete.and.returnValue(throwError(() => ({ status: 403 })));

    // Act
    component.eliminarUsuario(1);
    tick();

    // Assert
    expect(component.errorMessage).toBe('Solo se pueden eliminar usuarios con rol OPERADOR');
  }));

  it('eliminarUsuario: error general', fakeAsync(() => {
    // Arrange
    usuariosServiceSpy.delete.and.returnValue(throwError(() => ({ status: 500 })));

    // Act
    component.eliminarUsuario(1);
    tick();

    // Assert
    expect(component.errorMessage).toBe('Error al eliminar el usuario');
  }));
});