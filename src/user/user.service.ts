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
    const newUser = await this.userRepository.save(user);
    return newUser;
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: email });
    return user;
  }

  async findByEmailOrPhoneNumber(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: [{ email: username }, { phoneNumber: username }],
    });
    return user;
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.userRepository.save(user);
    return updatedUser;
  }
}
