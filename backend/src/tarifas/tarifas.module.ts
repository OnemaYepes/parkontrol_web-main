import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifasController } from './tarifas.controller';
import { TarifasService } from './tarifas.service';
import { Tarifa } from './entities/tarifa.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ParqueaderosModule } from 'src/parqueaderos/parqueaderos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tarifa]),
    SharedModule,
    ParqueaderosModule,
  ],
  controllers: [TarifasController],
  providers: [TarifasService],
  exports: [TarifasService],
})
export class TarifasModule {}
