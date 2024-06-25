import { Controller, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { AuthGuard } from '@nestjs/passport';
import { STRATEGY_NAMES } from '@/common/constants';
import { TypedBody, TypedRoute } from '@nestia/core';
import { LanguageDto } from './dto/language.dto';
import {
  ManyRecordsResponse,
  ResponseWrap,
  SingleRecordResponse,
} from '@/common/dto/abstract/response.abstract';

@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Post a language.
   * @tag language
   * @operationId addLanguage
   *
   * @returns {Promise<SingleRecordResponse<LanguageDto.Root>>} - created language
   */
  @TypedRoute.Post()
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async addLanguage(
    @TypedBody() body: LanguageDto.CreateLanguage,
  ): Promise<SingleRecordResponse<LanguageDto.Root>> {
    return this.languageService
      .create(body)
      .then((response) =>
        ResponseWrap.single(LanguageDto.createFromEntity(response)),
      );
  }

  /**
   * Get languagse.
   * @tag language
   * @operationId getLanguages
   *
   * @returns {Promise<ManyRecordsResponse<LanguageDto.Root>>} - created languages
   */
  @TypedRoute.Get()
  async getLanguages(): Promise<ManyRecordsResponse<LanguageDto.Root>> {
    return this.languageService
      .get()
      .then((languages) =>
        ResponseWrap.many(
          languages.map((l) => LanguageDto.createFromEntity(l)),
        ),
      );
  }
}
