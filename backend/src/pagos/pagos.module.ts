import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ReservasModule } from 'src/reservas/reservas.module';
import { TarifasModule } from 'src/tarifas/tarifas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pago]),
    SharedModule,
    ReservasModule,
    TarifasModule,
  ],
  controllers: [PagosController],
  providers: [PagosService],
  exports: [PagosService],
})
export class PagosModule {}
