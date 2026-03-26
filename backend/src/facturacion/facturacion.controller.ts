import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, NotFoundException } from '@nestjs/common';
import { FacturacionService } from './facturacion.service';
import { CreateFacturaElectronicaDto } from './entities/dto/crear-factura-electronica.dto';
import { CreateClienteFacturaDto } from './entities/dto/crear-cliente-factura.dto';
import { FacturaElectronica } from './entities/factura-electronica.entity';
import { ClienteFactura } from './entities/cliente-factura.entity';

@Controller('invoicing')
export class FacturacionController {
  constructor(private readonly facturacionService: FacturacionService) {}

  @Post('clientes')

  async crearCliente(@Body() createClienteDto: CreateClienteFacturaDto): Promise<ClienteFactura> {
    return await this.facturacionService.crearCliente(createClienteDto);
  }

  @Post('facturas')
  async crearFactura(@Body() createFacturaDto: CreateFacturaElectronicaDto): Promise<FacturaElectronica> {
    return await this.facturacionService.crearFactura(createFacturaDto);
  }

  @Patch('facturas/:id/enviar')
  async marcarEnviada(@Param('id', ParseIntPipe) id: number): Promise<FacturaElectronica> {
    return await this.facturacionService.marcarComoEnviada(id);
  }

  @Get('facturas/pago/:idPago')
  async obtenerPorPago(@Param('idPago', ParseIntPipe) idPago: number): Promise<FacturaElectronica> {
    const factura = await this.facturacionService.findByPago(idPago);
    if (!factura) {
      throw new NotFoundException(`No existe factura para el pago con id: ${idPago}`);
    }
    return factura;
  }

  
  @Get('clientes')
  async obtenerClientes(): Promise<ClienteFactura[]> {
    return await this.facturacionService.obtenerClientes();
  }
}
