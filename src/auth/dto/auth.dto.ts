import { AbstractDto } from '@/common/dto/abstract/abstract.dto';
import { User } from '@/user/entity/user.entity';

export namespace AuthDto {
  export class Root extends AbstractDto {
    fullName: string;
    email: string;
    phoneNumber: string;

    getEntity() {
      const entity = new User();
      entity.fullName = this.fullName;
      entity.email = this.email;
      entity.phoneNumber = this.phoneNumber;
      return entity;
    }
  }

  export type RegisterRequest = Pick<
    Root,
    'fullName' | 'email' | 'phoneNumber'
  > & {
    password: string;
  };

  export type LoginRequest = {
    username: string;
    password: string;
  };

  export type AuthResponse = {
    accessToken: string;
  };
}
