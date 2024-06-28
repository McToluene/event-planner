import { Module } from '@nestjs/common';
import { LanguageService } from './language.service';
import { LanguageController } from './language.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entity/language.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Language]),
    HttpModule,
  ],
  providers: [LanguageService],
  exports: [LanguageService],
  controllers: [LanguageController],
})
export class LanguageModule {}
