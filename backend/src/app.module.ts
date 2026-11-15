import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'node:path';

import { AppConfigModule, CONFIG } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRootAsync({
      inject: [CONFIG],
      useFactory: (config) => ({
        uri: config.database.url,
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
