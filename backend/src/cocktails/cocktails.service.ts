import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, QueryFailedError, Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { ElasticSearch } from '../elasticsearch.service';

@Injectable()
export class CocktailsService implements OnModuleInit {
  constructor(
    @InjectRepository(Cocktails)
    private usersRepository: Repository<Cocktails>,
    private elasticSearch: ElasticSearch,
  ) {}

  async onModuleInit() {
    await this.elasticSearch.ensureIndex();
    const cocktails = await this.findAll();
    await Promise.all(
      cocktails.map((cocktail) =>
        this.elasticSearch.indexCocktail(cocktail.id, {
          title: cocktail.title,
          description: cocktail.description,
        }),
      ),
    );
  }

  findAll(): Promise<Cocktails[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Cocktails | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async search(query: string): Promise<Cocktails[]> {
    const ids = await this.elasticSearch.search(query);
    if (ids.length === 0) {
      return [];
    }
    return this.usersRepository.find({ where: { id: In(ids) } });
  }

  async create(cocktail: Cocktails) {
    const result = await this.usersRepository.insert(cocktail).catch((error) => {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException(`A cocktail titled "${cocktail.title}" already exists.`);
      }
      throw error;
    });
    const id = result.identifiers[0].id;
    await this.elasticSearch.indexCocktail(id, {
      title: cocktail.title,
      description: cocktail.description,
    });
    return result;
  }

}