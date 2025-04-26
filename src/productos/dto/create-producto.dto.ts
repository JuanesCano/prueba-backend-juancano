import { IsString, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;
}
