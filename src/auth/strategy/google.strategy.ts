import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

import { IGoogleUser } from '../interfaces/provider.interface';
import { ConfigService } from '@nestjs/config';
import { UserOauthService } from '@/user/user-oauth.service';
import { AuthService } from '../auth.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly userOauthService: UserOauthService,
    private readonly userService: UserService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const userOauth = await this.userOauthService.findByProviderUserId(
        profile.id,
      );

      if (userOauth) {
        const user = await this.userService.findById(userOauth.userId);
        if (!user) throw new NotFoundException('User not found');
        return done(null, user);
      }

      const googleUser: IGoogleUser = {
        sub: profile._json.sub,
        name: profile._json.name,
        email: profile._json.email,
        given_name: profile._json.given_name,
        family_name: profile._json.family_name,
        picture: profile._json.picture,
        email_verified: profile._json.email_verified,
        locale: profile._json.locale,
      };

      const user = await this.authService.validateGoogleOAuthLogin(
        googleUser,
        accessToken,
        refreshToken,
      );

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
