import { Task } from '@serenity-js/core';
import { PostRequest, Send } from '@serenity-js/rest';

export const CrearUsuarioOperador = (nombre: string, correo: string, contrasena: string, idEmpresa: number) => 
    Task.where(`#actor intenta crear al usuario operador ${nombre}`,
        Send.a(PostRequest.to('/usuarios/operador').with({
            body: {
                nombre: nombre,
                correo: correo,
                contrasena: contrasena,
                idEmpresa: idEmpresa
            }
        }))
    );
    