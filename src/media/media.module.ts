import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { ConfigModule } from '@nestjs/config';
import { MediaProviderFactory } from '@/common/factory/media.provider.factory';
import { CloudinaryProvider } from '@/common/utils/cloudinary/cloudinary.util';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MediaService, CloudinaryProvider, MediaProviderFactory],
  exports: [MediaService],
})
export class MediaModule {}
