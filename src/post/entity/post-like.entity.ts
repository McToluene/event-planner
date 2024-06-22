import { BaseEntity } from '@/common/entity/base';
import { User } from '@/user/entities/user.entity';

import { Entity, ManyToOne } from 'typeorm';
import { Post } from './post.entity';

@Entity('post_likes')
export class PostLike extends BaseEntity {
  @ManyToOne(() => User, (user) => user.postLikes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;
}
