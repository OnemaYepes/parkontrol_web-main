import { Parqueadero } from './parqueadero.model';
import { TipoVehiculo } from './shared.model';

export interface Tarifa {
  id: number;
  idParqueadero?: number;
  idTipoVehiculo?: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
  parqueadero: Parqueadero;
  tipoVehiculo: TipoVehiculo;
}

export interface CrearTarifaDto {
  idParqueadero: number;
  idTipoVehiculo: number;
  precioFraccionHora: number;
  precioHoraAdicional?: number;
}

export interface ActualizarTarifaDto {
  precioFraccionHora?: number;
  precioHoraAdicional?: number;
}