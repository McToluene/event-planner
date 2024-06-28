import { BaseEntity } from '@/common/entity/base';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserOauth } from './user-oauth.entity';
import { Event } from '@/event/entity/event.entity';
import { Post } from '@/post/entity/post.entity';
import { EventLike } from '@/event/entity/event-like.entity';
import { PostLike } from '@/post/entity/post-like.entity';
import { Language } from '@/language/entity/language.entity';
import { PostView } from '@/post/entity/post-view';

@Entity('users')
export class User extends BaseEntity {
  @Column({ name: 'full_name' })
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash: string;

  @Column({ name: 'active', default: true })
  active: boolean;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'oauth_enabled', default: false })
  oauthEnabled: boolean;

  @OneToMany(() => UserOauth, (oauth) => oauth.user)
  oauths: UserOauth[];

  @OneToMany(() => Event, (event) => event.user)
  events: Event[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => EventLike, (like) => like.user)
  eventLikes: EventLike[];

  @OneToMany(() => PostLike, (like) => like.user)
  postLikes: PostLike[];

  @ManyToOne(() => Language)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @OneToMany(() => PostView, (view) => view.user)
  postViews: PostView[];

  @Column({ type: 'timestamp', nullable: true })
  lastFetchedPosts: Date;
}
