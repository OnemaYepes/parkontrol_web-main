import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

export const CrearVehiculo = (placa: string, idTipo: number) => 
    Task.where(`#actor intenta registrar el vehículo con placa ${placa}`,
        Send.a(PostRequest.to('/vehiculos').with({
            body: {
                placa: placa, // Tu servicio lo pasará a UpperCase automáticamente
                idTipoVehiculo: idTipo // Debe ser el ID numérico que espera tu Repository
            }
        }))
    );