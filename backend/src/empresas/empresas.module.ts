import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './entities/empresa.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empresa]),
  ],
  controllers: [EmpresasController],
  providers: [EmpresasService],
  exports: [EmpresasService]
})
export class EmpresasModule {}
