import { createReadStream } from 'fs';
import { parse } from '@fast-csv/parse';
import type { Market } from '../api/polymarket.js';

export async function readMarketsFromCsv(filePath: string): Promise<Market[]> {
  return new Promise((resolve, reject) => {
    const markets: Market[] = [];
    createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on('error', (error: Error) => reject(error))
      .on('data', (row: any) => {
        markets.push({
          id: row.id,
          question: row.question,
          outcomes: JSON.parse(row.outcomes),
        });
      })
      .on('end', (rowCount: number) => {
        console.log(`Parsed ${rowCount} rows`);
        resolve(markets);
      });
  });
}
