import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, referralCode } = createUserDto;

    const user = new User();
    user.username = username;
    user.password = await bcrypt.hash(password, 10);
    user.referralCode = this.generateReferralCode(username);

    if (referralCode) {
      const referrer = await this.usersRepository.findOne({
        where: { referralCode },
        relations: ['referrals'],
      });
      if (!referrer) {
        throw new NotFoundException('Referral code not found');
      }
      user.referredBy = referrer;
    }

    return this.usersRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['referredBy', 'referredBy.referredBy'],
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { username },
      relations: ['referredBy'],
    });
  }

  findReferrals(id: number): Promise<User[]> {
    return this.usersRepository.find({ where: { referredBy: { id } } });
  }

  async updateEarnings(id: number, amount: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    user.earnings += amount;
    await this.usersRepository.save(user);
  }

  private generateReferralCode(username: string): string {
    return Buffer.from(username).toString('base64');
  }
}
