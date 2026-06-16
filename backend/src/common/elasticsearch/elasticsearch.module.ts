import { Module } from '@nestjs/common';
import { ElasticSearch } from './elasticsearch.service';

@Module({
  providers: [ElasticSearch],
  exports: [ElasticSearch],
})
export class ElasticsearchModule {}
