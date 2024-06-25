import { BaseEntity } from '@/common/entity/base';
import { Entity } from 'typeorm';

@Entity('languages')
export class Language extends BaseEntity {
  name: string;
  code: string;
}
