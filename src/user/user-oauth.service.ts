import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOauth } from './entities/user-oauth.entity';

@Injectable()
export class UserOauthService {
  constructor(
    @InjectRepository(UserOauth)
    private userOauthRepository: Repository<UserOauth>,
  ) {}

  async create(createRequest: UserOauth): Promise<UserOauth> {
    return this.userOauthRepository.save(createRequest);
  }

  async findByProviderUserId(
    providerUserId: string,
  ): Promise<UserOauth | null> {
    return this.userOauthRepository.findOne({
      where: { providerUserId: providerUserId },
    });
  }

  async getUserOauths(userId: string): Promise<UserOauth[]> {
    return this.userOauthRepository.find({
      where: { userId: userId },
    });
  }
}
