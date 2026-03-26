import { Empresa } from '../empresa.entity';

export class EmpresaResponseDto {
  id: number;
  nombre: string;

  constructor(empresa: Empresa) {
    this.id = empresa.id;
    this.nombre = empresa.nombre;
  }
}
