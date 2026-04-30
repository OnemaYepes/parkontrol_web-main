import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

export const CrearParqueadero = (nombre: string, capacidad: number, ubicacion: string, idEmpresa: number) => 
    Task.where(`#actor intenta crear el parqueadero ${nombre} para la empresa ${idEmpresa}`,
        Send.a(PostRequest.to('/parqueaderos').with({
            body: {
                nombre: nombre,
                capacidadTotal: capacidad,
                ubicacion: ubicacion,
                idEmpresa: idEmpresa
            }
        }))
    );