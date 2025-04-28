import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger();
  
  async onModuleInit() {
    await this.$connect();
    this.logger.debug('base de datos de productos conectada')
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
