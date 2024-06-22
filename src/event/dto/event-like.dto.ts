import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { EventLike } from '../entity/event-like.entity';

export namespace EventLikeDto {
  export class Root extends AbstractDto {
    id: string;
    userId: string;
    eventId: string;

    getEntity() {
      const entity = new EventLike();
      return entity;
    }
  }

  export function createFromEntity(entity: EventLike) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.eventId = entity.event.id;
    dto.userId = entity.user.id;
    return dto;
  }
}
