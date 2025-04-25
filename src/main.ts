import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: true}),
  );

  const logger = new Logger('bootstrap');

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await app.listen(port, host);
  logger.log(`servidor corriendo por el puerto ${port}`)
}
bootstrap();
