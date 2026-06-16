import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let repository: { insert: jest.Mock };

  beforeEach(async () => {
    repository = { insert: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CocktailsService,
        { provide: getRepositoryToken(Cocktails), useValue: repository },
      ],
    }).compile();

    service = moduleRef.get(CocktailsService);
  });

  describe('create', () => {
    const cocktail = { title: 'Nojito', description: 'minty', price: 4.5 } as Cocktails;

    it('inserts the cocktail on success', async () => {
      repository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });

      await expect(service.create(cocktail)).resolves.toEqual({ identifiers: [{ id: 1 }] });
    });

    it('throws ConflictException on a unique-title violation', async () => {
      const error = new QueryFailedError('insert', [], new Error('duplicate key'));
      (error as any).code = '23505';
      repository.insert.mockRejectedValue(error);

      await expect(service.create(cocktail)).rejects.toBeInstanceOf(ConflictException);
    });

    it('rethrows unrelated errors', async () => {
      const error = new Error('connection refused');
      repository.insert.mockRejectedValue(error);

      await expect(service.create(cocktail)).rejects.toBe(error);
    });
  });
});
