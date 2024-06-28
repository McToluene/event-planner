import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { MediaService } from '@/media/media.service';
import { MediaProviderEnum } from '@/common/interfaces/media.provide.type';
import { ImageType } from '@/common/enum/image.type.enum';
import { UserDto } from './dto/user.dto';
import { LanguageService } from '@/language/language.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mediaService: MediaService,
    private languageService: LanguageService,
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['language'],
    });
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

  async addAvatar(user: User, file: File): Promise<User> {
    const arrayBuffer = await file.arrayBuffer();
    const response = await this.mediaService.upload(
      MediaProviderEnum.CLOUDINARY,
      Buffer.from(arrayBuffer),
      ImageType.USER,
    );

    user.avatar = response?.url;
    return await this.userRepository.save(user);
  }

  async updateProfile(user: User, body: UserDto.Profile): Promise<User> {
    const language = await this.languageService.getById(body.languageId);
    user.language = language;
    user.fullName = body.fullName;
    user.phoneNumber = body.phoneNumber;
    return this.update(user);
  }
}
