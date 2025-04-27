import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { response } from 'src/common/helpers/response';
import { FastifyReply } from 'fastify';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductoDto, reply: FastifyReply) {
    try {
      const producto = await this.prisma.productos.create({
        data: data as Prisma.productosCreateInput,
      });
      return response(
        reply,
        201,
        true,
        producto,
        'Producto creado exitosamente',
      );
    } catch (error) {
      if (error.code === 'P2002') {
        return response(reply, 400, false, null, 'El producto ya existe');
      }
      return response(
        reply,
        500,
        false,
        null,
        'Error al crear el producto',
      );
    }
  }

  async findAll(reply: FastifyReply) {
    const productos = await this.prisma.productos.findMany();

    return response(reply, 200, true, productos, 'Lista de productos');
  }

  async findOne(id: string, reply: FastifyReply) {
    const producto = await this.prisma.productos.findUnique({ where: { id } });

    if (!producto) {
      return response(reply, 400, false, '', 'El producto no existe');
    }

    return response(reply, 200, true, producto, 'Producto encontrado');
  }

  async update(id: string, data: UpdateProductoDto, reply: FastifyReply) {
    try {
      const producto = await this.prisma.productos.update({
        where: { id },
        data: data as Prisma.productosUpdateInput,
      });
      return response(
        reply,
        200,
        true,
        producto,
        'Producto actualizado exitosamente',
      );
    } catch (error) {
      if (error.code === 'P2025') {
        // Código de error de Prisma para registro no encontrado
        return response(reply, 404, false, null, 'El producto no existe');
      }
      return response(
        reply,
        500,
        false,
        null,
        'Error al actualizar el producto',
      );
    }
  }

  async remove(id: string, reply: FastifyReply) {
    try {
      await this.prisma.productos.delete({ where: { id } });
      return response(reply, 200, true, null, 'Producto eliminado exitosamente');
    } catch (error) {
      if (error.code === 'P2025') { // Código de error de Prisma para registro no encontrado
        return response(reply, 404, false, null, 'El producto no existe');
      }
      return response(reply, 500, false, null, 'Error al eliminar el producto');
    }
  }
} 