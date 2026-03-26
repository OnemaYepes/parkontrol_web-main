import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Parqueadero } from 'src/parqueaderos/entities/parqueadero.entity';
import { TipoVehiculo } from 'src/shared/entities/tipo-vehiculo.entity';

@Entity('TARIFA')
export class Tarifa {
  @PrimaryGeneratedColumn({ name: 'ID_TARIFA', type: 'number' })
  id: number;

  @Column({ name: 'PRECIO_FRACCION_HORA', type: 'number', precision: 10, scale: 2, nullable: false })
  precioFraccionHora: number;

  @Column({ name: 'PRECIO_HORA_ADICIONAL', type: 'number', precision: 10, scale: 2, nullable: true })
  precioHoraAdicional: number;

  @ManyToOne(() => Parqueadero, { nullable: false })
  @JoinColumn({ name: 'ID_PARQUEADERO' })
  parqueadero: Parqueadero;

  @ManyToOne(() => TipoVehiculo, { nullable: false })
  @JoinColumn({ name: 'ID_TIPO_VEHICULO' })
  tipoVehiculo: TipoVehiculo;
}
