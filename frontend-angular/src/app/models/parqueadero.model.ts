export interface Parqueadero {
  id: number;
  nombre: string;
  capacidadTotal: number;
  ubicacion: string;
  idEmpresa: number;
  empresa?: any;
}

export interface CrearParqueaderoDto {
  nombre: string;
  capacidadTotal: number;
  ubicacion: string;
  idEmpresa: number;
}