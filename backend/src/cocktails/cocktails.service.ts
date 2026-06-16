import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { ElasticSearch } from '../common/elasticsearch/elasticsearch.service';

const COCKTAILS_INDEX = 'cocktails';
/**
 * Keep in sync with the index mapping in onModuleInit() and the
 * CocktailDocument shape — all three must list the same fields.
 */
const COCKTAILS_SEARCH_FIELDS = ['title^2', 'description'];
const POSTGRES_UNIQUE_VIOLATION = '23505';

interface CocktailDocument extends Record<string, unknown> {
  title: string;
  description: string;
}

@Injectable()
export class CocktailsService implements OnModuleInit {
  constructor(
    @InjectRepository(Cocktails)
    private cocktailsRepository: Repository<Cocktails>,
    private elasticSearch: ElasticSearch,
  ) {}

  async onModuleInit() {
    await this.elasticSearch.ensureIndex(COCKTAILS_INDEX, {
      properties: {
        title: { type: 'text' },
        description: { type: 'text' },
      },
    });
    const cocktails = await this.findAll();
    await Promise.all(
      cocktails.map((cocktail) => this.indexCocktail(cocktail)),
    );
  }

  findAll(): Promise<Cocktails[]> {
    return this.cocktailsRepository.find();
  }

  findOne(id: number): Promise<Cocktails | null> {
    return this.cocktailsRepository.findOneBy({ id });
  }

  async search(query: string): Promise<Cocktails[]> {
    const ids = await this.elasticSearch.search<CocktailDocument>(
      COCKTAILS_INDEX,
      query,
      COCKTAILS_SEARCH_FIELDS,
    );
    if (ids.length === 0) {
      return [];
    }
    return this.cocktailsRepository.find({ where: { id: In(ids) } });
  }

  async create(cocktail: CreateCocktailDto) {
    const result = await this.cocktailsRepository.insert(cocktail).catch((error) => {
      const driverError = error instanceof QueryFailedError ? (error.driverError as { code?: string }) : null;
      if (driverError?.code === POSTGRES_UNIQUE_VIOLATION) {
        throw new ConflictException(`A cocktail titled "${cocktail.title}" already exists.`);
      }
      throw error;
    });
    const id = result.identifiers[0].id;
    await this.indexCocktail({ id, title: cocktail.title, description: cocktail.description });
    return result;
  }

  private indexCocktail(cocktail: { id: number; title: string; description: string }) {
    return this.elasticSearch.indexDocument<CocktailDocument>(COCKTAILS_INDEX, cocktail.id, {
      title: cocktail.title,
      description: cocktail.description,
    });
  }

}
