import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';

@ApiTags('cocktails')
@Controller('cocktails')
export class CocktailsController {
  constructor(private readonly cocktailsService: CocktailsService) {}

  @Get()
  @ApiOperation({ summary: 'List cocktails, or fuzzy-search them by title/description' })
  @ApiQuery({ name: 'search', required: false, description: 'Fuzzy search term (Elasticsearch)' })
  @ApiResponse({ status: 200, type: Cocktails, isArray: true })
  searchCocktails(@Query('search') search?: string) : Promise<Cocktails[]> {
    if (search) {
      return this.cocktailsService.search(search);
    }
    return this.cocktailsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single cocktail by id' })
  @ApiResponse({ status: 200, type: Cocktails })
  @ApiResponse({ status: 404, description: 'No cocktail with that id' })
  async getCocktail(@Param('id') id: string): Promise<Cocktails> {
    const cocktail = await this.cocktailsService.findOne(+id);
    if (!cocktail) {
      throw new NotFoundException(`Cocktail ${id} not found`);
    }
    return cocktail;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new cocktail' })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'A cocktail with that title already exists' })
  async newCocktail(@Body() cocktail: CreateCocktailDto) {
    console.log("info: creating cocktail", cocktail)
    const res = await this.cocktailsService.create(cocktail);
    console.log("res", res);
    return true;
  }
}
