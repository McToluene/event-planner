import { Guest } from '@/event/entity/guest.entity';
import { EventService } from '@/event/event.service';
import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '@/event/entity/event.entity';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    private eventService: EventService,
  ) {}

  async attendEvent(user: any, id: string): Promise<Event> {
    const event = await this.eventService.getEvent(id);
    if (event.user === user)
      throw new NotAcceptableException("You're the event host");

    const isAlreadyGuest = event.guests.filter((guest) => guest.user === user);
    if (isAlreadyGuest.length > 0)
      throw new ConflictException("You're already a guest");

    const guest = await this.guestRepository.save({
      event,
      user,
      isBlocked: false,
    });
    event.guests.push(guest);
    return event;
  }

  async guests(user: any, id: string): Promise<Guest[]> {
    const event = await this.eventService.getEvent(id);
    return event.guests;
  }

  async changeGuestBlockStatus(id: string, isBlocked: boolean): Promise<Guest> {
    const guest = await this.guestRepository.findOne({
      where: [{ id }],
      relations: ['user'],
    });
    if (guest === null) throw new NotFoundException('Guest not found!');
    guest.isBlocked = isBlocked;
    return this.guestRepository.save(guest);
  }
}
