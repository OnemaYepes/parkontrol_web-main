import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

export const ProcesarPago = (idReserva: number, idMetodoPago: number) => 
    Task.where(`#actor intenta procesar el pago para la reserva ${idReserva}`,
        Send.a(PostRequest.to('/pagos').with({
            body: {
                idReserva: idReserva,
                idMetodoPago: idMetodoPago
            }
        }))
    );