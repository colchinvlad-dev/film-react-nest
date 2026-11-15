import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateTicketDto {
  @IsUUID()
  film!: string;

  @IsUUID()
  session!: string;

  @IsOptional()
  @IsString()
  daytime?: string;

  @IsInt()
  @Min(1)
  row!: number;

  @IsInt()
  @Min(1)
  seat!: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}

export class CreateOrderDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketDto)
  tickets!: CreateTicketDto[];
}

export interface OrderResultDto {
  id: string;
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}
