import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '@/common/entity/base';

export enum OAuthProvidersEnum {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
@Entity('user_oauths')
export class UserOauth extends BaseEntity {
  @Column({
    name: 'oauthProvider',
    type: 'enum',
    enum: OAuthProvidersEnum,
  })
  oauthProvider: OAuthProvidersEnum;

  @Column({ name: 'provider_user_id', nullable: true })
  providerUserId: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken?: string;

  @Column({ name: 'token_expiry', type: 'date', nullable: true })
  tokenExpiry?: Date;

  @Column({ name: 'refresh_count', nullable: true })
  refreshCount?: number;

  @Column({ name: 'refreshed_at', type: 'date', nullable: true })
  refreshedAt?: Date;

  @ManyToOne(() => User, (user) => user.oauths)
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @Column({ name: 'user_id' })
  userId: string;
}
