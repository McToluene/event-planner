import { BaseEntity } from '@/common/entity/base';
import { Event } from '@/event/entity/event.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { PostType } from '../enum/post-type.enum';
import { User } from '@/user/entities/user.entity';
import { Privacy } from '../enum/privacy.enum';

@Entity('posts')
export class Post extends BaseEntity {
  @ManyToOne(() => Event, (event) => event.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  event: Event;

  @Column()
  content: string;

  @Column({ name: 'post_type' })
  postType: PostType;

  @Column()
  privacy: Privacy;

  @Column('text', { name: 'media_urls', array: true, nullable: true })
  mediaUrls: string[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
