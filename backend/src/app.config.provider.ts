import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  useFactory: (): AppConfig => {
    return {
      port: Number(process.env.PORT ?? 3000),
      database: {
        driver: process.env.DATABASE_DRIVER ?? 'postgres',
        url: process.env.DATABASE_URL ?? 'postgres://localhost:5432/films',
        username: process.env.DATABASE_USERNAME ?? '',
        password: process.env.DATABASE_PASSWORD ?? '',
      },
    };
  },
  inject: [],
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [configProvider],
  exports: [configProvider],
})
export class AppConfigModule {}
