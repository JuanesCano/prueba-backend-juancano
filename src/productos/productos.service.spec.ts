import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { FastifyReply } from 'fastify';

// Suite de pruebas para el ProductosService
describe('ProductosService', () => {
  // Variables que se usarán en las pruebas
  let service: ProductosService;
  let prismaService: PrismaService;

  // Mock de FastifyReply para simular las respuestas HTTP
  const mockReply: FastifyReply = {
    status: jest.fn().mockReturnThis(), // Mock de la función status
    send: jest.fn().mockReturnThis(),    // Mock de la función send
  } as unknown as FastifyReply;

  // Fecha mock para consistencia en las pruebas
  const mockDate = new Date();
  
  // Objeto mock de un producto para usar en las pruebas
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100,
    stock: 10,
    createdAt: mockDate,
    updatedAt: mockDate
  };

  // Configuración antes de cada prueba
  beforeEach(async () => {
    // Creación del módulo de testing
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: PrismaService,
          // Mock implementation de PrismaService
          useValue: {
            productos: {
              create: jest.fn().mockResolvedValue(mockProduct),
              findMany: jest.fn().mockResolvedValue([mockProduct]),
              findUnique: jest.fn().mockImplementation(({ where }) => 
                where.id === '1' ? Promise.resolve(mockProduct) : Promise.resolve(null)
              ),
              update: jest.fn().mockResolvedValue(mockProduct),
              delete: jest.fn().mockResolvedValue(mockProduct)
            }
          }
        }
      ],
    }).compile();

    // Obtención de las instancias de los servicios
    service = module.get<ProductosService>(ProductosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // Prueba básica para verificar que el servicio existe
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Grupo de pruebas para el método create()
  describe('create', () => {
    it('should create a product', async () => {
      // DTO de prueba para creación de producto
      const createDto: CreateProductoDto = {
        name: 'Test Product',
        price: 100,
        stock: 10
      };

      // Ejecución del método a probar
      await service.create(createDto, mockReply);

      // Verificaciones:
      // 1. Que se llamó al método create de Prisma con los datos correctos
      expect(prismaService.productos.create).toHaveBeenCalledWith({
        data: createDto
      });
      
      // 2. Que se envió el status HTTP correcto (201)
      expect(mockReply.status).toHaveBeenCalledWith(201);
      
      // 3. Que la respuesta tiene el formato esperado
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto creado exitosamente'
      });
    });
  });

  // Grupo de pruebas para el método findAll()
  describe('findAll', () => {
    it('should return all products', async () => {
      // Ejecución del método
      await service.findAll(mockReply);
      
      // Verificaciones:
      // 1. Que se llamó al método findMany de Prisma
      expect(prismaService.productos.findMany).toHaveBeenCalled();
      
      // 2. Que se envió el status HTTP correcto (200)
      expect(mockReply.status).toHaveBeenCalledWith(200);
      
      // 3. Que la respuesta contiene el array de productos
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: [mockProduct],
        message: 'Lista de productos'
      });
    });
  });

  // Grupo de pruebas para el método findOne()
  describe('findOne', () => {
    it('should return a product when it exists', async () => {
      // Ejecución del método con un ID existente
      await service.findOne('1', mockReply);
      
      // Verificaciones para cuando el producto existe:
      // 1. Que se llamó a findUnique con el ID correcto
      expect(prismaService.productos.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      
      // 2. Que se envió status 200
      expect(mockReply.status).toHaveBeenCalledWith(200);
      
      // 3. Que la respuesta contiene el producto
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto encontrado'
      });
    });

    it('should return error when product does not exist', async () => {
      // Ejecución del método con un ID que no existe
      await service.findOne('999', mockReply);
      
      // Verificaciones para cuando el producto NO existe:
      // 1. Que se envió status 400 (Bad Request)
      expect(mockReply.status).toHaveBeenCalledWith(400);
      
      // 2. Que la respuesta indica el error
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        data: '',
        message: 'El producto no existe'
      });
    });
  });

  // Grupo de pruebas para el método update()
  describe('update', () => {
    it('should update a product', async () => {
      // Datos de prueba para actualización
      const updateDto = { name: 'Updated Product' };
      
      // Ejecución del método
      await service.update('1', updateDto, mockReply);
      
      // Verificaciones:
      // 1. Que se llamó a update con los parámetros correctos
      expect(prismaService.productos.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto
      });
      
      // 2. Que se envió status 200
      expect(mockReply.status).toHaveBeenCalledWith(200);
      
      // 3. Que la respuesta indica éxito
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto actualizado exitosamente'
      });
    });
  });

  // Grupo de pruebas para el método remove()
  describe('remove', () => {
    it('should delete a product', async () => {
      // Ejecución del método
      await service.remove('1', mockReply);
      
      // Verificaciones:
      // 1. Que se llamó a delete con el ID correcto
      expect(prismaService.productos.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      
      // 2. Que se envió status 200
      expect(mockReply.status).toHaveBeenCalledWith(200);
      
      // 3. Que la respuesta indica éxito (con data null como es estándar en eliminaciones)
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: 'Producto eliminado exitosamente'
      });
    });
  });
});