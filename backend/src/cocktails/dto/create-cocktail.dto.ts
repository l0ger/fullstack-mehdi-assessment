import { ApiProperty } from '@nestjs/swagger';

export class CreateCocktailDto {
  @ApiProperty({ example: 'Nojito' })
  title: string;

  @ApiProperty({ example: 'A non-alcoholic version of the classic Mojito.' })
  description: string;

  @ApiProperty({ example: 4.5 })
  price: number;
}
