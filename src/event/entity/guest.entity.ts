import { BaseEntity } from '@/common/entity/base';
import { Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Event } from './event.entity';
import { User } from '@/user/entities/user.entity';

@Entity('guests')
export class Guest extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.guests, { onDelete: 'CASCADE' })
  event: Event;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
