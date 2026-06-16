import { ConflictException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { QueryFailedError } from 'typeorm';
import { Cocktails } from './cocktails.entity';
import { CocktailsService } from './cocktails.service';
import { CreateCocktailDto } from './dto/create-cocktail.dto';
import { ElasticSearch } from '../elasticsearch.service';

describe('CocktailsService', () => {
  let service: CocktailsService;
  let repository: { insert: jest.Mock; find: jest.Mock };
  let elasticSearch: { ensureIndex: jest.Mock; indexDocument: jest.Mock; search: jest.Mock };

  beforeEach(async () => {
    repository = { insert: jest.fn(), find: jest.fn() };
    elasticSearch = { ensureIndex: jest.fn(), indexDocument: jest.fn(), search: jest.fn() };
    const moduleRef = await Test.createTestingModule({
      providers: [
        CocktailsService,
        { provide: getRepositoryToken(Cocktails), useValue: repository },
        { provide: ElasticSearch, useValue: elasticSearch },
      ],
    }).compile();

    service = moduleRef.get(CocktailsService);
  });

  describe('create', () => {
    const cocktail: CreateCocktailDto = { title: 'Nojito', description: 'minty', price: 4.5 };

    it('inserts the cocktail and indexes it in Elasticsearch on success', async () => {
      repository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });

      await expect(service.create(cocktail)).resolves.toEqual({ identifiers: [{ id: 1 }] });
      expect(elasticSearch.indexDocument).toHaveBeenCalledWith('cocktails', 1, {
        title: 'Nojito',
        description: 'minty',
      });
    });

    it('throws ConflictException on a unique-title violation', async () => {
      const error = new QueryFailedError('insert', [], new Error('duplicate key'));
      (error as any).code = '23505';
      repository.insert.mockRejectedValue(error);

      await expect(service.create(cocktail)).rejects.toBeInstanceOf(ConflictException);
      expect(elasticSearch.indexDocument).not.toHaveBeenCalled();
    });

    it('rethrows unrelated errors', async () => {
      const error = new Error('connection refused');
      repository.insert.mockRejectedValue(error);

      await expect(service.create(cocktail)).rejects.toBe(error);
    });
  });

  describe('search', () => {
    it('fetches matching cocktails by the ids Elasticsearch returns', async () => {
      const matches = [{ id: 6, title: 'Nojito', description: 'minty', price: 4.5 }];
      elasticSearch.search.mockResolvedValue([6]);
      repository.find.mockResolvedValue(matches);

      await expect(service.search('mojito')).resolves.toEqual(matches);
    });

    it('skips the repository lookup when Elasticsearch finds nothing', async () => {
      elasticSearch.search.mockResolvedValue([]);

      await expect(service.search('xyz')).resolves.toEqual([]);
      expect(repository.find).not.toHaveBeenCalled();
    });
  });

  describe('onModuleInit', () => {
    it('ensures the index exists and backfills every cocktail into it', async () => {
      const cocktails = [
        { id: 1, title: 'Virgin Mojito', description: 'minty', price: 4.5 },
        { id: 2, title: 'Shirley Temple', description: 'fizzy', price: 3.75 },
      ];
      repository.find.mockResolvedValue(cocktails);

      await service.onModuleInit();

      expect(elasticSearch.ensureIndex).toHaveBeenCalled();
      expect(elasticSearch.indexDocument).toHaveBeenCalledWith('cocktails', 1, {
        title: 'Virgin Mojito',
        description: 'minty',
      });
      expect(elasticSearch.indexDocument).toHaveBeenCalledWith('cocktails', 2, {
        title: 'Shirley Temple',
        description: 'fizzy',
      });
    });
  });
});
