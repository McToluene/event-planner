import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostDto } from './dto/post.dto';
import { EventService } from '@/event/event.service';
import { User } from '@/user/entities/user.entity';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { MediaService } from '@/media/media.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private eventService: EventService,
    private mediaService: MediaService,
  ) {}
  async create(
    user: User,
    eventId: string,
    post: PostDto.CreatePost,
  ): Promise<Post> {
    const event = await this.eventService.getEvent(eventId);
    let urls: string[] = [];
    if (post.files) {
      const responses = await Promise.all(
        post.files.map(async (file) => {
          const arrayBuffer = await file.arrayBuffer();
          return this.mediaService.upload(
            MediaProviderEnum.CLOUDINARY,
            Buffer.from(arrayBuffer),
            ImageType.EVENT,
          );
        }),
      );

      urls = responses
        .filter(
          (response): response is { url: string; publicId: string } =>
            response !== null,
        )
        .map((response) => response.url);
    }

    const entity = new PostDto.Root(post).getEntity();
    entity.mediaUrls = urls;
    entity.user = user;
    entity.event = event;
    return this.postRepository.save(entity);
  }
}
