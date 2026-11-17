import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface FilmRepository {
  getFilms(): Promise<FilmDto[]>;
  getFilm(filmId: string): Promise<FilmDto | null>;
  getSchedule(filmId: string): Promise<ScheduleDto[] | null>;
  saveTaken(filmId: string, sessionId: string, taken: string[]): Promise<void>;
}

const parseTags = (tags: string): string[] =>
  tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

const parseTaken = (taken: string): string[] =>
  taken
    .split(',')
    .map((seat) => seat.trim())
    .filter(Boolean);

const joinTaken = (taken: string[]): string => taken.join(',');

const mapSchedule = (schedule: Schedule): ScheduleDto => ({
  id: schedule.id,
  daytime: schedule.daytime,
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: parseTaken(schedule.taken),
});

const mapFilm = (film: Film): FilmDto => ({
  id: film.id,
  rating: film.rating,
  director: film.director,
  tags: parseTags(film.tags),
  image: film.image,
  cover: film.cover,
  title: film.title,
  about: film.about,
  description: film.description,
  schedule: film.schedule?.map(mapSchedule),
});

@Injectable()
export class PostgresFilmRepository implements FilmRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async getFilms(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({ relations: ['schedule'] });
    return films.map(mapFilm);
  }

  async getFilm(filmId: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedule'],
    });
    return film ? mapFilm(film) : null;
  }

  async getSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmRepository.findOne({
      where: { id: filmId },
      relations: ['schedule'],
    });
    return film ? film.schedule.map(mapSchedule) : null;
  }

  async saveTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.scheduleRepository.update(
      { id: sessionId, filmId },
      { taken: joinTaken(taken) },
    );
  }
}
