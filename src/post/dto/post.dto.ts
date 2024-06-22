import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { Post } from '../entity/post.entity';
import { PostType } from '../enum/post-type.enum';
import { Privacy } from '../enum/privacy.enum';

export namespace PostDto {
  export class Root extends AbstractDto {
    id: string;
    content: string;
    mediaUrls: string[];
    postType: PostType;
    privacy: Privacy;
    user: {
      id: string;
      name: string;
      avatar: string;
    };

    getEntity() {
      const entity = new Post();
      entity.content = this.content;
      entity.postType = this.postType;
      entity.privacy = this.privacy;
      return entity;
    }
  }

  export function createFromEntity(entity: Post) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.content = entity.content;
    dto.mediaUrls = entity.mediaUrls;
    dto.user = {
      id: entity.user.id,
      name: entity.user.fullName,
      avatar: '',
    };
    dto.postType = entity.postType;
    dto.privacy = entity.privacy;
    return dto;
  }

  export interface CreatePost {
    content: string;
    postType: PostType;
    files?: File[];
    privacy: Privacy;
  }
}
