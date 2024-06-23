import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Guest } from '../../event/entity/guest.entity';

export namespace GuestDto {
  export class Root extends AbstractDto {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    isBlocked: boolean;

    getEntity() {
      throw new Error('Method not implemented.');
    }
  }

  export function createFromEntity(entity: Guest) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.user = {
      id: entity.user.id,
      name: entity.user.fullName,
      avatar: entity.user.avatar ?? '',
    };
    dto.isBlocked = entity.isBlocked;
    return dto;
  }
}
