import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    const producto = await this.prisma.productos.create({  data: data as Prisma.ProductoCreateInput});
    return producto;
  }

  async findAll() {
    const productos = await this.prisma.productos.findMany();
    return productos;
  }

  async findOne(id: string) {
    const producto = await this.prisma.productos.findFirst({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto no encontrado con el id: ${id}`);
    }

    return producto;
  }

  async update(id: string, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.productos.update({ where: { id },  data: data as Prisma.ProductoUpdateInput });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productos.delete({ where: { id } });
  }
}
