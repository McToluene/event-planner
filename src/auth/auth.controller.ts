import {
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/common/constants';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from '@/user/entity/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * Register a new user.
   *
   * @tag auth
   */
  @TypedRoute.Post('register')
  async register(
    @TypedBody() registerRequest: AuthDto.RegisterRequest,
  ): Promise<SingleRecordResponse<AuthDto.AuthResponse>> {
    return this.authService
      .register(registerRequest)
      .then((authResponse) => ResponseWrap.single(authResponse));
  }

  /**
   * Login to the system using email and password.
   * @tag auth
   * @operationId login
   * @param {AuthDto.LoginRequest} body - create listing request
   *
   * @returns {Promise<SingleRecordResponse<AuthDto.AuthResponse>>} - auth
   */
  @UseGuards(AuthGuard(STRATEGY_NAMES.LOCAL))
  @TypedRoute.Post('login')
  async login(
    @CurrentUser() user: User,
  ): Promise<SingleRecordResponse<AuthDto.AuthResponse>> {
    return this.authService
      .login(user)
      .then((authResponse) => ResponseWrap.single(authResponse));
  }

  /**
   * Login to the system using google.
   *
   * @tag auth
   */
  @UseGuards(AuthGuard(STRATEGY_NAMES.GOOGLE))
  @TypedRoute.Get('google')
  async googleLogin(): Promise<void> {
    // The gard will initiate the google login flow
  }

  /**
   * google login callback.
   *
   * @tag auth
   */
  @UseGuards(AuthGuard(STRATEGY_NAMES.GOOGLE))
  @TypedRoute.Get('google/callback')
  async googleLoginCallback(@CurrentUser() user: User): Promise<any> {
    return this.authService.login(user);
  }

  /**
   * Login to the system using facebook.
   *
   * @tag auth
   */
  @UseGuards(AuthGuard(STRATEGY_NAMES.FACEBOOK))
  @TypedRoute.Get('facebook')
  async facebookLogin(): Promise<void> {
    // The gard will initiate the facebook login flow
  }

  /**
   * facebook login callback.
   *
   * @tag auth
   */
  @UseGuards(AuthGuard(STRATEGY_NAMES.FACEBOOK))
  @TypedRoute.Get('facebook/callback')
  async facebookLoginCallback(@CurrentUser() user: User): Promise<any> {
    return this.authService.login(user);
  }
}
