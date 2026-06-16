import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateCocktailDto {
  @ApiProperty({ example: 'Nojito' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100) // matches the title VARCHAR(100) column
  title: string;

  @ApiProperty({ example: 'A non-alcoholic version of the classic Mojito.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 4.5 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(999.99) // matches the price DECIMAL(5, 2) column
  price: number;
}
