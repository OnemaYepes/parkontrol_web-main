import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateClienteFacturaDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 10)
  tipoDocumento: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  numeroDocumento: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;
}
