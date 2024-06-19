import { BaseEntity } from '@/common/entity/base';
import { Column, Entity } from 'typeorm';

@Entity('itineraries')
export class Itinerary extends BaseEntity {
  @Column({ name: 'event_id' })
  event: Event;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;
}
