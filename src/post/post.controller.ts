import { Controller, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { TypedFormData, TypedParam, TypedRoute } from '@nestia/core';
import { STRATEGY_NAMES } from '@/common/constants';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import {
  ManyRecordsResponse,
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { PostLikeDto } from './dto/post-like.dto';

@Controller('event/:eventId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * Post on an event.
   * @tag post
   * @operationId addPost
   * @param eventId The id of the event.
   *
   * @returns {Promise<SingleRecordResponse<PostDto.Root>>} - post
   */
  @TypedRoute.Post()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async addPost(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
    @TypedFormData.Body() post: PostDto.CreatePost,
  ): Promise<SingleRecordResponse<PostDto.Root>> {
    return this.postService
      .create(req.user, eventId, post)
      .then((response) =>
        ResponseWrap.single(PostDto.createFromEntity(response)),
      );
  }

  /**
   * Get event posts.
   * @tag post
   * @operationId getPosts
   * @param eventId The id of the event.
   *
   * @returns {Promise<ManyRecordsResponse<PostDto.Root>>} - post
   */
  @TypedRoute.Get()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async getPosts(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
    @TypedParam('pageNumber') pageNumber: number,
    @TypedParam('pageSize') pageSize: number,
  ): Promise<ManyRecordsResponse<PostDto.Root>> {
    return this.postService
      .getPosts(req.user, eventId, pageNumber, pageSize)
      .then((posts) =>
        ResponseWrap.many(posts.map((p) => PostDto.createFromEntity(p))),
      );
  }

  /**
   * Like a post.
   * @tag post
   * @operationId likePost
   * @param eventId The id of the event.
   * @param id The id of the post.
   *
   * @returns {Promise<SingleRecordResponse<EventLikeDto.Root>>} - like data
   */
  @TypedRoute.Post(':id/like')
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async likePost(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
    @TypedParam('id') id: string,
  ): Promise<SingleRecordResponse<PostLikeDto.Root>> {
    return this.postService
      .likePost(req.user, id)
      .then((like) => ResponseWrap.single(PostLikeDto.createFromEntity(like)));
  }

  /**
   * Unlike a post.
   * @tag post
   * @operationId unlikePost
   * @param eventId The id of the event.
   * @param id The id of the post.
   *
   * @returns {Promise<void>}
   */
  @TypedRoute.Delete(':id/like')
  async unlikePost(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
    @TypedParam('id') id: string,
  ): Promise<void> {
    return this.postService.unlikePost(req.user, id);
  }

  /**
   * Get count of new posts.
   * @tag post
   * @operationId checkLatest
   * @param eventId The id of the event.
   *
   * @returns {Promise<SingleRecordResponse<number>>}
   */
  @TypedRoute.Get('latest')
  async checkLatest(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
  ): Promise<SingleRecordResponse<number>> {
    return this.postService
      .checkLatest(req.user, eventId)
      .then((count) => ResponseWrap.single(count));
  }
}
