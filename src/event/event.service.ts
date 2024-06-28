import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import { User } from '@/user/entity/user.entity';
import { MediaService } from '@/media/media.service';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { EventDto } from './dto/event.dto';
import { Itinerary } from './entity/itinerary.entity';
import { ItineraryDto } from './dto/itinerary.dto';
import { EventLike } from './entity/event-like.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private mediaService: MediaService,
    @InjectRepository(EventLike)
    private eventLikeRepository: Repository<EventLike>,
  ) {}

  async create(
    user: User,
    event: EventDto.CreateEvent,
    files: Express.Multer.File[],
  ): Promise<Event> {
    const existingEvent = await this.findByNameAndUser(user, event.name);
    if (existingEvent != null)
      throw new ConflictException(
        `Event with name: '${event.name}' already exist`,
      );

    const responses = await Promise.all(
      files.map((file) =>
        this.mediaService.upload(
          MediaProviderEnum.CLOUDINARY,
          file.buffer,
          ImageType.EVENT,
        ),
      ),
    );

    const urls = responses
      .filter(
        (response): response is { url: string; publicId: string } =>
          response !== null,
      )
      .map((response) => response.url);

    let entity = new EventDto.Root(event).getEntity();
    entity.mediaUrls = urls;
    entity.user = user;

    await this.eventRepository.manager.transaction(async (entityManager) => {
      entity = await entityManager.save(Event, entity);
      const itineraries = entity.itineraries.map((it) => {
        const itinerary = new ItineraryDto.Root(it).getEntity();
        itinerary.event = entity;
        return itinerary;
      });
      entity.itineraries = await entityManager.save(Itinerary, itineraries);
    });
    return entity;
  }

  async findByNameAndUser(user: User, name: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: [{ name, user }],
    });
  }

  async findByIdAndUser(id: string, user: User): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: [{ id, user }],
    });
  }

  async getEvents(user: User): Promise<Event[]> {
    return this.eventRepository.find({
      where: [{ user }],
      relations: [
        'itineraries',
        'user',
        'guests',
        'guests.user',
        'posts',
        'posts.user',
        'likes',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: [
        'itineraries',
        'user',
        'guests',
        'guests.user',
        'posts',
        'posts.user',
        'likes',
      ],
    });

    if (!event) throw new NotFoundException(`Event with id: '${id}' not found`);
    return event;
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: [{ id }],
      relations: [
        'itineraries',
        'user',
        'guests',
        'guests.user',
        'posts',
        'posts.user',
        'likes',
      ],
    });

    if (!event) throw new NotFoundException(`Event with id: '${id}' not found`);
    return event;
  }

  async likeEvent(user: User, eventId: string): Promise<EventLike> {
    const event = await this.eventRepository.findOne({
      where: [{ id: eventId }],
    });
    if (!event) throw new NotFoundException('Event not found!');

    const existingLike = await this.eventLikeRepository.findOne({
      where: [{ user, event }],
    });

    if (existingLike) throw new ConflictException('Event already liked!');
    return this.eventLikeRepository.save({ user, event });
  }

  async unlikeEvent(user: User, eventId: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: [{ id: eventId }],
    });

    if (!event) throw new NotFoundException('Event not found!');
    await this.eventLikeRepository.delete({ user, event });
  }
}
