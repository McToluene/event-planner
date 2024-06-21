import { SetMetadata } from '@nestjs/common';

export const AllowHosts = (isHost: boolean) => SetMetadata('isHost', isHost);
