import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EventService } from '@/event/event.service';

@Injectable()
export class EventHostGuard implements CanActivate {
  constructor(
    private readonly eventService: EventService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const eventId = request.params.eventId;
    const isHost = this.reflector.get<boolean>('isHost', context.getHandler());

    const event = await this.eventService.findByIdAndUser(
      eventId,
      request.user,
    );

    if (isHost) return !!event;
    else return !event;
  }
}
