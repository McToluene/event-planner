import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { tags } from 'typia';
import { Itinerary } from '../entity/itinerary.entity';

export namespace ItineraryDto {
  export class Root extends AbstractDto {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    createdAt: Date;
    updatedAt: Date;

    getEntity() {
      const entity = new Itinerary();
      entity.startTime = this.startTime;
      entity.endTime = this.endTime;
      entity.title = this.title;
      return entity;
    }
  }

  export interface CreateItinerary {
    startTime: string & tags.Format<'date-time'>;
    endTime: string & tags.Format<'date-time'>;
    title: string;
  }

  export function createFromEntity(entity: Itinerary) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.startTime = new Date(entity.startTime);
    dto.endTime = new Date(entity.endTime);
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
