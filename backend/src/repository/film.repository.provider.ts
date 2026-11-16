import { Provider } from '@nestjs/common';
import { MongoFilmRepository } from './film.repository';

export const FilmRepositoryToken = 'FilmRepository';

export const FilmRepositoryProvider: Provider = {
  provide: FilmRepositoryToken,
  useClass: MongoFilmRepository,
};
