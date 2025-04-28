import { IsString, IsNumber, IsPositive, IsInt } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El precio debe tener como máximo 2 decimales' })
  @IsPositive()
  price: number;

  @IsInt()
  @IsPositive()
  stock: number;
}
