import { ImageType } from '@/common/enum/image.type.enum';
import { MediaProviderFactory } from '@/common/factory/media.provider.factory';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  constructor(private providerFactory: MediaProviderFactory) {}

  async upload(
    provider: MediaProviderEnum,
    file: File,
    imageType: ImageType,
  ): Promise<{ url: string; publicId: string } | null> {
    const mediaProvider = this.providerFactory.getDriveProvider(provider);
    return mediaProvider.uploadFile(file, imageType);
  }
}
