import { Controller, Get, Param} from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { EmpresaResponseDto } from './entities/dto/empresa-response.dto';

@Controller('companies')
export class EmpresasController {
    constructor(private readonly empresasService: EmpresasService){}

    @Get()
    async obtenerTodas(): Promise<EmpresaResponseDto[]> {
        return this.empresasService.obtenerTodas();
    }

    @Get(':id')
    async obtenerDetalle(@Param('id') idEmpresa: number): Promise<EmpresaResponseDto> {
        return this.empresasService.obtenerDetalle(idEmpresa);
    }
}
