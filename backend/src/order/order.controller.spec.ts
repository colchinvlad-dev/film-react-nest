import { Test } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResultDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: { createOrder: jest.Mock };

  const orderDto: CreateOrderDto = {
    email: 'a@mail.ru',
    phone: '89990000000',
    tickets: [
      {
        film: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
        session: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
        daytime: '2024-06-28T10:00:53+03:00',
        row: 1,
        seat: 1,
        price: 350,
      },
    ],
  };

  const result: OrderResultDto = {
    id: 'e223a5bd-46cf-4a62-b964-cf0a8d740f9f',
    film: orderDto.tickets[0].film,
    session: orderDto.tickets[0].session,
    daytime: orderDto.tickets[0].daytime as string,
    row: orderDto.tickets[0].row,
    seat: orderDto.tickets[0].seat,
    price: orderDto.tickets[0].price as number,
  };

  beforeEach(async () => {
    service = {
      createOrder: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: service }],
    }).compile();

    controller = moduleRef.get<OrderController>(OrderController);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('должен вернуть созданные заказы с total равным количеству билетов', async () => {
      service.createOrder.mockResolvedValue([result]);
      const response = await controller.createOrder(orderDto);
      expect(response).toEqual({ total: 1, items: [result] });
      expect(service.createOrder).toHaveBeenCalledWith(orderDto);
    });

    it('должен пробросить ошибку сервиса, если место уже занято', async () => {
      service.createOrder.mockRejectedValue(new Error('Место 1:1 уже занято'));
      await expect(controller.createOrder(orderDto)).rejects.toThrow(
        'Место 1:1 уже занято',
      );
    });
  });
});
