import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CeldasService } from './celdas.service';
import { CreateCeldaDto } from './entities/dto/crear-celda.dto';
import { Celda } from './entities/celda.entity';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('cells')
export class CeldasController {
  constructor(
    private readonly celdasService: CeldasService,
    private readonly parqueaderosService: ParqueaderosService,
  ) {}

  @Post()
  async crear(@Body() createCeldaDto: CreateCeldaDto): Promise<Celda> {
    return await this.celdasService.crear(createCeldaDto);
  }

  @Get('parqueadero/:idParqueadero')
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Celda[]> {
    return await this.celdasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Celda> {
    return await this.celdasService.findCeldaById(id);
  }

  @Patch(':id/estado')
  async actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string
  ): Promise<Celda> {
    return await this.celdasService.actualizarEstado(id, estado);
  }
}
