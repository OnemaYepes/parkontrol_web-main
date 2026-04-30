import { Question } from '@serenity-js/core';
import { LastResponse } from '@serenity-js/rest';

export const RolDelUsuarioCreado = () =>
    Question.about('el rol asignado al nuevo usuario', actor =>
        LastResponse.body().rol.nombre.answeredBy(actor)
    );