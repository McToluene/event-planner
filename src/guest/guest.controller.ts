import { STRATEGY_NAMES } from '@/common/constants';
import {
  ManyRecordsResponse,
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';

import { TypedParam, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuestService } from './guest.service';
import { GuestDto } from '@/event/dto/guest.dto';
import { EventDto } from '@/event/dto/event.dto';
import { ConfigService } from '@nestjs/config';
import { EventHostGuard } from '@/common/guard/host.guard';
import { AllowHosts } from '@/common/decorator/allow-host.decorator';

@Controller('event/:eventId/guest')
export class GuestController {
  constructor(
    private readonly guestService: GuestService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Attend event.
   * @tag guest
   * @operationId attendEvent
   * @param eventId The id of the event.
   *
   * @returns {Promise<SingleRecordResponse<EventDto.Root>>} - Attend event
   */
  @TypedRoute.Post('attend')
  @UseGuards(EventHostGuard)
  @AllowHosts(false)
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async attendEvent(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
  ): Promise<SingleRecordResponse<EventDto.Root>> {
    return this.guestService
      .attendEvent(req.user, eventId)
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
   * Guests event.
   * @tag guest
   * @operationId guests
   * @param eventId The id of the event.
   *
   * @returns {Promise<ManyRecordsResponse<GuestDto.Root>>} - event guests
   */
  @TypedRoute.Get()
  @UseGuards(EventHostGuard)
  @AllowHosts(true)
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async guests(
    @Request() req: any,
    @TypedParam('eventId') eventId: string,
  ): Promise<ManyRecordsResponse<GuestDto.Root>> {
    return this.guestService
      .guests(req.user, eventId)
      .then((guest) =>
        ResponseWrap.many(guest.map((ev) => GuestDto.createFromEntity(ev))),
      );
  }

  /**
   * Chage event guest block status.
   * @tag guest
   * @operationId changeGuestBlockStatus
   * @param eventId The id of the event.
   * @param id The id of the guest.
   * @param isBlocked The block status.
   *
   * @returns {Promise<SingleRecordResponse<GuestDto.Root>>} - event guest
   */
  @TypedRoute.Patch(':id/:isBlocked')
  @UseGuards(EventHostGuard)
  @AllowHosts(true)
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async changeGuestBlockStatus(
    @TypedParam('eventId') eventId: string,
    @TypedParam('id') id: string,
    @TypedParam('isBlocked') isBlocked: boolean,
  ): Promise<SingleRecordResponse<GuestDto.Root>> {
    return this.guestService
      .changeGuestBlockStatus(id, isBlocked)
      .then((guest) => ResponseWrap.single(GuestDto.createFromEntity(guest)));
  }
}
