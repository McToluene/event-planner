import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

@Injectable()
export class CloudinaryConnection {
  private readonly logger = new Logger(CloudinaryConnection.name);

  constructor(private config: ConfigService) {
    this.logger.debug('Cloudinary setup...');
    v2.config({
      cloud_name: this.config.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.get<string>('CLOUDINARY_API_SECRET'),
    });
  }
}
