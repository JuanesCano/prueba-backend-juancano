import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    const producto = await this.prisma.productos.create({ data });
    return producto;
  }

  async findAll() {
    const productos = await this.prisma.productos.findMany();
    return productos;
  }

  async findOne(id: string) {
    const productos = await this.prisma.productos.findFirst({ where: { id } });

    if (!productos) {
      throw new NotFoundException(`Producto no encontrado con el id: ${id}`);
    }

    return productos;
  }

  async update(id: string, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.productos.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productos.delete({ where: { id } });
  }
}
