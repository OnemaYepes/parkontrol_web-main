import { Controller, Get, Param, Post, Body, ParseIntPipe, NotFoundException, Query } from '@nestjs/common';
import { VistasService } from './vistas.service';
import { ProcesarPagoDto } from './dto/procesar-pago.dto';

@Controller('views')
export class VistasController {
  constructor(private readonly vistasService: VistasService) {}

  @Get('ocupacion')
  async getOcupacionParqueaderos(@Query('idEmpresa') idEmpresa?: string) {
    const idEmpresaNum = idEmpresa ? Number.parseInt(idEmpresa, 10) : null;
    return await this.vistasService.getOcupacionByEmpresa(idEmpresaNum);
  }

  @Get('ocupacion/:idParqueadero')
  async getOcupacionByParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    
    if (!ocupacion) {
      throw new NotFoundException({
        message: `No occupation data found for parking lot ${idParqueadero}`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return ocupacion;
  }

  @Get('historial-reservas')
  async getHistorialReservas(@Query('idEmpresa') idEmpresa?: string) {
    const idEmpresaNum = idEmpresa ? Number.parseInt(idEmpresa, 10) : null;
    return await this.vistasService.getHistorialByEmpresa(idEmpresaNum);
  }

  @Get('historial-reservas/parqueadero/:idParqueadero/placa/:placa')
  async getHistorialByPlacaAndParqueadero(
    @Param('idParqueadero', ParseIntPipe) idParqueadero: number,
    @Param('placa') placa: string
  ) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    
    if (!ocupacion) {
      throw new NotFoundException({
        message: `Parking lot ${idParqueadero} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return await this.vistasService.getHistorialByPlacaAndParqueadero(placa, idParqueadero);
  }

  @Get('facturacion')
  async getFacturacionCompleta(@Query('idEmpresa') idEmpresa?: string) {
    const idEmpresaNum = idEmpresa ? Number.parseInt(idEmpresa, 10) : null;
    return await this.vistasService.getFacturacionByEmpresa(idEmpresaNum);
  }

  @Get('facturacion/documento/:numeroDocumento')
  async getFacturacionByDocumento(
    @Param('numeroDocumento') numeroDocumento: string,
    @Query('idEmpresa') idEmpresa?: string
  ) {
    const idEmpresaNum = idEmpresa ? Number.parseInt(idEmpresa, 10) : null;
    return await this.vistasService.getFacturacionByDocumento(numeroDocumento, idEmpresaNum);
  }

  @Get('ingresos')
  async getIngresosMensuales(@Query('idEmpresa') idEmpresa?: string) {
    const idEmpresaNum = idEmpresa ? Number.parseInt(idEmpresa, 10) : null;
    return await this.vistasService.getIngresosByEmpresa(idEmpresaNum);
  }

  @Get('ingresos/parqueadero/:idParqueadero')
  async getIngresosByParqueadero(@Param('idParqueadero', ParseIntPipe) idParqueadero: number) {
    const ocupacion = await this.vistasService.getOcupacionByParqueadero(idParqueadero);
    
    if (!ocupacion) {
      throw new NotFoundException({
        message: `Parking lot ${idParqueadero} not found`,
        error: 'Not Found',
        statusCode: 404,
      });
    }

    return await this.vistasService.getIngresosByParqueadero(idParqueadero);
  }

  @Post('procesar-pago')
  async procesarPago(@Body() procesarPagoDto: ProcesarPagoDto) {
    return await this.vistasService.procesarPago(procesarPagoDto.idReserva, procesarPagoDto.idMetodoPago);
  }

  @Get('buscar-vehiculo/:placa')
  async buscarVehiculoPorPlaca(@Param('placa') placa: string) {
    return await this.vistasService.buscarVehiculoPorPlaca(placa);
  }
}
