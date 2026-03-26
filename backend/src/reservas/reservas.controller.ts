import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './entities/dto/crear-reserva.dto';
import { Reserva } from './entities/reserva.entity';
import { CeldasService } from 'src/celdas/celdas.service';

@Controller('reservations')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService, private readonly celdasService: CeldasService) {}

  @Post()
  async crear(@Body() createReservaDto: CreateReservaDto): Promise<Reserva> {
    return await this.reservasService.crear(createReservaDto);
  }

  @Patch(':id/finalizar')
  async finalizar(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    return await this.reservasService.finalizarReserva(id);
  }

  @Get('activas')
  async obtenerActivas(): Promise<Reserva[]> {
    return await this.reservasService.findActivas();
  }

  @Get('parqueadero/:idParqueadero')
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Reserva[]> {
    return await this.reservasService.findByParqueadero(idParqueadero);
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Reserva> {
    return await this.reservasService.findReservaById(id);
  }
}
