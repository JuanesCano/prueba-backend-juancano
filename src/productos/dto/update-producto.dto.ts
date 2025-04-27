// import { IsString, IsNumber, IsPositive, IsInt, IsOptional } from 'class-validator';

// export class UpdateProductoDto {
//   @IsOptional()
//   @IsString()
//   name?: string;

//   @IsOptional()
//   @IsNumber()
//   @IsPositive()
//   price?: number;

//   @IsOptional()
//   @IsInt()
//   @IsPositive()
//   stock?: number;
// }

import { PartialType } from '@nestjs/mapped-types'
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}