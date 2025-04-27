import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { FastifyReply } from 'fastify';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

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
      
      jest.spyOn(service, 'create').mockImplementation(() => 
        Promise.resolve(expectedProduct)
      );

      await controller.create(createProductoDto, mockReply);
      
      expect(service.create).toHaveBeenCalledWith(createProductoDto, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(201);
    });

    it('should validate required fields', async () => {
      const invalidDto = { name: 'Test Product' } as CreateProductoDto;
      jest.spyOn(service, 'create').mockImplementation(() => 
        Promise.reject(new BadRequestException('Validation failed'))
      );

      await expect(controller.create(invalidDto, mockReply))
        .rejects.toThrow(BadRequestException);
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
        }
      ];
      
      jest.spyOn(service, 'findAll').mockImplementation(() => 
        Promise.resolve(expectedProducts)
      );

      await controller.findAll(mockReply);
      
      expect(service.findAll).toHaveBeenCalledWith(mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
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
      
      jest.spyOn(service, 'findOne').mockImplementation(() => 
        Promise.resolve(expectedProduct)
      );

      await controller.findOne('1', mockReply);
      
      expect(service.findOne).toHaveBeenCalledWith('1', mockReply);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => 
        Promise.reject(new NotFoundException())
      );

      await expect(controller.findOne('999', mockReply))
        .rejects.toThrow(NotFoundException);
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
      
      jest.spyOn(service, 'update').mockImplementation(() => 
        Promise.resolve(expectedProduct)
      );

      await controller.update('1', updateProductoDto, mockReply);
      
      expect(service.update).toHaveBeenCalledWith('1', updateProductoDto, mockReply);
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
      
      jest.spyOn(service, 'remove').mockImplementation(() => 
        Promise.resolve(expectedProduct)
      );

      await controller.remove('1', mockReply);
      
      expect(service.remove).toHaveBeenCalledWith('1', mockReply);
    });
  });
});