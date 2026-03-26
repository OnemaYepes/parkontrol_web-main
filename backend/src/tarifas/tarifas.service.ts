import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tarifa } from './entities/tarifa.entity';
import { CreateTarifaDto } from './entities/dto/crear-tarifa.dto';
import { ParqueaderosService } from 'src/parqueaderos/parqueaderos.service';
import { TipoVehiculo } from 'src/shared/entities/tipo-vehiculo.entity';

@Injectable()
export class TarifasService {
  constructor(
    @InjectRepository(Tarifa)
    private readonly tarifaRepository: Repository<Tarifa>,
    @InjectRepository(TipoVehiculo)
    private readonly tipoVehiculoRepository: Repository<TipoVehiculo>,
    private readonly parqueaderosService: ParqueaderosService,
  ) {}

  async crear(createTarifaDto: CreateTarifaDto): Promise<Tarifa> {
    const parqueadero = await this.parqueaderosService.findParqueaderoById(createTarifaDto.idParqueadero);
    const tipoVehiculo = await this.tipoVehiculoRepository.findOne({
      where: { id: createTarifaDto.idTipoVehiculo },
    });
    if (!tipoVehiculo) {
      throw new NotFoundException(`No existe tipo de vehículo con id: ${createTarifaDto.idTipoVehiculo}`);
    }

    const tarifa = this.tarifaRepository.create({
      parqueadero,
      tipoVehiculo,
      precioFraccionHora: createTarifaDto.precioFraccionHora,
      precioHoraAdicional: createTarifaDto.precioHoraAdicional,
    });

    return await this.tarifaRepository.save(tarifa);
  }

  async findByParqueadero(idParqueadero: number): Promise<Tarifa[]> {
    return await this.tarifaRepository.find({
      where: { parqueadero: { id: idParqueadero } },
      relations: ['parqueadero', 'tipoVehiculo'],
    });
  }

  async findByParqueaderoYTipo(idParqueadero: number, idTipoVehiculo: number): Promise<Tarifa | null> {
    return await this.tarifaRepository.findOne({
      where: {
        parqueadero: { id: idParqueadero },
        tipoVehiculo: { id: idTipoVehiculo },
      },
      relations: ['parqueadero', 'tipoVehiculo'],
    });
  }

  async actualizar(id: number, updateData: Partial<CreateTarifaDto>): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findOne({ 
      where: { id },
      relations: ['parqueadero', 'tipoVehiculo'],
    });
    
    if (!tarifa) {
      throw new NotFoundException(`No existe tarifa con id: ${id}`);
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updateData.precioFraccionHora !== undefined) {
      updateFields.push(`PRECIO_FRACCION_HORA = :${paramIndex}`);
      updateValues.push(updateData.precioFraccionHora);
      paramIndex++;
    }

    if (updateData.precioHoraAdicional !== undefined) {
      updateFields.push(`PRECIO_HORA_ADICIONAL = :${paramIndex}`);
      updateValues.push(updateData.precioHoraAdicional);
      paramIndex++;
    }

    if (updateFields.length > 0) {
      updateValues.push(id);
      const query = `UPDATE TARIFA SET ${updateFields.join(', ')} WHERE ID_TARIFA = :${paramIndex}`;
      await this.tarifaRepository.query(query, updateValues);
    }

    const tarifaActualizada = await this.tarifaRepository.findOne({
      where: { id },
      relations: ['parqueadero', 'tipoVehiculo'],
    });

    if (!tarifaActualizada) {
      throw new NotFoundException(`No se pudo recuperar la tarifa actualizada con id: ${id}`);
    }

    return tarifaActualizada;
  }

  async findTarifaById(id: number): Promise<Tarifa> {
    const tarifa = await this.tarifaRepository.findOne({
      where: { id },
      relations: ['parqueadero', 'tipoVehiculo'],
    });
    if (!tarifa) {
      throw new NotFoundException(`No existe tarifa con id: ${id}`);
    }
    return tarifa;
  }
}
