import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { TipoCelda } from './entities/tipo-celda.entity';
import { TipoVehiculo } from './entities/tipo-vehiculo.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { Periodo } from './entities/periodo.entity';
import { Sensor } from './entities/sensor.entity';
import { RolesService } from './services/roles/roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Rol,
            TipoCelda,
            TipoVehiculo,
            MetodoPago,
            Periodo,
            Sensor
        ]),
    ],
    providers: [RolesService],
    exports: [TypeOrmModule, RolesService],
})
export class SharedModule {}
