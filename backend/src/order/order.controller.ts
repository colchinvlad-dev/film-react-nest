import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto, OrderResultDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body() order: OrderDto,
  ): Promise<{ total: number; items: OrderResultDto[] }> {
    const items = await this.orderService.createOrder(order);
    return { total: items.length, items };
  }
}
