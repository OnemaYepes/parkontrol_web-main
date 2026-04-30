import { actorCalled } from '@serenity-js/core';
import { CallAnApi } from '@serenity-js/rest';

// Definimos que tú eres la encargada de ejecutar las acciones
export const valentina = actorCalled('Usuario')
    .whoCan(
        CallAnApi.at('http://localhost:3000') // La dirección de tu API
    );
