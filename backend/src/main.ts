import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from './app.config.provider';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(CONFIG);
  app.setGlobalPrefix('api/afisha');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(config.port);
}
bootstrap();
