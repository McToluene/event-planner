import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Event } from '../entity/event.entity';
import { ItineraryDto } from './itinerary.dto';
import { tags } from 'typia';
import { GuestDto } from './guest.dto';

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
    itineraries: ItineraryDto.Root[] | [];
    guests: GuestDto.Root[] | [];

    getEntity() {
      const entity = new Event();
      entity.id = this.id;
      entity.name = this.name;
      entity.color = this.color;
      entity.date = this.date;
      entity.font = this.font;
      entity.mediaUrls = this.mediaUrls;
      entity.description = this.description;
      entity.itineraries = this.itineraries.map((i) =>
        new ItineraryDto.Root(i).getEntity(),
      );
      return entity;
    }
  }

  export function createFromEntity(entity: Event, url: string) {
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
    dto.itineraries =
      entity.itineraries?.map(ItineraryDto.createFromEntity) ?? [];
    dto.guests = entity.guests?.map(GuestDto.createFromEntity) ?? [];
    return dto;
  }

  export interface CreateEvent {
    name: string;
    description: string;
    date: string & tags.Format<'date-time'>;
    color: string[];
    font: string[];
    itineraries: ItineraryDto.CreateItinerary[];
  }
}
