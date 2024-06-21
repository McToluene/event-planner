import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';
import { MediaModule } from '@/media/media.module';
import { Itinerary } from './entity/itinerary.entity';
import { Guest } from './entity/guest.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Event, Itinerary, Guest]),
    MediaModule,
  ],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
