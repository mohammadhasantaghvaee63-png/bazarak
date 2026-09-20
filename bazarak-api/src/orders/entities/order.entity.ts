import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../suppliers/entities/product.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ nullable: true })
  supplierId: number;

  @ManyToOne(() => Supplier, { nullable: true })
  @JoinColumn({ name: 'supplierId' })
  supplier: Supplier;

  @Column()
  customerName: string;

  @Column()
  customerPhone: string;

  @Column()
  quantity: number;

  @Column()
  unit: string;

  @Column({ nullable: true })
  offeredPrice: number;

  @Column({ nullable: true })
  finalPrice: number;

  @Column({ nullable: true })
  commissionPercent: number;

  @Column({ nullable: true })
  commissionAmount: number;

  @Column({ nullable: true })
  message: string;

  @Column({ default: 'pending' })
  status: string;
}
