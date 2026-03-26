import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { RolUsuario } from '../../models/shared.model';

interface ElementoMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
  roles: RolUsuario[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() elementosMenu: ElementoMenu[] = [];
}