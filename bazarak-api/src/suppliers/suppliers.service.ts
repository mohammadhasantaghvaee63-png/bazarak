import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { Product } from './entities/product.entity';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  getSuppliers(type?: string, city?: string, category?: string) {
    const where = {
      ...(type ? { type } : {}),
      ...(city ? { city } : {}),
    };

    return this.supplierRepository.find({ where });
  }

  addSupplier(supplier: Partial<Supplier>) {
    const newSupplier = this.supplierRepository.create(supplier);
    return this.supplierRepository.save(newSupplier);
  }

  getProducts(search?: string, supplierId?: number) {
    const where = supplierId ? { supplierId } : search
      ? [
          { name: ILike(`%${search}%`) },
          { category: ILike(`%${search}%`) },
          { description: ILike(`%${search}%`) },
        ]
      : undefined;

    return this.productRepository.find({
      where,
      relations: { supplier: true },
    });
  }

  addProduct(product: Partial<Product>) {
    const newProduct = this.productRepository.create(product);
    return this.productRepository.save(newProduct);
  }

  async getDashboardStats() {
    const totalSuppliers =
      await this.supplierRepository.count();

    const totalProducts =
      await this.productRepository.count();

    return {
      totalSuppliers,
      totalProducts,
    };
  }
}

