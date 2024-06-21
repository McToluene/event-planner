import { BaseEntity } from '@/common/entity/base';
import { Event } from './event.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('itineraries')
export class Itinerary extends BaseEntity {
  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Event, (event) => event.itineraries, { onDelete: 'CASCADE' })
  event: Event;
}
