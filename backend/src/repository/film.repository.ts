import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface FilmRepository {
  getFilms(): Promise<FilmDto[]>;
  getFilm(filmId: string): Promise<FilmDto | null>;
  getSchedule(filmId: string): Promise<ScheduleDto[] | null>;
  saveTaken(filmId: string, sessionId: string, taken: string[]): Promise<void>;
}

const mapFilm = (film: Film): FilmDto => ({
  id: film.id,
  rating: film.rating,
  director: film.director,
  tags: film.tags,
  image: film.image,
  cover: film.cover,
  title: film.title,
  about: film.about,
  description: film.description,
  ...(film.schedule ? { schedule: film.schedule.map(mapSchedule) } : {}),
});

const mapSchedule = (schedule: ScheduleDto): ScheduleDto => ({
  id: schedule.id,
  daytime: schedule.daytime,
  hall: schedule.hall,
  rows: schedule.rows,
  seats: schedule.seats,
  price: schedule.price,
  taken: schedule.taken,
});

@Injectable()
export class MongoFilmRepository implements FilmRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async getFilms(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().select('-__v').lean().exec();
    return films.map(mapFilm);
  }

  async getFilm(filmId: string): Promise<FilmDto | null> {
    const film = await this.filmModel
      .findOne({ id: filmId })
      .select('-__v')
      .lean()
      .exec();
    return film ? mapFilm(film) : null;
  }

  async getSchedule(filmId: string): Promise<ScheduleDto[] | null> {
    const film = await this.filmModel
      .findOne({ id: filmId })
      .select('-__v')
      .lean()
      .exec();
    return film ? (film.schedule ?? []).map(mapSchedule) : null;
  }

  async saveTaken(
    filmId: string,
    sessionId: string,
    taken: string[],
  ): Promise<void> {
    await this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $set: { 'schedule.$.taken': taken } },
      )
      .exec();
  }
}
