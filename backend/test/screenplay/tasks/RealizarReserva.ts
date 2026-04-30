import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

export const RealizarReserva = (idVehiculo: number, idCelda: number) => 
    Task.where(`#actor intenta reservar la celda ${idCelda} para el vehículo ${idVehiculo}`,
        Send.a(PostRequest.to('/reservas').with({
            body: {
                idVehiculo: idVehiculo,
                idCelda: idCelda,
                estado: 'ABIERTA' // Según tu lógica de findActivas()
            }
        }))
    );