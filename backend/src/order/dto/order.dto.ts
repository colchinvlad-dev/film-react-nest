export interface TicketDto {
  film: string;
  session: string;
  daytime: string;
  day?: string;
  time?: string;
  row: number;
  seat: number;
  price: number;
}

export interface OrderDto {
  email: string;
  phone: string;
  tickets: TicketDto[];
}

export interface OrderResultDto extends TicketDto {
  id: string;
}
