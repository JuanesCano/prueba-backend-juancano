import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import { Logger, ValidationPipe } from '@nestjs/common';
import cors from '@fastify/cors';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: true}),
  );

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  const logger = new Logger('bootstrap');

  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '127.0.0.1';

  await app.listen(port, host);
  logger.log(`servidor corriendo por el puerto ${port}`)
}
bootstrap();
