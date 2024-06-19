import { BaseEntity } from '@/common/entity/base';
import { User } from '@/user/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Itinerary } from './itinerary.entity';

@Entity('events')
export class Event extends BaseEntity {
  @Column()
  name: string;

  @Column()
  date: Date;

  @Column()
  description: string;

  @Column('text', { array: true })
  color: string[];

  @Column('text', { array: true })
  font: string[];

  @Column('text', { name: 'media_urls', array: true })
  mediaUrls: string[];

  @Column({ name: 'user_id' })
  user: User;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.event)
  itineraries: Itinerary[];
}
