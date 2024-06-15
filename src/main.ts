import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FormatAbstractErrorInterceptor } from './interceptor/format.abstract.error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new FormatAbstractErrorInterceptor());
  await app.listen(3000);
}
bootstrap();
