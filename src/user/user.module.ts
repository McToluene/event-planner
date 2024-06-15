import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserOauthService } from './user-oauth.service';
import { UserOauth } from './entities/user-oauth.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserOauth]),
  ],
  providers: [UserService, UserOauthService],
  exports: [UserService, UserOauthService],
})
export class UserModule {}
