import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginResponseDto, LoginUsuarioDto, RegistrarUsuarioDto } from './entities/dto';
import { UsuarioResponseDto } from 'src/usuarios/entities/dto/usuario-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    async registerClient(@Body() registrarUsuarioDto: RegistrarUsuarioDto): Promise<UsuarioResponseDto>{
        return await this.authService.registrar(registrarUsuarioDto);
    }

    @Post('login')
    async login(@Body() loginUsuarioDto: LoginUsuarioDto): Promise<LoginResponseDto>{
        return await this.authService.login(loginUsuarioDto);
    }
}
