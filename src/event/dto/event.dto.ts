import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Event } from '../entity/event.entity';
import { tags } from 'typia';

export namespace EventDto {
  export class Root extends AbstractDto {
    id: string;
    name: string;
    description: string;
    date: Date;
    color: string[];
    font: string[];
    mediaUrls: string[];
    url: string;
    createdAt: Date;
    updatedAt: Date;

    getEntity() {
      const entity = new Event();
      entity.id = this.id;
      entity.name = this.name;
      entity.color = this.color;
      entity.date = this.date;
      entity.font = this.font;
      entity.mediaUrls = this.mediaUrls;
      entity.description = this.description;
      return entity;
    }
  }

  export function createFromEntities(entity: Event, url: string) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.date = new Date(entity.date);
    dto.description = entity.description;
    dto.color = entity.color;
    dto.font = entity.font;
    dto.mediaUrls = entity.mediaUrls;
    dto.url = url;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }

  export interface CreateEvent {
    name: string;
    description: string;
    date: string & tags.Format<'date-time'>;
    color: string[];
    font: string[];
    files: File[];
  }
}
