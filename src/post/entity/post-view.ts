import { Entity, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { Post } from './post.entity';
import { BaseEntity } from '@/common/entity/base';

@Entity('post_views')
export class PostView extends BaseEntity {
  @ManyToOne(() => User, (user) => user.postViews, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Post, (post) => post.views, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  viewedAt: Date;
}
