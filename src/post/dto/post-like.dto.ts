import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { PostLike } from '../entity/post-like.entity';

export namespace PostLikeDto {
  export class Root extends AbstractDto {
    id: string;
    userId: string;
    postId: string;

    getEntity() {
      const entity = new PostLike();
      return entity;
    }
  }

  export function createFromEntity(entity: PostLike) {
    const dto: Root = new Root();
    dto.id = entity.id;
    dto.postId = entity.post.id;
    dto.userId = entity.user.id;
    return dto;
  }
}
