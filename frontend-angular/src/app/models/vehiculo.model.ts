import { TipoVehiculo } from './shared.model';

export interface Vehiculo {
  id: number;
  placa: string;
  idTipoVehiculo: number;
  tipoVehiculo?: TipoVehiculo;
}

export interface CrearVehiculoDto {
  placa: string;
  idTipoVehiculo: number;
}