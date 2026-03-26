import { Body, Controller, Get, Param, ParseIntPipe, Post, NotFoundException } from '@nestjs/common';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './entities/dto/crear-pago.dto';
import { Pago } from './entities/pago.entity';
import { ReservasService } from 'src/reservas/reservas.service';

@Controller('payments')
export class PagosController {
  constructor(private readonly pagosService: PagosService, private readonly reservasService: ReservasService) {}

  @Post()
  async crear(@Body() createPagoDto: CreatePagoDto): Promise<Pago> {
    return await this.pagosService.crear(createPagoDto);
  }

  @Get('parqueadero/:idParqueadero')
  async obtenerPorParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number): Promise<Pago[]> {
    return await this.pagosService.findByParqueadero(idParqueadero);
  }

  @Get('reserva/:idReserva')
  async obtenerPorReserva(@Param('idReserva', ParseIntPipe) idReserva: number): Promise<Pago> {
    const pago = await this.pagosService.findByReserva(idReserva);
    if (!pago) {
      throw new NotFoundException(`No existe pago para la reserva con id: ${idReserva}`);
    }
    return pago;
  }

  @Get(':id')
  async obtenerPorId(@Param('id', ParseIntPipe) id: number): Promise<Pago> {
    return await this.pagosService.findPagoById(id);
  }
}
