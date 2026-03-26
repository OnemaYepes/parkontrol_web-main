import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ParqueaderosService } from './parqueaderos.service';
import { CreateParqueaderoDto } from './entities/dto/crear-parqueadero.dto';
import { ParqueaderoResponseDto } from './entities/dto/parqueadero-response.dto';

@Controller('parking-lots')
export class ParqueaderosController {
    
    constructor(private readonly parqueaderosService: ParqueaderosService){}

    @Post()
    async crear(@Body() createParqueaderoDto: CreateParqueaderoDto): Promise<ParqueaderoResponseDto> {
        return this.parqueaderosService.crear(createParqueaderoDto);
    }

    @Get('empresa/:idEmpresa')
    async findAll(@Param('idEmpresa', ParseIntPipe) idEmpresa: number): Promise<ParqueaderoResponseDto[]> {
        return this.parqueaderosService.findByEmpresa(idEmpresa);
    }

    @Get(':id')
    async obtenerDetalle(@Param('id', ParseIntPipe) id: number): Promise<ParqueaderoResponseDto> {
        return this.parqueaderosService.obtenerDetalle(id);
    }
}
