import { Controller, Get } from '@nestjs/common';
import { 
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator
} from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.prisma.$queryRaw`SELECT 1`
        .then(() => ({ status: 'up' as const }))
        .catch(() => ({ status: 'down' as const })),
      
      () => this.disk.checkStorage('storage', { 
        path: '/', 
        thresholdPercent: 0.9 
      }),
      
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}