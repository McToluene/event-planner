import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(user: User, event: Event): Promise<Event> {
    const existingEvent = await this.findByNameAndUser(user, event.name);
    if (existingEvent != null)
      throw new ConflictException(
        `Event with name: ${event.name} already exist`,
      );
    return this.eventRepository.save(event);
  }

  async findByNameAndUser(user: User, name: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: [{ name, user }],
    });
  }
}
