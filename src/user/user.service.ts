import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email: email });
  }

  async findByEmailOrPhoneNumber(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ email: username }, { phoneNumber: username }],
    });
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
