import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/autenticacion.service';
import { UsuariosService } from '../../services/usuarios.service';
import { CreateUsuarioDto, Usuario } from '../../models/usuario.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioModalComponent, UsuarioDialogData } from '../../components/usuario-modal/usuario-modal.component';
import { RolUsuario } from '../../models/shared.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {

  usuarioActual: Usuario | null = null;
  usuarios: Usuario[] = [];
  administrador = RolUsuario.ADMINISTRADOR;

  loading = false;
  errorMessage = '';
  mensajeExito: string = '';



  displayedColumns: string[] = ['id', 'nombre', 'correo', 'acciones'];
  

  constructor(
  private readonly usuariosService: UsuariosService,
  private readonly authService: AuthService,
  private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {

    this.usuarioActual = this.authService.getUsuarioActual();

    if (this.usuarioActual?.idEmpresa) {
        
        this.cargarUsuariosPorEmpresa(this.usuarioActual.idEmpresa);

    } else {
        this.errorMessage = 'no hay usuario autenticado o empresa asignada';
        
    }
  }


  private cargarUsuariosPorEmpresa(idEmpresa: number): void {
      this.loading = true;
      this.usuariosService.getByEmpresa(idEmpresa).subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar usuarios';
        this.usuarios = [];
        this.loading = false;
      }
    });
  }

  abrirModalCrear(): void {
    const usuarioActual = this.authService.getUsuarioActual();
    if (!usuarioActual?.idEmpresa) return;

    const data: UsuarioDialogData = {
      idEmpresa: usuarioActual.idEmpresa
    };

    const dialogRef = this.dialog.open(UsuarioModalComponent, {
      width: '600px',
      data,
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((usuario: CreateUsuarioDto) => {
      if (usuario) {
        this.crearUsuario(usuario);
      }
    });
  }

  private crearUsuario(usuarioData: CreateUsuarioDto): void {
    this.usuariosService.create(usuarioData).subscribe({
      next: () => {
        this.mensajeExito = 'Usuario creado exitosamente';
        const usuario = this.authService.getUsuarioActual();
        if (usuario?.idEmpresa) {
          this.cargarUsuariosPorEmpresa(usuario.idEmpresa);
        }
        setTimeout(() => {
          this.mensajeExito = '';
        }, 3000);
      },
      error: (error) => {

        if (error.status === 409) {
          this.errorMessage = 'Ya existe un usuario con el correo ingresado';
        } else {

          this.errorMessage = 'Error al crear usuario';
        }

        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }

  eliminarUsuario(id: number): void {
  this.usuariosService.delete(id).subscribe({
    next: () => {
      this.mensajeExito = 'Usuario operador eliminado exitosamente';

      if (this.usuarioActual?.idEmpresa) {
        this.cargarUsuariosPorEmpresa(this.usuarioActual.idEmpresa);
      }

      setTimeout(() => {
        this.mensajeExito = '';
      }, 3000);
    },
    error: (error) => {
      if (error.status === 403) {
        this.errorMessage = 'Solo se pueden eliminar usuarios con rol OPERADOR';
      } else {
        this.errorMessage = 'Error al eliminar el usuario';
      }
    }
  });
  }
}