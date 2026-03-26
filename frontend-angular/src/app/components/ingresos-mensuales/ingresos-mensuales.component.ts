import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { IngresosMensuales } from '../../models/vistas.model';

@Component({
  selector: 'app-ingresos-mensuales',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './ingresos-mensuales.component.html',
  styleUrl: './ingresos-mensuales.component.scss'
})
export class IngresosMensualesComponent {
  @Input() ingresosData: IngresosMensuales[] = [];
  @Input() loading: boolean = false;

  displayedColumns: string[] = [
    'empresa',
    'parqueadero',
    'periodo',
    'totalIngresos'
  ];
}