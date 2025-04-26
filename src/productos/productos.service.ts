import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    const producto = await this.prisma.productos.create({  data: data as Prisma.productosCreateInput});
    return producto;
  }

  async findAll() {
    return this.prisma.productos.findMany();
  }

  async findOne(id: string) {
    const producto = await this.prisma.productos.findUnique({ where: { id } });

    if (!producto) {
      throw new NotFoundException(`Producto no encontrado con el id: ${id}`);
    }

    return producto;
  }

  async update(id: string, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.productos.update({ where: { id },  data: data as Prisma.productosUpdateInput });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.productos.delete({ where: { id } });
  }
}
