import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Cocktails } from './cocktails.entity';

@Injectable()
export class CocktailsService {
  constructor(
    @InjectRepository(Cocktails)
    private usersRepository: Repository<Cocktails>,
  ) {}

  findAll(): Promise<Cocktails[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Cocktails | null> {
    return this.usersRepository.findOneBy({ id });
  }

  create(cocktail: Cocktails) {
    return this.usersRepository.insert(cocktail).catch((error) => {
      if (error instanceof QueryFailedError && (error as any).code === '23505') {
        throw new ConflictException(`A cocktail titled "${cocktail.title}" already exists.`);
      }
      throw error;
    });
  }

}