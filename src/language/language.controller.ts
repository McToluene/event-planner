import { Controller, UseGuards, Request } from '@nestjs/common';
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
   * Get languages.
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

  /**
   * Transalate text.
   * @tag language
   * @operationId translateText
   *
   * @returns {Promise<SingleRecordResponse<string>>} - translated text
   */
  @TypedRoute.Post('translate')
  @UseGuards(AuthGuard(STRATEGY_NAMES.JWT))
  async translateText(
    @Request() req: any,
    @TypedBody() body: LanguageDto.Translate,
  ): Promise<SingleRecordResponse<string>> {
    return this.languageService
      .translate(req.user, body.text)
      .then((response) => ResponseWrap.single(response));
  }
}
