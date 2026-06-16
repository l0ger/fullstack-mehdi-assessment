import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CocktailsService } from './cocktails.service';
import { CocktailsController } from './cocktails.controller';
import { Cocktails } from './cocktails.entity';
import { ElasticsearchModule } from '../elasticsearch.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cocktails]), ElasticsearchModule],
  providers: [CocktailsService],
  controllers: [CocktailsController],
})
export class CocktailsModule {}
