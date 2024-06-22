import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Post } from './entity/post.entity';
import { EventModule } from '@/event/event.module';
import { MediaModule } from '@/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Post]),
    EventModule,
    MediaModule,
  ],
  providers: [PostService],
  controllers: [PostController],
})
export class PostModule {}