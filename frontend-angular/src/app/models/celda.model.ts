import { TipoCelda, Sensor } from './shared.model';

export interface Celda {
  id: number;
  idParqueadero: number;
  idTipoCelda: number;
  idSensor: number;
  estado: string;
  tipoCelda?: TipoCelda;
  sensor?: Sensor;
  parqueadero?: any;
}

export interface CrearCeldaDto {
  idParqueadero: number;
  idTipoCelda: number;
  idSensor: number;
  estado: string;
}

export interface ActualizarEstadoCeldaDto {
  estado: string;
}