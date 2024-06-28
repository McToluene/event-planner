import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LanguageDto } from './dto/language.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entity/language.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User } from '@/user/entity/user.entity';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(Language)
    private languageRepository: Repository<Language>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
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

  async getById(id: string): Promise<Language> {
    const language = await this.languageRepository.findOne({ where: [{ id }] });
    if (language === null) throw new NotFoundException('Language not found');
    return language;
  }

  async translate(user: User, text: string): Promise<string> {
    if (!user.language) throw new NotFoundException('');

    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const prompt = `Translate the following text to ${user?.language.name}: "${text}"`;
    const response = await firstValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt,
          max_tokens: 100,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        },
      ),
    );

    const translatedText = response.data.choices[0].text.trim();
    return translatedText;
  }
}
