import { Controller, Get, Post, Body, Param, Delete, Put, Res } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FastifyReply } from 'fastify';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  create(
    @Body() createProductoDto: CreateProductoDto,
    @Res() reply: FastifyReply
  ) {
    return this.productosService.create(createProductoDto, reply);
  }

  @Get()
  findAll(@Res() reply: FastifyReply) {
    return this.productosService.findAll(reply);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Res() reply: FastifyReply
  ) {
    return this.productosService.findOne(id, reply);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
    @Res() reply: FastifyReply
  ) {
    return this.productosService.update(id, updateProductoDto, reply);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Res() reply: FastifyReply
  ) {
    return this.productosService.remove(id, reply);
  }
}