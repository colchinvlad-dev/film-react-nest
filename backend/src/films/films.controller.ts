import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getFilms(): Promise<{ total: number; items: FilmDto[] }> {
    const items = await this.filmsService.getFilms();
    return { total: items.length, items };
  }

  @Get(':id/schedule')
  async getSchedule(
    @Param('id') id: string,
  ): Promise<{ total: number; items: ScheduleDto[] }> {
    const items = await this.filmsService.getSchedule(id);
    return { total: items.length, items };
  }
}
