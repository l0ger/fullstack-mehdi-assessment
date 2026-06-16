import { Injectable } from '@nestjs/common';


import { Client as EsClient, estypes } from '@elastic/elasticsearch';

@Injectable()
export class ElasticSearch {

  private client: EsClient;

  constructor(
  ) {
    this.client = new EsClient({ node: process.env.ELASTICSEARCH_HOST });
    this.checkConnection();
  }

  async checkConnection() {
    try {
      const isAlive = await this.client.ping();
      console.log('Elasticsearch cluster is up and running:', isAlive);
    } catch (error) {
      console.error('Elasticsearch cluster is down!', error);
    }
  }

  async ensureIndex(index: string, mappings: estypes.MappingTypeMapping) {
    const exists = await this.client.indices.exists({ index });
    if (!exists) {
      await this.client.indices.create({ index, mappings });
    }
  }

  indexDocument<TDocument extends Record<string, unknown>>(index: string, id: number, document: TDocument) {
    return this.client.index({
      index,
      id: String(id),
      document,
    });
  }

  async search<TDocument extends Record<string, unknown>>(
    index: string,
    query: string,
    fields: string[],
  ): Promise<number[]> {
    const result = await this.client.search<TDocument>({
      index,
      query: {
        multi_match: {
          query,
          fields,
          fuzziness: 'AUTO',
        },
      },
    });
    return result.hits.hits.map((hit) => Number(hit._id));
  }

}