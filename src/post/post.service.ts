import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { Post } from './entity/post.entity';
import { PostDto } from './dto/post.dto';
import { EventService } from '@/event/event.service';
import { User } from '@/user/entity/user.entity';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { MediaService } from '@/media/media.service';
import { PostLike } from './entity/post-like.entity';
import { Privacy } from './enum/privacy.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private eventService: EventService,
    private mediaService: MediaService,
    @InjectRepository(PostLike)
    private postLikeRepository: Repository<PostLike>,
    @InjectQueue('post') private postQueue: Queue,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    let entity = new PostDto.Root(post).getEntity();
    entity.mediaUrls = urls;
    entity.user = user;
    entity.event = event;
    entity = await this.postRepository.save(entity);
    await this.postQueue.add('new-post', entity.id);
    return entity;
  }

  async getPosts(
    user: User,
    eventId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Post[]> {
    const event = await this.eventService.findById(eventId);
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    return this.postRepository.manager.transaction(async (entityManager) => {
      const posts = await entityManager.find(Post, {
        where: { event },
        relations: ['user', 'likes'],
        order: {
          createdAt: 'DESC',
        },
        skip,
        take,
      });
      if (posts.length > 0) {
        user.lastFetchedPost = posts[0].createdAt;
        await entityManager.save(User, user);
      }
      return posts;
    });
  }

  async likePost(user: User, id: string): Promise<PostLike> {
    const post = await this.postRepository.findOne({
      where: [{ id }],
    });
    if (!post) throw new NotFoundException('Post not found!');

    const existingLike = await this.postLikeRepository.findOne({
      where: [{ user, post }],
    });
    if (existingLike) throw new ConflictException('Post already liked!');
    return this.postLikeRepository.save({ user, post });
  }

  async unlikePost(user: User, id: string): Promise<void> {
    const post = await this.postRepository.findOne({
      where: [{ id }],
    });

    if (!post) throw new NotFoundException('Post not found!');
    await this.postLikeRepository.delete({ user, post });
  }

  async findById(id: string): Promise<Post | null> {
    return this.postRepository.findOne({
      where: [{ id }],
      relations: ['event', 'event.guests', 'event.guests.user'],
    });
  }

  async checkLatest(user: User, eventId: string): Promise<number> {
    const event = await this.eventService.findById(eventId);
    return this.postRepository.count({
      where: [
        {
          event,
          createdAt: MoreThan(user.lastFetchedPost),
          privacy: Not(Privacy.ONLYME),
        },
      ],
    });
  }

  async getLatestCount(user: User): Promise<number> {
    const count = await this.cacheManager.get<number>(user.id);
    return count ?? 0;
  }
}
