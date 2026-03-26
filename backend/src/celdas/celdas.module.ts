import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CeldasController } from './celdas.controller';
import { CeldasService } from './celdas.service';
import { Celda } from './entities/celda.entity';
import { SharedModule } from 'src/shared/shared.module';
import { ParqueaderosModule } from 'src/parqueaderos/parqueaderos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Celda]),
    SharedModule,
    ParqueaderosModule,
  ],
  controllers: [CeldasController],
  providers: [CeldasService],
  exports: [CeldasService],
})
export class CeldasModule {}
