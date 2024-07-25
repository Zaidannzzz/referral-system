import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { join } from 'path';
import { existsSync, mkdirSync, copyFileSync } from 'fs';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const tmpDir = join(__dirname, '..', 'db');
  const dbFile = join(__dirname, '..', 'src', 'db', 'database.sqlite');
  const tmpDbFile = join(tmpDir, 'database.sqlite');

  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  if (!existsSync(tmpDbFile)) {
    if (existsSync(dbFile)) {
      copyFileSync(dbFile, tmpDbFile);
    } else {
      throw new Error(`Database file not found at ${dbFile}`);
    }
  }

  process.env.DB_FILE = tmpDbFile;

  const config = new DocumentBuilder()
    .setTitle('Referral System API')
    .setDescription('API for 2-level referral system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log('Listening on port ' + process.env.PORT);
}
bootstrap();
