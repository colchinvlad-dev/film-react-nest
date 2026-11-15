import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmRepositoryProvider } from '../repository/film.repository.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmRepositoryProvider],
  exports: [FilmsService, FilmRepositoryProvider],
})
export class FilmsModule {}
