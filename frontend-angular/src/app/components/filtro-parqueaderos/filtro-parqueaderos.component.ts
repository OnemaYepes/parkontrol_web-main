import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Parqueadero } from '../../models/parqueadero.model';

@Component({
  selector: 'app-filtro-parqueaderos',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './filtro-parqueaderos.component.html',
  styleUrls: ['./filtro-parqueaderos.component.scss']
})
export class FiltroParqueaderosComponent {

  @Input() parqueaderos: Parqueadero[] = [];
  @Input() parqueaderoSeleccionado: number | null = null;
  
  @Output() parqueaderoCambia = new EventEmitter<number>();

  onParqueaderoCambia(idParqueadero: number): void {
    this.parqueaderoSeleccionado = idParqueadero;
    this.parqueaderoCambia.emit(idParqueadero);
  }
}