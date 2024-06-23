import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '@/user/user.service';
import { HashHelper } from '@/common/helper/hash.helper';
import { JwtService } from '@nestjs/jwt';
import { IFacebookUser, IGoogleUser } from './interfaces/provider.interface';
import { User } from '@/user/entity/user.entity';
import { OAuthProvidersEnum, UserOauth } from '@/user/entity/user-oauth.entity';
import { UserOauthService } from '@/user/user-oauth.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private userOauthService: UserOauthService,
  ) {}

  async register(
    registerRequest: AuthDto.RegisterRequest,
  ): Promise<AuthDto.AuthResponse> {
    const existingUser = await this.userService.getByEmail(
      registerRequest.email,
    );

    if (existingUser) throw new ConflictException('Email already exists');

    const user = new AuthDto.Root(registerRequest).getEntity();
    user.passwordHash = await HashHelper.hash(registerRequest.password);
    const newUser = await this.userService.create(user);
    return this.login(newUser);
  }

  async login(user: any): Promise<AuthDto.AuthResponse> {
    return {
      accessToken: await this.generateAccessToken({
        email: user.email,
        sub: user.id,
      }),
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByEmailOrPhoneNumber(username);
    if (!user || !(await HashHelper.compare(password, user.passwordHash)))
      throw new UnauthorizedException();
    return user;
  }

  async validateFacebookOAuthLogin(
    facebookUser: IFacebookUser,
    accessToken: string,
    refreshToken: string,
  ): Promise<User> {
    const { id, name, email } = facebookUser;

    let user = await this.findUserByOauthProviderId(id);
    if (user) return user;

    user = await this.userService.getByEmail(email);
    if (user) {
      if (!user.oauthEnabled)
        await this.linkUserWithOAuth(
          user,
          id,
          accessToken,
          refreshToken,
          OAuthProvidersEnum.FACEBOOK,
        );
      return user;
    }

    return await this.createUserWithOAuth(
      email,
      name,
      id,
      accessToken,
      refreshToken,
      OAuthProvidersEnum.FACEBOOK,
    );
  }

  async validateGoogleOAuthLogin(
    googleUser: IGoogleUser,
    accessToken: string,
    refreshToken: string,
  ): Promise<User> {
    const { sub, name, email } = googleUser;

    let user = await this.findUserByOauthProviderId(sub);
    if (user) return user;

    user = await this.userService.getByEmail(email ?? '');
    if (user) {
      if (!user.oauthEnabled)
        await this.linkUserWithOAuth(
          user,
          sub,
          accessToken,
          refreshToken,
          OAuthProvidersEnum.GOOGLE,
        );
      return user;
    }

    return await this.createUserWithOAuth(
      email ?? '',
      name ?? '',
      sub,
      accessToken,
      refreshToken,
      OAuthProvidersEnum.GOOGLE,
    );
  }

  private async findUserByOauthProviderId(
    providerUserId: string,
  ): Promise<User | null> {
    const existingUserOauth =
      await this.userOauthService.findByProviderUserId(providerUserId);
    if (existingUserOauth) {
      const user = await this.userService.findById(existingUserOauth.userId);
      if (!user) throw new NotFoundException('User not found');
      return user;
    }
    return null;
  }

  private async linkUserWithOAuth(
    user: User,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
    provider: OAuthProvidersEnum,
  ): Promise<void> {
    const userOauth = this.createOauthUser(
      user,
      providerUserId,
      accessToken,
      refreshToken,
      provider,
    );

    await this.userOauthService.create(userOauth);
    user.oauthEnabled = true;
    await this.userService.update(user);
  }

  private async createUserWithOAuth(
    email: string,
    name: string,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
    provider: OAuthProvidersEnum,
  ): Promise<User> {
    const user = new User();
    user.email = email;
    user.emailVerified = true;
    user.fullName = name;
    user.active = true;
    user.oauthEnabled = true;
    const newUser = await this.userService.create(user);

    const userOauth = this.createOauthUser(
      newUser,
      providerUserId,
      accessToken,
      refreshToken,
      provider,
    );
    await this.userOauthService.create(userOauth);
    return newUser;
  }

  private createOauthUser(
    newUser: User,
    providerUserId: string,
    accessToken: string,
    refreshToken: string,
    provider: OAuthProvidersEnum,
  ) {
    const userOauth = new UserOauth();
    userOauth.userId = newUser.id;
    userOauth.oauthProvider = provider;
    userOauth.providerUserId = providerUserId;
    userOauth.accessToken = accessToken;
    userOauth.refreshToken = refreshToken;
    userOauth.user = newUser;
    return userOauth;
  }

  private async generateAccessToken(payload): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
