import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import { QueryFailedError } from 'typeorm';
import { Cocktails } from '../src/cocktails/cocktails.entity';
import { CocktailsModule } from '../src/cocktails/cocktails.module';

describe('Cocktails (e2e)', () => {
  let app: INestApplication;
  let repository: { find: jest.Mock; findOneBy: jest.Mock; insert: jest.Mock };

  beforeEach(async () => {
    repository = { find: jest.fn(), findOneBy: jest.fn(), insert: jest.fn() };

    const moduleRef = await Test.createTestingModule({
      imports: [CocktailsModule],
    })
      .overrideProvider(getRepositoryToken(Cocktails))
      .useValue(repository)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /cocktails', () => {
    it('returns the list of cocktails', async () => {
      const cocktails = [{ id: 1, title: 'Nojito', description: 'minty', price: 4.5 }];
      repository.find.mockResolvedValue(cocktails);

      await request(app.getHttpServer()).get('/cocktails').expect(200, cocktails);
    });
  });

  describe('POST /cocktails', () => {
    it('creates a cocktail', async () => {
      repository.insert.mockResolvedValue({ identifiers: [{ id: 1 }] });

      await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Cinderella', description: 'fruity', price: 4 })
        .expect(201, 'true');
    });

    it('returns 409 when the title already exists', async () => {
      const dbError = new QueryFailedError('insert', [], new Error('duplicate key value'));
      (dbError as any).code = '23505';
      repository.insert.mockRejectedValue(dbError);

      const response = await request(app.getHttpServer())
        .post('/cocktails')
        .send({ title: 'Nojito', description: 'minty', price: 4.5 })
        .expect(409);

      expect(response.body.message).toMatch(/already exists/);
    });
  });

  describe('GET /cocktails/:id', () => {
    it('returns the matching cocktail', async () => {
      const cocktail = { id: 1, title: 'Nojito', description: 'minty', price: 4.5 };
      repository.findOneBy.mockResolvedValue(cocktail);

      await request(app.getHttpServer()).get('/cocktails/1').expect(200, cocktail);
    });

    it('returns 404 when no cocktail matches', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await request(app.getHttpServer()).get('/cocktails/999999').expect(404);
    });
  });
});
