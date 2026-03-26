import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { PagosService } from '../../services/pagos.service';
import { ParqueaderosService } from '../../services/parqueaderos.service';
import { AuthService } from '../../services/autenticacion.service';
import { Pago } from '../../models/pago.model';
import { Parqueadero } from '../../models/parqueadero.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FiltroParqueaderosComponent } from '../../components/filtro-parqueaderos/filtro-parqueaderos.component';
import { PagoModalComponent, PagoDialogData } from '../../components/pago-modal/pago-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FacturaPagoModalComponent } from '../../components/factura-pago-modal/factura-pago-modal.component';
import { FacturacionService } from '../../services/facturacion.service';
import { FacturaElectronica } from '../../models/facturacion.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    FiltroParqueaderosComponent
  ],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss']
})
export class PagosComponent implements OnInit, OnDestroy {
  pagos: Pago[] = [];
  parqueaderos: Parqueadero[] = [];
  loading = false;
  parqueaderoSeleccionado: number | null = null;
  errorMessage = '';
  mensajeExito: string = '';
  displayedColumns: string[] = ['id', 'idReserva', 'monto', 'fechaPago', 'idMetodoPago', 'acciones'];
  
  readonly subscriptions: Subscription[] = [];

  constructor(
    private readonly pagosService: PagosService,
    private readonly parqueaderosService: ParqueaderosService,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly facturasService: FacturacionService
  ) {}

  ngOnInit(): void {
    this.cargarParqueaderos();
  }

  ngOnDestroy(): void {
    // Limpiar todas las suscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Método genérico para manejar mensajes de éxito
  private mostrarMensajeExito(mensaje: string, duration: number = 3000): void {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = '';
    }, duration);
  }

  // Método genérico para manejar mensajes de error
  private mostrarMensajeError(mensaje: string, duration: number = 4000): void {
    this.errorMessage = mensaje;
    setTimeout(() => {
      this.errorMessage = '';
    }, duration);
  }

  // Método genérico para manejar operaciones con loading
  private ejecutarConLoading<T>(
    operacion: () => void,
    callback: () => void
  ): void {
    this.loading = true;
    operacion();
    callback();
  }

  private cargarParqueaderos(): void {
    const usuario = this.authService.getUsuarioActual();
    if (!usuario?.idEmpresa) {
      console.error('No hay usuario autenticado');
      return;
    }

    this.loading = true;
    const sub = this.parqueaderosService.getByEmpresa(usuario.idEmpresa).subscribe({
      next: (parqueaderos) => {
        this.parqueaderos = parqueaderos;
        if (parqueaderos.length > 0) {
          this.parqueaderoSeleccionado = parqueaderos[0].id;
          this.cargarPagos(this.parqueaderoSeleccionado);
        } else {
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error No cargo parqueaderos', error);
        this.loading = false;
        this.mostrarMensajeError('Error al cargar los parqueaderos');
      }
    });
    this.subscriptions.push(sub);
  }

  private cargarPagos(idParqueadero: number): void {
    this.loading = true;
    const sub = this.pagosService.getByParqueadero(idParqueadero).subscribe({
      next: (pagos) => {
        this.pagos = pagos;
        this.loading = false;
      },
      error: (error) => {
        console.error('No se cargaron los pagos', error);
        this.pagos = [];
        this.loading = false;
        this.mostrarMensajeError('Error al cargar los pagos');
      }
    });
    this.subscriptions.push(sub);
  }

  onParqueaderoCambia(idParqueadero: number): void {
    this.parqueaderoSeleccionado = idParqueadero;
    this.cargarPagos(idParqueadero);
  }

  abrirModalCrear(): void {
    if (!this.parqueaderoSeleccionado) return;

    const dialogData: PagoDialogData = {
      idParqueadero: this.parqueaderoSeleccionado
    };

    const dialogRef = this.dialog.open(PagoModalComponent, {
      width: '500px',
      data: dialogData,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.crearPago(result);
      }
    });
  }

  private crearPago(pagoData: any): void {
    const sub = this.pagosService.create(pagoData).subscribe({
      next: (pago: any) => {
        console.log('Pago creado:', pago);
        this.mostrarMensajeExito(`Pago procesado exitosamente, monto: $${pago.monto}`);
        setTimeout(() => {
          this.cargarPagos(this.parqueaderoSeleccionado!);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error al crear pago:', error);
        this.mostrarMensajeError('Error al crear el pago.');
      }
    });
    this.subscriptions.push(sub);
  }

  verFactura(pago: Pago): void {
    console.log('Ver factura para el pago:', pago);
    this.abrirFactura(pago.id);
  }

  abrirFactura(pagoId: number): void {
    const sub = this.facturasService.getFacturaPorPago(pagoId).subscribe({
      next: (factura: FacturaElectronica) => {
        console.log('Factura obtenida:', factura);
        this.dialog.open(FacturaPagoModalComponent, {
          width: '400px',
          data: { factura }
        });
      },
      error: () => {
        this.dialog.open(FacturaPagoModalComponent, {
          width: '400px',
          data: { factura: null }
        });
      }
    });
    this.subscriptions.push(sub);
  }
}