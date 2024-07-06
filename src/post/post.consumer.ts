import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PostService } from './post.service';

@Processor('post')
export class PostConsumer {
  private readonly logger = new Logger(PostConsumer.name);

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly postService: PostService,
  ) {}

  @Process('new-post')
  async transcode(job: Job<string>): Promise<void> {
    try {
      const post = await this.postService.findById(job.data);
      if (!post) {
        this.logger.warn(`Post with id ${job.data} not found`);
        return;
      }

      const guests = post.event.guests.filter((g) => !g.isBlocked);
      await Promise.all(
        guests.map(async (g) => {
          const lastFetchedPost = g.user.lastFetchedPost;
          if (lastFetchedPost && post.createdAt > lastFetchedPost) {
            const storedCount =
              (await this.cacheManager.get<number>(g.user.id)) ?? 0;
            await this.cacheManager.set(g.user.id, storedCount + 1);
          }
        }),
      );
      this.logger.log(`Processed job for post id ${job.data}`);
    } catch (error) {
      this.logger.error(
        `Failed to process job for post id ${job.data}`,
        error.stack,
      );
    }
  }
}
