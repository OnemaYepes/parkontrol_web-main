import { Body, Controller, Get, Param, ParseIntPipe, Post, NotFoundException } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './entities/dto/crear-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';

@Controller('vehicles')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) {}

  @Post()
  async crear(@Body() createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    return await this.vehiculosService.crear(createVehiculoDto);
  }

  @Get('placa/:placa')
  async obtenerPorPlaca(@Param('placa') placa: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculosService.findByPlaca(placa);
    if (!vehiculo) {
      throw new NotFoundException(`No existe vehículo con placa: ${placa}`);
    }
    return vehiculo;
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Vehiculo> {
    return await this.vehiculosService.findVehiculoById(id);
  }
}
