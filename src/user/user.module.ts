import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserOauthService } from './user-oauth.service';
import { UserOauth } from './entity/user-oauth.entity';
import { UserController } from './user.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, UserOauth]),
  ],
  providers: [UserService, UserOauthService],
  exports: [UserService, UserOauthService],
  controllers: [UserController],
})
export class UserModule {}
