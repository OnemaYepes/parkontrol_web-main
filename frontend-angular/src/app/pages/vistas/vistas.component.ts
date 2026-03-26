import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/autenticacion.service';
import { VistasService } from '../../services/vistas.service';
import { OcupacionParqueadero, HistorialReserva, FacturacionCompleta, IngresosMensuales } from '../../models/vistas.model';
import { OcupacionParqueaderosComponent } from '../../components/ocupacion-parqueaderos/ocupacion-parqueaderos.component';
import { HistorialReservasComponent } from '../../components/historial-reservas/historial-reservas.component';
import { IngresosMensualesComponent } from '../../components/ingresos-mensuales/ingresos-mensuales.component';
import { FacturacionCompletaComponent } from '../../components/facturacion-completa/facturacion-completa.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vistas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    OcupacionParqueaderosComponent,
    HistorialReservasComponent,
    IngresosMensualesComponent,
    FacturacionCompletaComponent
  ],
  templateUrl: './vistas.component.html',
  styleUrls: ['./vistas.component.scss']
})
export class VistasComponent implements OnInit {
  ocupacion: OcupacionParqueadero[] = [];
  historial: HistorialReserva[] = [];
  ingresos: IngresosMensuales[] = [];
  facturacion: FacturacionCompleta[] = [];
  
  loading = false;
  idEmpresa: number | null = null;

  ingresosTotal = 0;
  facturacionTotal = 0;
  totalReservas = 0;
  promedioOcupacion = 0;

  private peticionesCompletadas = 0;
  readonly totalPeticiones = 4;

  constructor(
    readonly authService: AuthService,
    readonly vistasService: VistasService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario?.idEmpresa) {
      console.error('No hay usuario autenticado');
      this.loading = false;
      return;
    }

    this.idEmpresa = usuario.idEmpresa;
    this.cargarDatosVistas(this.idEmpresa);
  }

  private cargarDatosVistas(idEmpresa: number): void {
    this.loading = true;
    this.peticionesCompletadas = 0;

    this.vistasService.getOcupacion(idEmpresa)
      .subscribe({
        next: (data) => {
          this.ocupacion = data;
        },
        error: (error) => {
          console.log('No cargo ocupacion', error);
          this.ocupacion = [];
        },
        complete: () => {
          this.validarPeticiones();
        }
      });



    this.vistasService.getHistorialReservas(idEmpresa)
      .subscribe({
        next: (historialReservas) => {
          this.historial = historialReservas;
          console.log('Historial de reservas obtenido', { ...this.historial });
        },
        error: (error) => {
          console.log('Error no cargo historial de reservas', error);
          this.historial = [];
        },

        complete: () => {
          this.validarPeticiones();
        }
      });

 
    this.vistasService.getIngresos(idEmpresa)
      .subscribe({
        next: (ingresos) => {
          this.ingresos = ingresos;
        },
        error: (error) => {
          console.log('No cargo ingresos', error);
          this.ingresos = [];
        },

        complete: () => {
          this.validarPeticiones();
        }
      });

 
    this.vistasService.getFacturacion(idEmpresa)
      .subscribe({
        next: (data) => {
          this.facturacion = data;
        },
        error: (error) => {
          console.log('no cargo facturacion', error);
          this.facturacion = [];
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

    this.totalReservas = this.historial.length;
    this.ingresosTotal = this.ingresos.reduce((total, ingreso) => total + (ingreso.totalIngresos || 0), 0); 
    this.facturacionTotal = this.facturacion.reduce((total, parqueadero) => total + (parqueadero.monto || 0), 0);
    

    if (this.ocupacion.length > 0) {
      let sumaPromedios = 0;
      for (const parqueadero of this.ocupacion) {
        const porcentaje = parqueadero.totalCeldas > 0 
          ? (parqueadero.celdasOcupadas / parqueadero.totalCeldas * 100) 
          : 0;
        sumaPromedios += porcentaje;
      }
      this.promedioOcupacion = sumaPromedios / this.ocupacion.length;
    } else {
      this.promedioOcupacion = 0;
    }
  }
}