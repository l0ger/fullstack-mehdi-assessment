import { Injectable } from '@nestjs/common';


import { Client as EsClient } from '@elastic/elasticsearch';

export const COCKTAILS_INDEX = 'cocktails';

interface CocktailDocument {
  title: string;
  description: string;
}

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

  async ensureIndex() {
    const exists = await this.client.indices.exists({ index: COCKTAILS_INDEX });
    if (!exists) {
      await this.client.indices.create({
        index: COCKTAILS_INDEX,
        mappings: {
          properties: {
            title: { type: 'text' },
            description: { type: 'text' },
          },
        },
      });
    }
  }

  indexCocktail(id: number, document: CocktailDocument) {
    return this.client.index({
      index: COCKTAILS_INDEX,
      id: String(id),
      document,
    });
  }

  async search(query: string): Promise<number[]> {
    const result = await this.client.search<CocktailDocument>({
      index: COCKTAILS_INDEX,
      query: {
        multi_match: {
          query,
          fields: ['title^2', 'description'],
          fuzziness: 'AUTO',
        },
      },
    });
    return result.hits.hits.map((hit) => Number(hit._id));
  }

}