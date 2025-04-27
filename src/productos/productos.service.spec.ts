import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

describe('ProductosService', () => {
  let service: ProductosService;
  let prismaService: PrismaService;

  // Mock de FastifyReply
  const mockReply: FastifyReply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
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
      const createProductoDto = { name: 'Test Product', price: 100, stock: 10 };
      const expectedProduct = { id: '1', ...createProductoDto };
      mockPrismaService.producto.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductoDto, mockReply);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.producto.create).toHaveBeenCalledWith({ 
        data: createProductoDto 
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [{ id: '1', name: 'Test Product', price: 100, stock: 10 }];
      mockPrismaService.producto.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll(mockReply);
      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.producto.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const expectedProduct = { id: '1', name: 'Test Product', price: 100, stock: 10 };
      mockPrismaService.producto.findUnique.mockResolvedValue(expectedProduct);

      const result = await service.findOne('1', mockReply);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.producto.findUnique).toHaveBeenCalledWith({ 
        where: { id: '1' } 
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrismaService.producto.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1', mockReply)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductoDto = { name: 'Updated Product', stock: 20 };
      const expectedProduct = { id: '1', ...updateProductoDto };
      mockPrismaService.producto.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.producto.update.mockResolvedValue(expectedProduct);

      const result = await service.update('1', updateProductoDto, mockReply);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.producto.update).toHaveBeenCalledWith({ 
        where: { id: '1' }, 
        data: updateProductoDto 
      });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const expectedProduct = { id: '1', name: 'Test Product', price: 100, stock: 10 };
      mockPrismaService.producto.findUnique.mockResolvedValue(expectedProduct);
      mockPrismaService.producto.delete.mockResolvedValue(expectedProduct);

      const result = await service.remove('1', mockReply);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.producto.delete).toHaveBeenCalledWith({ 
        where: { id: '1' } 
      });
    });
  });
});