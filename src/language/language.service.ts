import { ConflictException, Injectable } from '@nestjs/common';
import { LanguageDto } from './dto/language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entity/language.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
  ) {}

  async create(body: LanguageDto.CreateLanguage) {
    let existingLnaguage = await this.languageRepository.findOne({
      where: [{ code: body.code.toLowerCase() }],
    });

    if (existingLnaguage)
      throw new ConflictException('Language code already exist!');

    existingLnaguage = await this.languageRepository.findOne({
      where: [{ name: body.name.toLowerCase() }],
    });

    if (existingLnaguage)
      throw new ConflictException('Language name already exist!');

    return this.languageRepository.save({
      code: body.code.toLowerCase(),
      name: body.name.toLowerCase(),
    });
  }

  async get(): Promise<Language[]> {
    return this.languageRepository.find();
  }
}
