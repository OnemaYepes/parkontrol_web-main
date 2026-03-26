import { Reserva } from './reserva.model';
import { MetodoPago } from './shared.model';

export interface Pago {
  id: number;
  idReserva: number;
  idMetodoPago: number;
  monto: number;
  fechaPago: string;
  reserva?: Reserva;
  metodoPago?: MetodoPago;
}

export interface CrearPagoDto {
  idReserva: number;
  idMetodoPago: number;
}

export interface ProcesarPagoDto {
  idReserva: number;
  idMetodoPago: number;
}