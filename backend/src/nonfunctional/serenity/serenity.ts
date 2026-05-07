export class Scenario {
  constructor(public readonly name: string) {}

  async given<T>(action: () => Promise<T> | T): Promise<T> {
    return action();
  }
}

export type SerenityStep<T> = () => Promise<T> | T;

export const Steps = {
  login: <T>(action: () => Promise<T> | T): SerenityStep<T> => {
    return async () => action();
  },
  createCelda: <T>(action: () => Promise<T> | T): SerenityStep<T> => {
    return async () => action();
  },
  finalizeReserva: <T>(action: () => Promise<T> | T): SerenityStep<T> => {
    return async () => action();
  },
  consultarOcupacion: <T>(action: () => Promise<T> | T): SerenityStep<T> => {
    return async () => action();
  },
  crearFactura: <T>(action: () => Promise<T> | T): SerenityStep<T> => {
    return async () => action();
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> 5c8ed22fb786ea560cc3dd99e8c132c204f43ab6
