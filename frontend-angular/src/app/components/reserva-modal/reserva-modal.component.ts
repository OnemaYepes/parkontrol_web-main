import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { VehiculosService } from '../../services/vehiculos.service';
import { CeldasService } from '../../services/celdas.service';
import { Celda } from '../../models/celda.model';
import { Vehiculo } from '../../models/vehiculo.model';
import { CrearReservaDto } from '../../models/reserva.model';
import { EstadoCelda, EstadoReserva } from '../../models/shared.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ReservaDialogData {
  idParqueadero: number;
}

@Component({
  selector: 'app-reserva-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reserva-modal.component.html',
  styleUrls: ['./reserva-modal.component.scss']
})
export class ReservaModalComponent implements OnInit {
  
  reservaForm: FormGroup;
  celdas: Celda[] = [];
  vehiculoEncontrado: Vehiculo | null = null;

  loading = false;
  loadingCeldas = false;

  constructor(
    readonly formBuilder: FormBuilder,
    readonly dialogRef: MatDialogRef<ReservaModalComponent>,
    readonly vehiculosService: VehiculosService,
    readonly celdasService: CeldasService,
    @Inject(MAT_DIALOG_DATA) public data: ReservaDialogData
  ) {
    this.reservaForm = this.formBuilder.group({
      placa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      idCelda: ['', [Validators.required]],

      estado: [{ value: EstadoReserva.ABIERTA, disabled: true }, [Validators.required]]
    });
  }


  ngOnInit(): void {
    this.cargarCeldasDisponibles();
  }

  private cargarCeldasDisponibles(): void {

    this.loadingCeldas = true;
    this.reservaForm.get('idCelda')?.disable();
    
    this.celdasService.getByParqueadero(this.data.idParqueadero).subscribe({
      next: (todasLasCeldas) => {
     

        this.celdas = todasLasCeldas.filter(celda => 
          celda.estado === EstadoCelda.LIBRE
        );
        
        this.loadingCeldas = false;
        this.reservaForm.get('idCelda')?.enable();

      },
      error: (error) => {
        console.error('Error al cargar celdas:', error);
        this.celdas = [];

        this.loadingCeldas = false;
        this.reservaForm.get('idCelda')?.enable();
      }
    });
  }


  private buscarVehiculo(placa: string): void {
    this.vehiculoEncontrado = null;
    
    this.vehiculosService.getByPlaca(placa).subscribe({

      next: (vehiculo: Vehiculo) => {
        console.log('vehiculo encontrado:', vehiculo);
        this.vehiculoEncontrado = vehiculo;
      },
      error: (error) => {
        if (error.status === 404) {
          console.log('vehiculo no registrado');
          this.vehiculoEncontrado = null;
        } else {
          console.error('Error vehiculo no encontrado:', error);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
      this.loading = true;
      
      const formValue = this.reservaForm.value;
      
      this.buscarVehiculo(formValue.placa);
      

      setTimeout(() => {
        if (this.vehiculoEncontrado === null) {
          alert(`Vehiculo con placa "${formValue.placa}" no esta registrado`);
          setTimeout(() => {
            this.irAVehiculos();
          }, 4000);

          
        } else {
          const reservaData: CrearReservaDto = {
            idVehiculo: this.vehiculoEncontrado.id,
            idCelda: formValue.idCelda,
            estado: EstadoReserva.ABIERTA
          };

          this.dialogRef.close(reservaData);
        }
        
        this.loading = false;
      }, 2000); 
    }
  }

  irAVehiculos(): void {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}