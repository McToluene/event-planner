import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostDto } from './dto/post.dto';
import { EventService } from '@/event/event.service';
import { User } from '@/user/entity/user.entity';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { MediaService } from '@/media/media.service';
import { PostLike } from './entity/post-like.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private eventService: EventService,
    private mediaService: MediaService,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
  ) {}

  async create(
    user: User,
    eventId: string,
    post: PostDto.CreatePost,
  ): Promise<Post> {
    const event = await this.eventService.findById(eventId);
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

  async getPosts(eventId: string): Promise<Post[]> {
    const event = await this.eventService.findById(eventId);
    return this.postRepository.find({
      where: [{ event }],
      relations: ['user', 'likes'],
    });
  }

  async likePost(user: User, eventId: string): Promise<PostLike> {
    const post = await this.postRepository.findOne({
      where: [{ id: eventId }],
    });
    if (!post) throw new NotFoundException('Post not found!');

    const existingLike = await this.postLikeRepository.findOne({
      where: [{ user, post }],
    });
    if (existingLike) throw new ConflictException('Post already liked!');
    return this.postLikeRepository.save({ user, post });
  }

  async unlikePost(user: User, eventId: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: [{ id: eventId }],
    });

    if (!post) throw new NotFoundException('Post not found!');
    await this.postLikeRepository.delete({ user, post });
  }
}
