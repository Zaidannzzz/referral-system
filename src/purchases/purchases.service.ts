import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from './purchases.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: number, amount: number): Promise<Purchase> {
    const user = await this.usersService.findOne(userId);
    console.log(user);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const purchase = this.purchasesRepository.create({ userId, amount });
    console.log(purchase);
    await this.purchasesRepository.save(purchase);

    console.log('USER REFEREDBY', user.referredBy);
    if (user.referredBy) {
      const directReferrer = user.referredBy;
      const directEarnings = amount * 0.1;
      console.log('DIRECT EARNING', directEarnings);
      console.log('DIRECT REFERRER', directReferrer);
      await this.usersService.updateEarnings(directReferrer.id, directEarnings);

      console.log('USER USER REFEREDBY', directReferrer.referredBy);
      if (directReferrer.referredBy) {
        const indirectReferrer = directReferrer.referredBy;
        const indirectEarnings = amount * 0.05;
        console.log('INDIRECT EARNING', directEarnings);
        await this.usersService.updateEarnings(
          indirectReferrer.id,
          indirectEarnings,
        );
      }
    }

    return purchase;
  }

  findAll(): Promise<Purchase[]> {
    return this.purchasesRepository.find({ relations: ['user'] });
  }
}
