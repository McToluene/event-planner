import { BaseEntity } from '@/common/entity/base';
import { User } from '@/user/entity/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('languages')
export class Language extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @OneToMany(() => User, (user) => user.language)
  users: User[];
}
