import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: { getFilms: jest.Mock; getSchedule: jest.Mock };

  const film: FilmDto = {
    id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
    rating: 2.9,
    director: 'Итан Райт',
    tags: ['Документальный'],
    image: '/bg1s.jpg',
    cover: '/bg1c.jpg',
    title: 'Архитекторы общества',
    about: 'Документальный фильм',
    description: 'Описание фильма',
  };

  const schedule: ScheduleDto = {
    id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
    daytime: '2024-06-28T10:00:53+03:00',
    hall: 0,
    rows: 5,
    seats: 10,
    price: 350,
    taken: [],
  };

  beforeEach(async () => {
    service = {
      getFilms: jest.fn(),
      getSchedule: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: service }],
    }).compile();

    controller = moduleRef.get<FilmsController>(FilmsController);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms', () => {
    it('должен вернуть total равный количеству фильмов и сами предметы', async () => {
      service.getFilms.mockResolvedValue([film]);
      const result = await controller.getFilms();
      expect(result).toEqual({ total: 1, items: [film] });
      expect(service.getFilms).toHaveBeenCalledTimes(1);
    });

    it('должен вернуть пустой список, если фильмов нет', async () => {
      service.getFilms.mockResolvedValue([]);
      const result = await controller.getFilms();
      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('getSchedule', () => {
    it('должен вернуть total и предметы расписания для выбранного фильма', async () => {
      service.getSchedule.mockResolvedValue([schedule]);
      const result = await controller.getSchedule(film.id);
      expect(result).toEqual({ total: 1, items: [schedule] });
      expect(service.getSchedule).toHaveBeenCalledWith(film.id);
    });

    it('должен вернуть пустое расписание, если сеансов нет', async () => {
      service.getSchedule.mockResolvedValue([]);
      const result = await controller.getSchedule(film.id);
      expect(result).toEqual({ total: 0, items: [] });
    });

    it('должен пробросить NotFoundException, если фильм не найден', async () => {
      service.getSchedule.mockRejectedValue(
        new NotFoundException('Фильм не найден'),
      );
      await expect(controller.getSchedule('несуществующий-id')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.getSchedule).toHaveBeenCalledWith('несуществующий-id');
    });
  });
});
