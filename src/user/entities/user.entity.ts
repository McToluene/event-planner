import { BaseEntity } from '@/common/entity/base';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserOauth } from './user-oauth.entity';
import { Event } from '@/event/entity/event.entity';
import { Post } from '@/post/entity/post.entity';

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
}
