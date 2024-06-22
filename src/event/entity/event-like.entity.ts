import { BaseEntity } from '@/common/entity/base';
import { User } from '@/user/entities/user.entity';
import { Event } from './event.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity('event_likes')
export class EventLike extends BaseEntity {
  @ManyToOne(() => User, (user) => user.eventLikes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (event) => event.likes, { onDelete: 'CASCADE' })
  event: Event;
}
