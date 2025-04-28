import { Test, TestingModule } from '@nestjs/testing';
import { ProductosController } from './productos.controller';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FastifyReply } from 'fastify';

describe('ProductosController', () => {
  let controller: ProductosController;
  let service: ProductosService;

  // Mock de FastifyReply para simular respuestas HTTP
  const mockReply: FastifyReply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  } as unknown as FastifyReply;

  // Datos de prueba consistentes
  const mockDate = new Date();
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    createdAt: mockDate,
    updatedAt: mockDate
  };

  // Mock completo del ProductosService
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

  // Configuración del módulo de testing antes de cada prueba
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

  // Prueba básica de existencia del controlador
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Pruebas para el endpoint de creación de productos
  describe('create()', () => {
    it('debe crear un producto correctamente', async () => {
      const createProductoDto: CreateProductoDto = {
        name: 'Test Product',
        price: 100,
        stock: 10,
      };

      await controller.create(createProductoDto, mockReply);
      
      // Verifica que se llame al servicio con los parámetros correctos
      expect(service.create).toHaveBeenCalledWith(createProductoDto, mockReply);
      
      // Verifica el código de estado HTTP
      expect(mockReply.status).toHaveBeenCalledWith(201);
      
      // Verifica el formato de la respuesta
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

  // Pruebas para el endpoint de listado de productos
  describe('findAll()', () => {
    it('debe retornar todos los productos', async () => {
      await controller.findAll(mockReply);
      
      expect(service.findAll).toHaveBeenCalledWith(mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: [mockProduct],
        message: 'Lista de productos'
      });
    });
  });

  // Pruebas para el endpoint de búsqueda por ID
  describe('findOne()', () => {
    it('debe retornar un producto existente', async () => {
      await controller.findOne('1', mockReply);
      
      expect(service.findOne).toHaveBeenCalledWith('1', mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: mockProduct,
        message: 'Producto encontrado'
      });
    });

    it('debe manejar productos no encontrados', async () => {
      await controller.findOne('999', mockReply);
      
      expect(service.findOne).toHaveBeenCalledWith('999', mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 400,
        success: false,
        data: '',
        message: 'El producto no existe'
      });
    });
  });

  // Pruebas para el endpoint de actualización
  describe('update()', () => {
    it('debe actualizar un producto existente', async () => {
      const updateDto: UpdateProductoDto = { name: 'Updated Product' };
      
      await controller.update('1', updateDto, mockReply);
      
      expect(service.update).toHaveBeenCalledWith('1', updateDto, mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: { ...mockProduct, ...updateDto },
        message: 'Producto actualizado exitosamente'
      });
    });
  });

  // Pruebas para el endpoint de eliminación
  describe('remove()', () => {
    it('debe eliminar un producto existente', async () => {
      await controller.remove('1', mockReply);
      
      expect(service.remove).toHaveBeenCalledWith('1', mockReply);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        status: 200,
        success: true,
        data: null,
        message: 'Producto eliminado exitosamente'
      });
    });
  });
});