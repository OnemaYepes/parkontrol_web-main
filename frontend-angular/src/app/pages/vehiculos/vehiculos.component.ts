import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo, CrearVehiculoDto } from '../../models/vehiculo.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-vehiculos',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.scss']
})
export class VehiculosComponent  {
  searchForm: FormGroup;
  createForm: FormGroup;
  vehiculo: Vehiculo | null = null;


  loading = false;
  errorMessage = '';
  mensajeExito = '';
  displayedColumns: string[] = ['id', 'placa', 'tipoVehiculo'];

  constructor(
    readonly formBuilder: FormBuilder,
    readonly vehiculosService: VehiculosService
  ) {
    this.searchForm = this.formBuilder.group({
      placa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]]
    });

    this.createForm = this.formBuilder.group({
      placa: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      idTipoVehiculo: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onBuscar(): void {
    if (this.searchForm.valid) {

      this.loading = true;
 
      
      const { placa } = this.searchForm.value;
      
      this.vehiculosService.getByPlaca(placa).subscribe({

        next: (vehiculo) => {
          this.vehiculo = vehiculo;
          this.loading = false;
          console.log('Vehiculo', vehiculo);
         
        },
        error: (error) => {
          console.error('No encontro vehiculo', error);
          this.vehiculo = null;
          this.loading = false;
          
          if (error.status === 404) {
            this.errorMessage = 'No existe vehiculo con la placa ingresada';
          } else {
            this.errorMessage = 'Error al buscar el vehiculo';
          }
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  onCrear(): void {

    if (this.createForm.valid) {

      this.loading = true;


      const vehiculoForm: CrearVehiculoDto = this.createForm.value;

      this.vehiculosService.create(vehiculoForm).subscribe({
        next: (vehiculo) => {
          console.log('creado:', vehiculo);
          this.createForm.reset({
            placa: '',
            idTipoVehiculo: 1
          });
          this.loading = false;
          this.vehiculo = vehiculo;
          this.mensajeExito = 'Vehículo creado exitosamente';
          setTimeout(() => {
            this.mensajeExito = '';
          }, 3000);
        },

        error: (error) => {
          console.error('Error creando vehiculo', error);
          this.loading = false;
          
          if (error.status === 409) {
            this.errorMessage = 'Ya existe un vehiculo con la placa ingresada';
          } else if (error.status === 404 ) {
              this.errorMessage = 'No existe el tipo de vehiculo con el ID ingresado';
          } else {
              this.errorMessage = 'Error al crear el vehiculo';
            }
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }});
    }
  }


  limpiarBusqueda(): void {
    this.vehiculo = null;
    this.searchForm.reset();

  }
}