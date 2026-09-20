import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from '../suppliers/entities/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createOrder(order: Partial<Order>) {
    if (!order.supplierId && order.productId) {
      const product = await this.productRepository.findOne({
        where: { id: order.productId },
      });

      if (product) {
        order.supplierId = product.supplierId;
      }
    }

    const newOrder = this.orderRepository.create(order);
    return this.orderRepository.save(newOrder);
  }

  getOrders() {
    return this.orderRepository.find({
      relations: { product: true, supplier: true },
    });
  }

  getOrder(id: number) {
    return this.orderRepository.findOne({
      where: { id },
      relations: { product: true, supplier: true },
    });
  }

  async updateStatus(id: number, status: string) {
    await this.orderRepository.update(id, { status });

    return this.orderRepository.findOne({
      where: { id },
      relations: { product: true, supplier: true },
    });
  }

  async completeOrder(
    id: number,
    finalPrice: number,
    supplierId: number,
    commissionPercent: number,
  ) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { product: true, supplier: true },
    });

    if (!order) {
      return null;
    }
    if (supplierId) {
      order.supplierId = supplierId;
    }


    const totalAmount = finalPrice * order.quantity;

    const commissionAmount =
      (totalAmount * commissionPercent) / 100;

    order.finalPrice = finalPrice;
    order.commissionPercent = commissionPercent;
    order.commissionAmount = commissionAmount;
    order.status = 'completed';

    return this.orderRepository.save(order);
  }

  async getCommissionReport() {
    const completedOrders = await this.orderRepository.find({
      where: { status: 'completed' },
      relations: { product: true, supplier: true },
    });

    const totalOrders = completedOrders.length;

    const totalSales = completedOrders.reduce(
      (sum, order) =>
        sum + (order.finalPrice || 0) * order.quantity,
      0,
    );

    const totalCommission = completedOrders.reduce(
      (sum, order) =>
        sum + (order.commissionAmount || 0),
      0,
    );

    return {
      totalOrders,
      totalSales,
      totalCommission,
      orders: completedOrders,
    };
  }

  async getSupplierReport(supplierId: number) {
    const completedOrders = await this.orderRepository.find({
      where: {
        supplierId,
        status: 'completed',
      },
      relations: {
        product: true,
        supplier: true,
      },
    });

    const totalOrders = completedOrders.length;

    const totalSales = completedOrders.reduce(
      (sum, order) =>
        sum + (order.finalPrice || 0) * order.quantity,
      0,
    );

    const totalCommission = completedOrders.reduce(
      (sum, order) =>
        sum + (order.commissionAmount || 0),
      0,
    );

    return {
      supplierId,
      supplier: completedOrders[0]?.supplier || null,
      totalOrders,
      totalSales,
      totalCommission,
      orders: completedOrders,
    };
  }

  async getFinancialReport() {
    const completedOrders = await this.orderRepository.find({
      where: {
        status: 'completed',
      },
      relations: {
        product: true,
        supplier: true,
      },
    });

    const totalOrders = completedOrders.length;

    const totalSales = completedOrders.reduce(
      (sum, order) =>
        sum + (order.finalPrice || 0) * order.quantity,
      0,
    );

    const totalCommission = completedOrders.reduce(
      (sum, order) =>
        sum + (order.commissionAmount || 0),
      0,
    );

    return {
      totalOrders,
      totalSales,
      totalCommission,
      averageOrderValue:
        totalOrders > 0 ? totalSales / totalOrders : 0,
      orders: completedOrders,
    };
  }
}

