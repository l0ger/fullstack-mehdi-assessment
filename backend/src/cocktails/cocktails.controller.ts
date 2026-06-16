import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';

@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  searchCocktails(@Query('search') search?: string) : Promise<Cocktails[]> {
    if (search) {
      return this.cocktailsService.search(search);
    }
    return this.cocktailsService.findAll();
  }

  @Get(':id')
  async getCocktail(@Param('id') id: string): Promise<Cocktails> {
    const cocktail = await this.cocktailsService.findOne(+id);
    if (!cocktail) {
      throw new NotFoundException(`Cocktail ${id} not found`);
    }
    return cocktail;
  }

  @Post()
  async newCocktail(@Body() cocktail: Cocktails) {
    console.log("info: creating cocktail", cocktail)
    const res = await this.cocktailsService.create(cocktail);
    console.log("res", res);
    return true;
  }
}
