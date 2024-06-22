import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Guest } from '../entity/guest.entity';

export namespace GuestDto {
  export class Root extends AbstractDto {
    id: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
    isBlocked: boolean;

    getEntity() {}
  }

  export function createFromEntity(entity: Guest) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.user = {
      id: entity.user.id,
      name: entity.user.fullName,
      avatar: '',
    };
    dto.isBlocked = entity.isBlocked;
    return dto;
  }
}
