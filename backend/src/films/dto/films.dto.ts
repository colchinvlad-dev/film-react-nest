import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ScheduleDto {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  daytime!: string;

  @IsInt()
  hall!: number;

  @IsInt()
  @Min(1)
  rows!: number;

  @IsInt()
  @Min(1)
  seats!: number;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsArray()
  taken!: string[];
}

export class FilmDto {
  @IsUUID()
  id!: string;

  @IsNumber()
  rating!: number;

  @IsString()
  @IsNotEmpty()
  director!: string;

  @IsArray()
  @ArrayNotEmpty()
  tags!: string[];

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsString()
  @IsNotEmpty()
  cover!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  about!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule?: ScheduleDto[];
}
