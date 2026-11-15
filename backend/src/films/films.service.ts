import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FilmRepository } from '../repository/film.repository';
import { FilmRepositoryToken } from '../repository/film.repository.provider';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FilmRepositoryToken)
    private readonly filmRepository: FilmRepository,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    return this.filmRepository.getFilms();
  }

  async getSchedule(filmId: string): Promise<ScheduleDto[]> {
    const schedule = await this.filmRepository.getSchedule(filmId);
    if (schedule === null) {
      throw new NotFoundException('Фильм не найден');
    }
    return schedule;
  }

  async getFilm(filmId: string): Promise<FilmDto> {
    const film = await this.filmRepository.getFilm(filmId);
    if (film === null) {
      throw new NotFoundException('Фильм не найден');
    }
    return film;
  }
}
