import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/autenticacion.service';
import { VistasService } from '../../services/vistas.service';
import { ReservasService } from '../../services/reservas.service';
import { EmpresasService } from '../../services/empresas.service';
import { OcupacionParqueadero, IngresosMensuales, FacturacionCompleta, HistorialReserva } from '../../models/vistas.model';
import { Reserva } from '../../models/reserva.model';
import { Empresa } from '../../models/shared.model';
import { HistorialReservasComponent } from '../../components/historial-reservas/historial-reservas.component';
import { ReservasActivasComponent } from '../../components/reservas-activas/reservas-activas.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-operador-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    HistorialReservasComponent,
    ReservasActivasComponent
  ],
  templateUrl: './operador-dashboard.component.html',
  styleUrls: ['./operador-dashboard.component.scss']
})
export class OperadorDashboardComponent implements OnInit {

  ocupacion: OcupacionParqueadero[] = [];
  reservasActivas: Reserva[] = [];
  ingresos: IngresosMensuales[] = [];
  facturacion: FacturacionCompleta[] = [];
  empresaUsuario: Empresa | null = null;
  historial: HistorialReserva[] = [];

  loading = true;
  totalParqueaderos = 0;
  totalCeldasOcupadas = 0;
  totalCeldasDisponibles = 0;
  totalReservasActivas = 0;
  private peticionesCompletadas = 0;
  private totalPeticiones = 3;

  mostrarReservasActivas = false;

  constructor(
    private authService: AuthService,
    private vistasService: VistasService,
    private reservasService: ReservasService,
    private empresasService: EmpresasService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  private cargarDashboard(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario) {
      console.error('No hay usuario autenticado');
      this.loading = false;
      return;
    }

    this.empresasService.getById(usuario.idEmpresa).subscribe({
      next: (empresa) => {
        this.empresaUsuario = empresa;
      },
      error: (error) => {
        console.error('Error cargando empresa', error);
        this.loading = false;
        return;
      }
    });

    this.cargarDatosDashboard(usuario.idEmpresa);
  }

  private cargarDatosDashboard(idEmpresa: number): void {
    this.loading = true;
    this.peticionesCompletadas = 0; 

    this.vistasService.getOcupacion(idEmpresa)
      .subscribe({
        next: (ocupacionGeneral) => {
          this.ocupacion = ocupacionGeneral;
        },
        error: (error) => {
          console.log('no recibe ocupacion', error);
          this.ocupacion = [];
        },
        complete: () => {
          this.validarPeticiones(); 
        }
      });

    this.reservasService.getActivas()
      .subscribe({
        next: (reservasActivas) => {
          console.log('Reservas activas obtenidas', { ...reservasActivas });
          this.reservasActivas = reservasActivas;
        },
        error: (error) => {
          console.log('No se cargo reservas', error);
          this.reservasActivas = [];
        },
        complete: () => {
          this.validarPeticiones();
        }
      });

    this.vistasService.getHistorialReservas(idEmpresa)
      .subscribe({
        next: (historial) => {
          this.historial = historial;
        },
        error: (error) => {
          console.log('Error al cargar historial de reservas', error);
          this.historial = [];
        },
        complete: () => {
          this.validarPeticiones();
        }
      });

  }

  private validarPeticiones(): void {
    this.peticionesCompletadas++;
    if (this.peticionesCompletadas === this.totalPeticiones) {
      this.calcularEstadisticas();
      this.loading = false;
    }
  }


  private calcularEstadisticas(): void {

    this.totalParqueaderos = this.ocupacion.length;
    this.totalReservasActivas = this.reservasActivas.length;
    this.totalCeldasOcupadas = this.ocupacion.reduce((total, parqueadero) => total + (parqueadero.celdasOcupadas || 0), 0);
    this.totalCeldasDisponibles = this.ocupacion.reduce((total, parqueadero) => total + (parqueadero.celdasLibres || 0), 0);
  }

  verCeldas(): void {
    this.router.navigate(['celdas']);
  }

  registrarVehiculo(): void {
    this.router.navigate(['vehiculos']);
  }

  
  cambioReservas(): void {
    this.mostrarReservasActivas = !this.mostrarReservasActivas;
  }
}