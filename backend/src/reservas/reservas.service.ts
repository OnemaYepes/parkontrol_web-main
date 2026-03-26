import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './entities/reserva.entity';
import { CreateReservaDto } from './entities/dto/crear-reserva.dto';
import { VehiculosService } from 'src/vehiculos/vehiculos.service';
import { CeldasService } from 'src/celdas/celdas.service';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly vehiculosService: VehiculosService,
    private readonly celdasService: CeldasService,
  ) {}

  async crear(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const vehiculo = await this.vehiculosService.findVehiculoById(createReservaDto.idVehiculo);
    const celda = await this.celdasService.findCeldaById(createReservaDto.idCelda);

    if (celda.estado !== 'LIBRE') {
      throw new BadRequestException('La celda no está LIBRE');
    }

    const reserva = this.reservaRepository.create({
      vehiculo,
      celda,
      estado: createReservaDto.estado,
      fechaEntrada: new Date(),
    });

    const reservaGuardada = await this.reservaRepository.save(reserva);

    await this.celdasService.actualizarEstado(celda.id, 'OCUPADA');

    return reservaGuardada;
  }

  async finalizarReserva(id: number): Promise<Reserva> {
    const reserva = await this.findReservaById(id);
    
    if (reserva.fechaSalida) {
      throw new BadRequestException('La reserva ya ha sido cerrada');
    }

    reserva.fechaSalida = new Date();
    reserva.estado = 'CERRADA';

    const reservaActualizada = await this.reservaRepository.save(reserva);

    await this.celdasService.actualizarEstado(reserva.celda.id, 'LIBRE');

    return reservaActualizada;
  }

  async findReservaById(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: ['vehiculo', 'vehiculo.tipoVehiculo', 'celda', 'celda.parqueadero'],
    });
    if (!reserva) {
      throw new NotFoundException(`No existe reserva con id: ${id}`);
    }
    return reserva;
  }

  async findByParqueadero(idParqueadero: number): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      where: { celda: { parqueadero: { id: idParqueadero } } },
      relations: ['vehiculo', 'vehiculo.tipoVehiculo', 'celda'],
      order: { fechaEntrada: 'DESC' },
    });
  }

  async findActivas(): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      where: { estado: 'ABIERTA' },
      relations: ['vehiculo', 'vehiculo.tipoVehiculo', 'celda', 'celda.parqueadero'],
    });
  }
}