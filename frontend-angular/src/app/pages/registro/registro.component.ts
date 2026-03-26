import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/autenticacion.service';
import { RegistrarUsuarioDto, Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  registerForm: FormGroup;
  hidePassword = true;
  loading = false;
  errorMessage = '';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      idEmpresa: [1, [Validators.required, Validators.min(1)]]
    });
  }



  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      const registerData: RegistrarUsuarioDto = {
        ...this.registerForm.value,
        rol: 'ADMINISTRADOR'
      };

      this.authService.register(registerData).subscribe({
        next: (user: Usuario) => {
          console.log('Registro exitoso:', user);
          this.router.navigate(['/login']);
        },
        
        error: (error: any) => {
            this.loading = false;
            console.error('Error en el registro:', error);


          if (error.status === 404) {
            this.errorMessage = 'El ID de empresa no existe. Verifica el numero.';
          } else if (error.status === 409) {
            this.errorMessage = 'Ya existe un usuario con este correo electronico. Usa otro correo.';
          } else if (error.status === 500) {
            this.errorMessage = 'Error del servidor';
          } else {
            this.errorMessage = 'Error inesperado. Intenta de nuevo.';
          }
          setTimeout(() => {
          this.errorMessage = '';
          }, 5000);
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}