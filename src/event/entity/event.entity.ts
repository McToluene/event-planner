import { BaseEntity } from '@/common/entity/base';
import { User } from '@/user/entity/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Itinerary } from './itinerary.entity';
import { Guest } from './guest.entity';
import { Post } from '@/post/entity/post.entity';
import { EventLike } from './event-like.entity';

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

  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Itinerary, (itinerary) => itinerary.event)
  itineraries: Itinerary[];

  @OneToMany(() => Guest, (guest) => guest.event)
  guests: Guest[];

  @OneToMany(() => Post, (post) => post.event)
  posts: Post[];

  @OneToMany(() => EventLike, (like) => like.event)
  likes: EventLike[];
}
