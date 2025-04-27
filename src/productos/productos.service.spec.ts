import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { FastifyReply } from 'fastify';

jest.mock('../common/helpers/response.ts', () => ({
  response: jest.fn().mockImplementation((reply, status, success, data, message) => ({
    status,
    success,
    data,
    message
  }))
}));

describe('ProductosService', () => {
  let service: ProductosService;
  let prismaService: PrismaService;

  const mockReply: FastifyReply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  const mockPrismaService = {
    producto: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductosService>(ProductosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto = { name: 'Test', price: 100, stock: 10 };
      const expectedProduct = { 
        id: '1', 
        ...createDto,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrismaService.producto.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto, mockReply);
      
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.producto.create).toHaveBeenCalledWith({
        data: createDto
      });
    });
  });
});