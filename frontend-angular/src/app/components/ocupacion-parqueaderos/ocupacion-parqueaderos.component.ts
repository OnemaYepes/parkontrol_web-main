import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { OcupacionParqueadero } from '../../models/vistas.model';

@Component({
  selector: 'app-ocupacion-parqueaderos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './ocupacion-parqueaderos.component.html',
  styleUrls: ['./ocupacion-parqueaderos.component.scss']
})
export class OcupacionParqueaderosComponent {
  @Input() ocupacionData: OcupacionParqueadero[] = [];
  @Input() loading: boolean = false;

  displayedColumns: string[] = [
    'nombreParqueadero',
    'totalCeldas',
    'celdasOcupadas', 
    'celdasLibres', 
    'porcentajeOcupacion'
  ];

  calcularPorcentajeOcupacion(ocupacion: OcupacionParqueadero): number {
    return ocupacion.totalCeldas > 0
      ? (ocupacion.celdasOcupadas / ocupacion.totalCeldas) * 100
      : 0;
  }
}