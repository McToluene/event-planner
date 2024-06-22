import { Controller, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { TypedFormData, TypedParam, TypedRoute } from '@nestia/core';
import { STRATEGY_NAMES } from '@/common/constants';
import { AuthGuard } from '@nestjs/passport';
import { PostDto } from './dto/post.dto';
import {
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';

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
}
