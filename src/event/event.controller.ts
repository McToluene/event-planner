import { Controller, UseGuards, Request } from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import {
  ManyRecordsResponse,
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { TypedFormData, TypedRoute } from '@nestia/core';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/common/constants';
import { ConfigService } from '@nestjs/config';

@Controller('event')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Create an event.
   * @tag event
   * @operationId create
   * @param {EventDto.CreateEvent} event - create listing request
   *
   * @returns {Promise<SingleRecordResponse<EventDto.Root>>} - created event
   */
  @TypedRoute.Post()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async create(
    @Request() req: any,
    @TypedFormData.Body() event: EventDto.CreateEvent,
  ): Promise<SingleRecordResponse<EventDto.Root>> {
    return this.eventService
      .create(req.user, event)
      .then((response) =>
        ResponseWrap.single(
          EventDto.createFromEntity(
            response,
            this.config.get<string>('FRONTEND_URL') + response.id,
          ),
        ),
      );
  }

  /**
   * Get an event.
   * @tag event
   * @operationId getEvent
   *
   * @returns {Promise<ManyRecordsResponse<EventDto.Root>>} - list events
   */
  @TypedRoute.Get()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async getEvents(
    @Request() req: any,
  ): Promise<ManyRecordsResponse<EventDto.Root>> {
    return this.eventService
      .getEvents(req.user)
      .then((events) =>
        ResponseWrap.many(
          events.map((ev) =>
            EventDto.createFromEntity(
              ev,
              this.config.get<string>('FRONTEND_URL') + ev.id,
            ),
          ),
        ),
      );
  }
}
