import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
  Entity,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestampsOnInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.id = uuidv4();
  }

  @BeforeUpdate()
  updateTimestampsOnUpdate() {
    this.updatedAt = new Date();
  }
}
