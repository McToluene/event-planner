import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { MediaService } from '@/media/media.service';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { EventDto } from './dto/event.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private mediaService: MediaService,
  ) {}

  async create(user: User, event: EventDto.CreateEvent): Promise<Event> {
    const existingEvent = await this.findByNameAndUser(user, event.name);
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

    if (existingEvent != null)
      throw new ConflictException(
        `Event with name: ${event.name} already exist`,
      );

    const entity = new EventDto.Root(event).getEntity();
    entity.mediaUrls = urls;

    return this.eventRepository.save(entity);
  }

  async findByNameAndUser(user: User, name: string): Promise<Event | null> {
    return this.eventRepository.findOne({
      where: [{ name, user }],
    });
  }
}
