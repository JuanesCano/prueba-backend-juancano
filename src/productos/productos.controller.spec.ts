import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
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

  const mockDate = new Date();

  const mockService = {
    create: jest.fn<(dto: CreateProductoDto, reply: FastifyReply) => Promise<any>>(),
    findAll: jest.fn<(reply: FastifyReply) => Promise<any>>(),
    findOne: jest.fn<(id: string, reply: FastifyReply) => Promise<any>>(),
    update: jest.fn<(id: string, dto: UpdateProductoDto, reply: FastifyReply) => Promise<any>>(),
    remove: jest.fn<(id: string, reply: FastifyReply) => Promise<any>>(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductosController],
      providers: [
        {
          provide: ProductosService,
          useValue: mockService,
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

      mockService.create.mockResolvedValue(expectedProduct);

      await controller.create(createProductoDto, mockReply);
      
      expect(service.create).toHaveBeenCalledWith(createProductoDto, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(201);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const expectedProducts = [
        { 
          id: '1', 
          name: 'Test Product', 
          price: 100, 
          stock: 10,
          createdAt: mockDate,
          updatedAt: mockDate
        }
      ];

      mockService.findAll.mockResolvedValue(expectedProducts);

      await controller.findAll(mockReply);
      
      expect(service.findAll).toHaveBeenCalledWith(mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });
  });

  describe('findOne', () => {
    it('should return a product', async () => {
      const expectedProduct = { 
        id: '1', 
        name: 'Test Product', 
        price: 100, 
        stock: 10,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      mockService.findOne.mockResolvedValue(expectedProduct);

      await controller.findOne('1', mockReply);
      
      expect(service.findOne).toHaveBeenCalledWith('1', mockReply);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductoDto = { name: 'Updated' };
      const expectedProduct = { 
        id: '1', 
        name: 'Updated',
        price: 100,
        stock: 10,
        createdAt: mockDate,
        updatedAt: mockDate
      };

      mockService.update.mockResolvedValue(expectedProduct);

      await controller.update('1', updateDto, mockReply);
      
      expect(service.update).toHaveBeenCalledWith('1', updateDto, mockReply);
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

      mockService.remove.mockResolvedValue(expectedProduct);

      await controller.remove('1', mockReply);
      
      expect(service.remove).toHaveBeenCalledWith('1', mockReply);
    });
  });
});