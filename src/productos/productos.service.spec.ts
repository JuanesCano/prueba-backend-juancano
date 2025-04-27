import { Test, TestingModule } from '@nestjs/testing';
import { ProductosService } from './productos.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { FastifyReply } from 'fastify';

describe('ProductosService', () => {
  let service: ProductosService;
  let prismaService: PrismaService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductosService,
        {
          provide: PrismaService,
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

    service = module.get<ProductosService>(ProductosService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: CreateProductoDto = {
        name: 'Test Product',
        price: 100,
        stock: 10
      };

      await service.create(createDto, mockReply);

      expect(prismaService.productos.create).toHaveBeenCalledWith({
        data: createDto
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto creado exitosamente'
      });
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      await service.findAll(mockReply);
      
      expect(prismaService.productos.findMany).toHaveBeenCalled();
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: [mockProduct],
        message: 'Lista de productos'
      });
    });
  });

  describe('findOne', () => {
    it('should return a product when it exists', async () => {
      await service.findOne('1', mockReply);
      
      expect(prismaService.productos.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto encontrado'
      });
    });

    it('should return error when product does not exist', async () => {
      await service.findOne('999', mockReply);
      
      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: false,
        data: '',
        message: 'El producto no existe'
      });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto = { name: 'Updated Product' };
      
      await service.update('1', updateDto, mockReply);
      
      expect(prismaService.productos.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateDto
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: mockProduct,
        message: 'Producto actualizado exitosamente'
      });
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      await service.remove('1', mockReply);
      
      expect(prismaService.productos.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: 'Producto eliminado exitosamente'
      });
    });
  });
});