import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TarifasService } from './tarifas.service';
import { CreateTarifaDto } from './entities/dto/crear-tarifa.dto';
import { Tarifa } from './entities/tarifa.entity';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';

@Controller('rates')
export class TarifasController {
  constructor(private readonly tarifasService: TarifasService, private readonly parqueaderosService: ParqueaderosService) {}

  @Post()
  async crear(@Body() createTarifaDto: CreateTarifaDto): Promise<Tarifa> {
    return await this.tarifasService.crear(createTarifaDto);
  }

  @Get('parqueadero/:idParqueadero')
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Tarifa[]> {
    return await this.tarifasService.findByParqueadero(idParqueadero);
  }

  @Patch(':id')
  async actualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateTarifaDto>
  ): Promise<Tarifa> {
    return await this.tarifasService.actualizar(id, updateData);
  }
}
