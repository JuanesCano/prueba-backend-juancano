import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FastifyReply } from 'fastify';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  const mockReply: FastifyReply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  const mockDate = new Date();
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    createdAt: mockDate,
    updatedAt: mockDate
  };

  const mockService = {
    create: jest.fn().mockImplementation((dto, reply) => {
      reply.status(201).send({
        status: 201,
        success: true,
        data: { ...dto, ...mockProduct },
        message: 'Producto creado exitosamente'
      });
    }),
    findAll: jest.fn().mockImplementation((reply) => {
      reply.status(200).send({
        status: 200,
        success: true,
        data: [mockProduct],
        message: 'Lista de productos'
      });
    }),
    findOne: jest.fn().mockImplementation((id, reply) => {
      if (id === '1') {
        reply.status(200).send({
          status: 200,
          success: true,
          data: mockProduct,
          message: 'Producto encontrado'
        });
      } else {
        reply.status(400).send({
          status: 400,
          success: false,
          data: '',
          message: 'El producto no existe'
        });
      }
    }),
    update: jest.fn().mockImplementation((id, dto, reply) => {
      reply.status(200).send({
        status: 200,
        success: true,
        data: { ...mockProduct, ...dto },
        message: 'Producto actualizado exitosamente'
      });
    }),
    remove: jest.fn().mockImplementation((id, reply) => {
      reply.status(200).send({
        status: 200,
        success: true,
        data: null,
        message: 'Producto eliminado exitosamente'
      });
    })
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

      await controller.create(createProductoDto, mockReply);
      
      expect(service.create).toHaveBeenCalledWith(createProductoDto, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 201,
        success: true,
        data: expect.objectContaining({
          name: 'Test Product',
          price: 100,
          stock: 10
        }),
        message: 'Producto creado exitosamente'
      });
    });
  });

  // Tests similares para findAll, findOne, update y remove...
});