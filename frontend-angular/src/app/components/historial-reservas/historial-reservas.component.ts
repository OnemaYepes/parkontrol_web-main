import { Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { HistorialReserva } from '../../models/vistas.model';

@Component({
  selector: 'app-historial-reservas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './historial-reservas.component.html',
  styleUrl: './historial-reservas.component.scss'
})
export class HistorialReservasComponent {
  @Input() historialReserva: HistorialReserva[] = [];
  @Input() loading: boolean = false;

  displayedColumns: string[] = [
    'placa',
    'parqueadero',
    'tipoVehiculo',
    'fechaEntrada',
    'fechaSalida',
    'estado'
  ];
}