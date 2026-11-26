import {
  ValidationPipe,
  LoggerService,
  INestApplication,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from './app.config.provider';
import { DevLogger } from './logger/dev.logger';
import { JsonLogger } from './logger/json.logger';
import { TskvLogger } from './logger/tskv.logger';

function resolveLogger(app: INestApplication): LoggerService {
  const format = process.env.LOG_FORMAT ?? 'dev';

  switch (format) {
    case 'json':
      return app.get(JsonLogger);
    case 'tskv':
      return app.get(TskvLogger);
    case 'dev':
    default:
      return app.get(DevLogger);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(resolveLogger(app));
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
