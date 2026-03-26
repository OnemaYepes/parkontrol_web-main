import { Module } from '@nestjs/common';
import { ParqueaderosController } from './parqueaderos.controller';
import { ParqueaderosService } from './parqueaderos.service';
import { Parqueadero } from './entities/parqueadero.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresasModule } from 'src/empresas/empresas.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Parqueadero]),
      EmpresasModule
    ],
  controllers: [ParqueaderosController],
  providers: [ParqueaderosService],
  exports: [ParqueaderosService]
})
export class ParqueaderosModule {}
