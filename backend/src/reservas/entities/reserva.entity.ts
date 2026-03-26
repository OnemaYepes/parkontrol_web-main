import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Vehiculo } from 'src/vehiculos/entities/vehiculo.entity';
import { Celda } from 'src/celdas/entities/celda.entity';

@Entity('RESERVA')
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'ID_RESERVA', type: 'number' })
  id: number;

  @Column({ name: 'FECHA_ENTRADA', type: 'timestamp', nullable: false })
  fechaEntrada: Date;

  @Column({ name: 'FECHA_SALIDA', type: 'timestamp', nullable: true })
  fechaSalida: Date;

  @Column({ name: 'ESTADO', length: 20, nullable: false })
  estado: string;

  @ManyToOne(() => Vehiculo, { nullable: false })
  @JoinColumn({ name: 'ID_VEHICULO' })
  vehiculo: Vehiculo;

  @ManyToOne(() => Celda, { nullable: false })
  @JoinColumn({ name: 'ID_CELDA' })
  celda: Celda;
}
