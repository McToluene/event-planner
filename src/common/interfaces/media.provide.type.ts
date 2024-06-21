import { ImageType } from '../enum/image.type.enum';

export interface IMediaProvider {
  uploadFile(
    file: Express.Multer.File,
    type: ImageType,
  ): Promise<{ url: string; publicId: string } | null>;
}

export enum MediaProviderEnum {
  CLOUDINARY = 'CLOUDINARY',
}
