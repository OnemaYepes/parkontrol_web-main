import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;

  @IsNotEmpty()
  @IsString()
  rol: string;

  @IsNotEmpty()
  @IsNumber()
  idEmpresa: number;
}
