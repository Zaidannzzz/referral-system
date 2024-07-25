import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PurchasesModule } from './purchases/purchases.module';
import { User } from './users/users.entity';
import { Purchase } from './purchases/purchases.entity';

import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

const tmpDir = '/tmp';
const dbFile = join(__dirname, 'src/db/database.sqlite');
const tmpDbFile = join(tmpDir, 'src/db/database.sqlite');

if (!existsSync(tmpDir)) {
  mkdirSync(tmpDir);
}

if (!existsSync(tmpDbFile)) {
  copyFileSync(dbFile, tmpDbFile);
}

process.env.DB_FILE = tmpDbFile;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_FILE,
      entities: [User, Purchase],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    PurchasesModule,
  ],
})
export class AppModule {}
