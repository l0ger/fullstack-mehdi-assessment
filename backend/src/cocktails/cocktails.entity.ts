import { Entity, Column, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Postgres returns DECIMAL columns as strings (to avoid float precision
 * loss); without this, TypeORM falls back to its default Number->integer
 * mapping and silently truncates e.g. "4.50" to 4.
 */
export const decimalTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value),
};

@Entity()
export class Cocktails {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column('decimal', { precision: 5, scale: 2, transformer: decimalTransformer })
  price: number;
}