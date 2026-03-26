import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUsuarioDto {
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;
}
