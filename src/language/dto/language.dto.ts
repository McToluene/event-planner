import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Language } from '../entity/language.entity';

export namespace LanguageDto {
  export class Root extends AbstractDto {
    id: string;
    name: string;
    code: string;

    getEntity() {
      const entity = new Language();
      entity.name = this.name;
      entity.code = this.code;
      return entity;
    }
  }

  export function createFromEntity(entity: Language) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.code = entity.code;
    dto.name = entity.name;
    return dto;
  }

  export type CreateLanguage = Pick<Root, 'name' | 'code'>;

  export type Translate = {
    text: string;
  };
}
