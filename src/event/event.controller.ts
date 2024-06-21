import {
  Controller,
  UseGuards,
  Request,
  Body,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { EventService } from './event.service';
import { EventDto } from './dto/event.dto';
import {
  ManyRecordsResponse,
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { TypedParam, TypedRoute } from '@nestia/core';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/common/constants';
import { ConfigService } from '@nestjs/config';
import { FilesInterceptor } from '@nestjs/platform-express';

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
   * @param {EventDto.CreateEvent} event - create event request
   *
   * @returns {Promise<SingleRecordResponse<EventDto.Root>>} - created event
   */
  @TypedRoute.Post()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Request() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 50000000 })],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() event: EventDto.CreateEvent,
  ): Promise<SingleRecordResponse<EventDto.Root>> {
    return this.eventService
      .create(req.user, event, files)
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
   * Get events.
   * @tag event
   * @operationId getEvents
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

  /**
   * Get an event.
   * @tag event
   * @operationId getEvent
   * @param id The id of the event.
   *
   * @returns {Promise<SingleRecordResponse<EventDto.Root>>} - get event
   */
  @TypedRoute.Get(':id')
  async getEvent(
    @TypedParam('id') id: string,
  ): Promise<SingleRecordResponse<EventDto.Root>> {
    return this.eventService
      .getEvent(id)
      .then((response) =>
        ResponseWrap.single(
          EventDto.createFromEntity(
            response,
            this.config.get<string>('FRONTEND_URL') + response.id,
          ),
        ),
      );
  }
}
