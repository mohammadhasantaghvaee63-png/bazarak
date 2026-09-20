import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('report/commission')
  getCommissionReport() {
    return this.ordersService.getCommissionReport();
  }
  @Get('report/financial')
  getFinancialReport() {
    return this.ordersService.getFinancialReport();
  }
  @Get('report/supplier/:supplierId')
  getSupplierReport(@Param('supplierId') supplierId: string) {
    return this.ordersService.getSupplierReport(Number(supplierId));
  }

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.ordersService.getOrder(Number(id));
  }

  @Post()
  createOrder(@Body() order: any) {
    return this.ordersService.createOrder(order);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.ordersService.updateStatus(Number(id), status);
  }

  @Patch(':id/complete')
  completeOrder(
    @Param('id') id: string,
    @Body('finalPrice') finalPrice: number,
    @Body('supplierId') supplierId: number,
    @Body('commissionPercent') commissionPercent: number,
  ) {
    return this.ordersService.completeOrder(
      Number(id),
      Number(finalPrice),
      Number(supplierId),
      Number(commissionPercent),
    );
  }
}
