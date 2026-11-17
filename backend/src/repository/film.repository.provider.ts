import { Provider } from '@nestjs/common';
import { PostgresFilmRepository } from './film.repository';

export const FilmRepositoryToken = 'FilmServiceRepository';

export const FilmRepositoryProvider: Provider = {
  provide: FilmRepositoryToken,
  useClass: PostgresFilmRepository,
};
