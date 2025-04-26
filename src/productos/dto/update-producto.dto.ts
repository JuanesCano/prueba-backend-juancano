import { IsString, IsNumber, IsPositive, IsInt, IsOptional } from 'class-validator';

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  stock?: number;
}
