import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { ProductosModule } from './productos/productos.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), CommonModule, ProductosModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
