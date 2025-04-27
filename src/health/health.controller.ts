import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  HealthIndicatorFunction
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const prismaHealthCheck: HealthIndicatorFunction = async () => {
      try {
        await this.prisma.$queryRaw`SELECT 1`;
        return { prisma: { status: 'up' } };
      } catch (error) {
        return { prisma: { status: 'down', error: error.message } };
      }
    };

    return this.health.check([
      prismaHealthCheck
    ]);
  }
}