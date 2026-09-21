import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Get()
  getSuppliers(@Query('type') type?: string, @Query('city') city?: string, @Query('category') category?: string) {
    return this.suppliersService.getSuppliers(type, city, category);
  }

  @Post()
  addSupplier(@Body() supplier: any) {
    return this.suppliersService.addSupplier(supplier);
  }
  @Get('dashboard/stats')
  getDashboardStats() {
    return this.suppliersService.getDashboardStats();
  }

  @Get('products')
  getProducts(@Query('search') search?: string, @Query('supplierId') supplierId?: string) {
    console.log("SEARCH =", search);
    return this.suppliersService.getProducts(search, supplierId ? Number(supplierId) : undefined);
  }

  @Post('products')
  addProduct(@Body() product: any) {
    return this.suppliersService.addProduct(product);
  }
}
