import { configure, ArtifactArchiver } from '@serenity-js/core';
import { ConsoleReporter } from '@serenity-js/console-reporter';

configure({
    crew: [
        // 1. Guarda los archivos de evidencia
        ArtifactArchiver.storingArtifactsAt('./target/site/serenity'),
        
        // 2. Muestra los pasos en la terminal
        ConsoleReporter.forDarkTerminals(),
        
        // 3. Registro por STRING (Esto quita el error rojo de la imagen 8b8fb7)
        '@serenity-js/serenity-bdd' 
    ]
});