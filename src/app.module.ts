import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { User } from './users/users.entity';
import { Purchase } from './purchases/purchases.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_FILE || 'src/db/database.sqlite',
      entities: [User, Purchase],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PurchasesModule,
  ],
})
export class AppModule {}
