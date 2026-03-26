import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Reserva } from '../../models/reserva.model';

@Component({
  selector: 'app-reservas-activas',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule],
  templateUrl: './reservas-activas.component.html',
  styleUrls: ['./reservas-activas.component.scss']
})
export class ReservasActivasComponent {
  @Input() reservasActivas: Reserva[] = [];
  @Input() loading: boolean = false;

  displayedColumns: string[] = ['id', 'vehiculo', 'fechaEntrada', 'fechaSalida', 'estado'];
}