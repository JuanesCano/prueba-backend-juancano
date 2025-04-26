import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProductosService', () => {
  let service: ProductosService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    productos: {
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
      mockPrismaService.productos.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductoDto);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.productos.create).toHaveBeenCalledWith({ data: createProductoDto });
    });

    it('should handle zero stock', async () => {
      const createProductoDto = { name: 'Test Product', price: 100, stock: 0 };
      const expectedProduct = { id: '1', ...createProductoDto };
      mockPrismaService.productos.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductoDto);
      expect(result).toEqual(expectedProduct);
    });

    it('should handle negative price', async () => {
      const createProductoDto = { name: 'Test Product', price: -100, stock: 10 };
      const expectedProduct = { id: '1', ...createProductoDto };
      mockPrismaService.productos.create.mockResolvedValue(expectedProduct);

      const result = await service.create(createProductoDto);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [{ id: '1', name: 'Test Product', price: 100, stock: 10 }];
      mockPrismaService.productos.findMany.mockResolvedValue(expectedProducts);

      const result = await service.findAll();
      expect(result).toEqual(expectedProducts);
      expect(mockPrismaService.productos.findMany).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      mockPrismaService.productos.findMany.mockResolvedValue([]);

      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const expectedProduct = { id: '1', name: 'Test Product', price: 100, stock: 10 };
      mockPrismaService.productos.findUnique.mockResolvedValue(expectedProduct);

      const result = await service.findOne('1');
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.productos.findUnique).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrismaService.productos.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });

    it('should handle invalid id format', async () => {
      mockPrismaService.productos.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductoDto = { name: 'Updated Product', stock: 20 };
      const expectedProduct = { id: '1', ...updateProductoDto };
      mockPrismaService.productos.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.productos.update.mockResolvedValue(expectedProduct);

      const result = await service.update('1', updateProductoDto);
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.productos.update).toHaveBeenCalledWith({ where: { id: '1' }, data: updateProductoDto });
    });

    it('should handle partial updates', async () => {
      const updateProductoDto = { name: 'Updated Product' };
      const expectedProduct = { id: '1', name: 'Updated Product', price: 100, stock: 10 };
      mockPrismaService.productos.findUnique.mockResolvedValue({ id: '1', name: 'Test Product', price: 100, stock: 10 });
      mockPrismaService.productos.update.mockResolvedValue(expectedProduct);

      const result = await service.update('1', updateProductoDto);
      expect(result).toEqual(expectedProduct);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrismaService.productos.findUnique.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Updated Product' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const expectedProduct = { id: '1', name: 'Test Product', price: 100, stock: 10 };
      mockPrismaService.productos.findUnique.mockResolvedValue(expectedProduct);
      mockPrismaService.productos.delete.mockResolvedValue(expectedProduct);

      const result = await service.remove('1');
      expect(result).toEqual(expectedProduct);
      expect(mockPrismaService.productos.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockPrismaService.productos.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
