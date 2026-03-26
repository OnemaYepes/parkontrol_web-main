import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacturaElectronica } from './entities/factura-electronica.entity';
import { ClienteFactura } from './entities/cliente-factura.entity';
import { CreateFacturaElectronicaDto } from './entities/dto/crear-factura-electronica.dto';
import { CreateClienteFacturaDto } from './entities/dto/crear-cliente-factura.dto';
import { PagosService } from 'src/pagos/pagos.service';

@Injectable()
export class FacturacionService {
  constructor(
    @InjectRepository(FacturaElectronica)
    private readonly facturaRepository: Repository<FacturaElectronica>,
    @InjectRepository(ClienteFactura)
    private readonly clienteFacturaRepository: Repository<ClienteFactura>,
    private readonly pagosService: PagosService,
  ) {}

  async crearCliente(createClienteDto: CreateClienteFacturaDto): Promise<ClienteFactura> {
    const cliente = this.clienteFacturaRepository.create(createClienteDto);
    return await this.clienteFacturaRepository.save(cliente);
  }

  async crearFactura(createFacturaDto: CreateFacturaElectronicaDto): Promise<FacturaElectronica> {
    const pago = await this.pagosService.findPagoById(createFacturaDto.idPago);
    const cliente = await this.clienteFacturaRepository.findOne({
      where: { id: createFacturaDto.idClienteFactura },
    });
    if (!cliente) {
      throw new NotFoundException(`No existe cliente con id: ${createFacturaDto.idClienteFactura}`);
    }

    const factura = this.facturaRepository.create({
      pago,
      clienteFactura: cliente,
      cufe: createFacturaDto.cufe,
      urlPdf: createFacturaDto.urlPdf,
      enviada: 'N',
      fechaCreacion: new Date(),
    });

    return await this.facturaRepository.save(factura);
  }

  async marcarComoEnviada(id: number): Promise<FacturaElectronica> {
    const factura = await this.facturaRepository.findOne({ where: { id } });
    if (!factura) {
      throw new NotFoundException(`No existe factura con id: ${id}`);
    }
    factura.enviada = 'Y';
    return await this.facturaRepository.save(factura);
  }

  async findByPago(idPago: number): Promise<FacturaElectronica | null> {
    return await this.facturaRepository.findOne({
      where: { pago: { id: idPago } },
      relations: ['pago', 'clienteFactura'],
    });
  }

  async obtenerClientes(): Promise<ClienteFactura[]> {
    return await this.clienteFacturaRepository.find();
  }
}
