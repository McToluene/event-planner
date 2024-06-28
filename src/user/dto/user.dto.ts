import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { User } from '../entity/user.entity';
import { LanguageDto } from '@/language/dto/language.dto';

export namespace UserDto {
  export class Root extends AbstractDto {
    id: string;
    fullName: string;
    avatar?: string;
    phoneNumber: string;
    email: string;
    language?: LanguageDto.Root | null;

    getEntity() {
      throw new Error('Method not implemented.');
    }
  }

  export function createFromEntity(entity: User) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.fullName = entity.fullName;
    dto.avatar = entity.avatar ?? '';
    dto.phoneNumber = entity.phoneNumber;
    dto.email = entity.email;
    dto.language =
      entity.language != null
        ? LanguageDto.createFromEntity(entity.language)
        : null;
    return dto;
  }

  export type AddAvatar = {
    file: File;
  };

  export type Profile = Pick<Root, 'fullName' | 'phoneNumber'> & {
    languageId?: string;
  };
}
