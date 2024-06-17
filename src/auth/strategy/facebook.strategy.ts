import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { IFacebookUser } from '../interfaces/provider.interface';
import { ConfigService } from '@nestjs/config';
import { STRATEGY_NAMES } from '@/common/constants';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  Strategy,
  STRATEGY_NAMES.FACEBOOK,
) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get<string>('FACEBOOK_CLIENT_SECRET'),
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL'),
      passReqToCallback: true,
      scope: 'email',
      profileFields: ['emails', 'name'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    try {
      const facebookUser: IFacebookUser = {
        id: profile._json.id,
        name: profile._json.first_name + ' ' + profile._json.last_name,
        email: profile._json.email,
      };
      const user = await this.authService.validateFacebookOAuthLogin(
        facebookUser,
        accessToken,
        refreshToken,
      );
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
