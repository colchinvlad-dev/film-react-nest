import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { FilmRepository } from '../repository/film.repository';
import { FilmRepositoryToken } from '../repository/film.repository.provider';
import { ScheduleDto } from '../films/dto/films.dto';
import { OrderDto, OrderResultDto } from './dto/order.dto';

const ticketKey = (row: number, seat: number) => `${row}:${seat}`;

@Injectable()
export class OrderService {
  constructor(
    @Inject(FilmRepositoryToken)
    private readonly filmRepository: FilmRepository,
  ) {}

  async createOrder(order: OrderDto): Promise<OrderResultDto[]> {
    const results: OrderResultDto[] = [];

    for (const ticket of order.tickets) {
      const film = await this.filmRepository.getFilm(ticket.film);
      if (film === null) {
        throw new NotFoundException('Фильм не найден');
      }

      const schedule: ScheduleDto | undefined = film.schedule?.find(
        (item) => item.id === ticket.session,
      );
      if (!schedule) {
        throw new NotFoundException('Сеанс не найден');
      }

      const key = ticketKey(ticket.row, ticket.seat);
      if (schedule.taken.includes(key)) {
        throw new BadRequestException(`Место ${key} уже занято`);
      }

      const updated = [...schedule.taken, key];
      await this.filmRepository.saveTaken(ticket.film, schedule.id, updated);

      results.push({
        id: randomUUID(),
        film: ticket.film,
        session: schedule.id,
        daytime: schedule.daytime,
        row: ticket.row,
        seat: ticket.seat,
        price: schedule.price,
      });
    }

    return results;
  }
}
