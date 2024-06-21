import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '@/event/entity/guest.entity';
import { EventModule } from '@/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Guest]),
    EventModule,
  ],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
