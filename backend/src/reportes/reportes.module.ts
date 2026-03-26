import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportesController } from './reportes.controller';
import { ReportesService } from './reportes.service';
import { Reporte } from './entities/reporte.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ParqueaderosModule } from 'src/parqueaderos/parqueaderos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reporte]),
    SharedModule,
    ParqueaderosModule,
  ],
  controllers: [ReportesController],
  providers: [ReportesService],
  exports: [ReportesService],
})
export class ReportesModule {}
