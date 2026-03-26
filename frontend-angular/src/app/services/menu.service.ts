import { Injectable } from '@angular/core';
import { RolUsuario } from '../models/shared.model';

export interface ElementoMenu {
  etiqueta: string;
  ruta: string;
  icono: string;
  roles: RolUsuario[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  
  private readonly elementosMenu: ElementoMenu[] = [
    {
      etiqueta: 'Dashboard Administrador',
      ruta: '/dashboard',
      icono: 'dashboard',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Dashboard Operador',
      ruta: '/operador-dashboard',
      icono: 'desktop_mac',
      roles: [RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Parqueaderos',
      ruta: '/parqueaderos',
      icono: 'business',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Celdas',
      ruta: '/celdas',
      icono: 'local_parking',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Vehiculos',
      ruta: '/vehiculos',
      icono: 'directions_car',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Usuarios',
      ruta: '/usuarios',
      icono: 'people',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Tarifas',
      ruta: '/tarifas',
      icono: 'attach_money',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Reservas',
      ruta: '/reservas',
      icono: 'event',
      roles: [RolUsuario.ADMINISTRADOR, RolUsuario.OPERADOR]
    },
    {
      etiqueta: 'Pagos',
      ruta: '/pagos',
      icono: 'payment',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Facturacion',
      ruta: '/facturacion',
      icono: 'receipt',
      roles: [RolUsuario.ADMINISTRADOR]
    },
    {
      etiqueta: 'Vistas',
      ruta: '/vistas',
      icono: 'visibility',
      roles: [RolUsuario.ADMINISTRADOR]
    }
  ];


  obtenerTodosLosElementos(): ElementoMenu[] {
    return [...this.elementosMenu];
  }



  obtenerMenuPorRol(rol: RolUsuario): ElementoMenu[] {
    return this.elementosMenu.filter(elemento => 
      elemento.roles.includes(rol)
    );
  }


  obtenerElementoPorRuta(ruta: string): ElementoMenu | undefined {
    return this.elementosMenu.find(elemento => elemento.ruta === ruta);
  }


  obtenerEtiquetaPorRuta(ruta: string): string {
    const elemento = this.obtenerElementoPorRuta(ruta);
    return elemento?.etiqueta || 'Dashboard';
  }
}