
import { z } from "zod";

// Importamos el tipo específico de la página si la librería lo expone así,
// o si no, podemos usar un truco de TypeScript para extraer el tipo del método.
export async function extract<T extends z.ZodTypeAny>(
  page: any, // Cambiamos temporalmente a any para verificar si el método cambia de lugar
  instruction: string,
  schema: T
) {
  return page.extract({
    instruction,
    schema,
  });
}