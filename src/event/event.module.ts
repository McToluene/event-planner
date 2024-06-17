import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entity/event.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([Event])],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
