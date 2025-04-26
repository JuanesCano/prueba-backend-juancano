import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockPrismaService = {
    productos: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDate = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        ProductosService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    controller = module.get<ProductosController>(ProductosController);
    service = module.get<ProductosService>(ProductosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductoDto: CreateProductoDto = {
        name: 'Test Product',
        price: 100,
        stock: 10,
      };
      const expectedProduct = { 
        id: '1', 
        ...createProductoDto,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedProduct);

      const result = await controller.create(createProductoDto);
      expect(result).toEqual(expectedProduct);
      expect(service.create).toHaveBeenCalledWith(createProductoDto);
    });

    it('should validate required fields', async () => {
      const invalidDto = { name: 'Test Product' } as CreateProductoDto;
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Validation failed'));

      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should handle zero stock', async () => {
      const createProductoDto: CreateProductoDto = {
        name: 'Test Product',
        price: 100,
        stock: 0,
      };
      const expectedProduct = { 
        id: '1', 
        ...createProductoDto,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'create').mockResolvedValue(expectedProduct);

      const result = await controller.create(createProductoDto);
      expect(result).toEqual(expectedProduct);
    });

    it('should handle negative price', async () => {
      const createProductoDto: CreateProductoDto = {
        name: 'Test Product',
        price: -100,
        stock: 10,
      };
      jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException('Price must be positive'));

      await expect(controller.create(createProductoDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        { 
          id: '1', 
          name: 'Test Product 1', 
          price: 100, 
          stock: 10,
          createdAt: mockDate,
          updatedAt: mockDate
        },
        { 
          id: '2', 
          name: 'Test Product 2', 
          price: 200, 
          stock: 20,
          createdAt: mockDate,
          updatedAt: mockDate
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(expectedProducts);

      const result = await controller.findAll();
      expect(result).toEqual(expectedProducts);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a product if it exists', async () => {
      const expectedProduct = { 
        id: '1', 
        name: 'Test Product', 
        price: 100, 
        stock: 10,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(expectedProduct);

      const result = await controller.findOne('1');
      expect(result).toEqual(expectedProduct);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });

    it('should handle invalid id format', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new BadRequestException('Invalid ID format'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductoDto: UpdateProductoDto = {
        name: 'Updated Product',
        stock: 20,
      };
      const expectedProduct = { 
        id: '1', 
        name: 'Updated Product',
        price: 100,
        stock: 20,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'update').mockResolvedValue(expectedProduct);

      const result = await controller.update('1', updateProductoDto);
      expect(result).toEqual(expectedProduct);
      expect(service.update).toHaveBeenCalledWith('1', updateProductoDto);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const updateProductoDto: UpdateProductoDto = { name: 'Updated Product' };
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('999', updateProductoDto)).rejects.toThrow(NotFoundException);
    });

    it('should handle partial updates', async () => {
      const updateProductoDto: UpdateProductoDto = { name: 'Updated Product' };
      const expectedProduct = { 
        id: '1', 
        name: 'Updated Product', 
        price: 100, 
        stock: 10,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'update').mockResolvedValue(expectedProduct);

      const result = await controller.update('1', updateProductoDto);
      expect(result).toEqual(expectedProduct);
    });

    it('should validate update data', async () => {
      const invalidDto = { price: -100 } as UpdateProductoDto;
      jest.spyOn(service, 'update').mockRejectedValue(new BadRequestException('Price must be positive'));

      await expect(controller.update('1', invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const expectedProduct = { 
        id: '1', 
        name: 'Test Product', 
        price: 100, 
        stock: 10,
        createdAt: mockDate,
        updatedAt: mockDate
      };
      jest.spyOn(service, 'remove').mockResolvedValue(expectedProduct);

      const result = await controller.remove('1');
      expect(result).toEqual(expectedProduct);
      expect(service.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });

    it('should handle invalid id format', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new BadRequestException('Invalid ID format'));

      await expect(controller.remove('invalid-id')).rejects.toThrow(BadRequestException);
    });
  });
});
