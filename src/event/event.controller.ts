import { Controller, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import {
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { TypedFormData, TypedRoute } from '@nestia/core';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/common/constants';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * Create an event.
   *
   * @tag event
   */
  @TypedRoute.Post('create')
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async create(
    @Request() req,
    @TypedFormData.Body() event: EventDto.CreateEvent,
  ): Promise<SingleRecordResponse<EventDto.Root>> {
    return this.eventService
      .create(req.user, event)
      .then((response) =>
        ResponseWrap.single(EventDto.createFromEntities(response)),
      );
  }
}
