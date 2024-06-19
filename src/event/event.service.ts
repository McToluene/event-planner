import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { MediaService } from '@/media/media.service';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { EventDto } from './dto/event.dto';
import { Itinerary } from './entity/itinerary.entity';
import { ItineraryDto } from './dto/itinerary.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Itinerary)
    private itenaryRepository: Repository<Itinerary>,
    private mediaService: MediaService,
  ) {}

  async create(user: User, event: EventDto.CreateEvent): Promise<Event> {
    const existingEvent = await this.findByNameAndUser(user, event.name);
    if (existingEvent != null)
      throw new ConflictException(
        `Event with name: '${event.name}' already exist`,
      );

    const responses = await Promise.all(
      event.files.map((file) =>
        this.mediaService.upload(
          MediaProviderEnum.CLOUDINARY,
          file,
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
      entity = await entityManager.save(entity);
      if (entity) {
        const itineraries = entity.itineraries.map((it) =>
          new ItineraryDto.Root(it).getEntity(),
        );
        await this.itenaryRepository.save(itineraries);
      }
    });
    return entity;
  }

  async findByNameAndUser(user: User, name: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: [{ name, user }],
    });
  }

  async getEvents(user: User): Promise<Event[]> {
    return this.eventRepository.find({
      where: [{ user }],
    });
  }
}
