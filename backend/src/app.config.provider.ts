import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useFactory: (): AppConfig => {
    return {
      port: Number(process.env.PORT ?? 3000),
      database: {
        driver: process.env.DATABASE_DRIVER ?? 'mongodb',
        url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/prac',
      },
    };
  },
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [configProvider],
  exports: [configProvider],
})
export class AppConfigModule {}
