import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { AppConfigModule, CONFIG } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { Film } from './films/entities/film.entity';
import { Schedule } from './films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRootAsync({
      inject: [CONFIG],
      useFactory: (config) => ({
        type: 'postgres',
        url: config.database.url,
        username: config.database.username,
        password: config.database.password,
        entities: [Film, Schedule],
        synchronize: false,
      }),
    }),
    FilmsModule,
    OrderModule,
    AppConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
