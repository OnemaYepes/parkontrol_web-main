import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { CreateReporteDto } from './entities/dto/crear-reporte.dto';
import { Reporte } from './entities/reporte.entity';

@Controller('reports')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post()
  async crear(@Body() createReporteDto: CreateReporteDto): Promise<Reporte> {
    return await this.reportesService.crear(createReporteDto);
  }

  @Get('parqueadero/:idParqueadero')
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Reporte[]> {
    return await this.reportesService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Reporte> {
    return await this.reportesService.findReporteById(id);
  }

  @Patch(':id/url')
  async actualizarUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body('urlArchivo') urlArchivo: string
  ): Promise<Reporte> {
    return await this.reportesService.actualizarUrl(id, urlArchivo);
  }
}
