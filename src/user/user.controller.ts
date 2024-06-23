import { STRATEGY_NAMES } from '@/common/constants';
import {
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { TypedFormData, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Change profile picture.
   * @tag user
   * @operationId addAvatar
   *
   * @returns {Promise<SingleRecordResponse<EventDto.Root>>} - Updated user
   */
  @TypedRoute.Post(':id/avatar')
  async addAvatar(
    @Request() req: any,
    @TypedFormData.Body() input: UserDto.AddAvatar,
  ): Promise<SingleRecordResponse<UserDto.Root>> {
    const acceptedTypes = ['image/jpeg', 'image/png'];
    if (!acceptedTypes.includes(input.file.type))
      throw new BadRequestException(
        'Invalid file format. Please upload a JPEG or PNG image.',
      );

    if (input.file.size > 3 * 1024 * 1024)
      throw new BadRequestException('File size exceeds the limit of 3MB.');

    return this.userService
      .addAvatar(req.user, input.file)
      .then((u) => ResponseWrap.single(UserDto.createFromEntity(u)));
  }
}
