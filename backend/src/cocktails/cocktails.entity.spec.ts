import { decimalTransformer } from './cocktails.entity';

describe('decimalTransformer', () => {
  it('parses the raw decimal string Postgres returns into a number', () => {
    expect(decimalTransformer.from('4.50')).toBe(4.5);
  });

  it('does not truncate the fractional part', () => {
    expect(decimalTransformer.from('6.99')).toBe(6.99);
  });

  it('passes the value through unchanged when writing', () => {
    expect(decimalTransformer.to(4.5)).toBe(4.5);
  });
});
