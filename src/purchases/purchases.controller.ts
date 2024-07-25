import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PurchasesService } from './purchases.service';
import { CreatePurchaseDto } from './dto/create-purchases.dto';
import { Purchase } from './purchases.entity';

@Controller('purchases')
export class PurchasesController {
  constructor(private readonly purchasesService: PurchasesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPurchaseDto: CreatePurchaseDto,
  ): Promise<Purchase> {
    const { userId, amount } = createPurchaseDto;
    return this.purchasesService.create(userId, amount);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Purchase[]> {
    return this.purchasesService.findAll();
  }
}
