
import { format } from '@fast-csv/format';
import { createWriteStream } from 'fs';
import type { Trade } from '../simulator/simulator.js';

export function logTrade(trade: Trade): void {
  console.log('Simulation successful:');
  console.log(`  Market: ${trade.market.question}`);
  console.log(`  Investment: $${trade.investment.toFixed(2)}`);
  console.log(`  Profit: $${trade.profit.toFixed(2)}`);
  console.log(`  ROI: ${trade.roi.toFixed(2)}%`);
}

export async function writeTradesToCsv(trades: Trade[], filePath: string): Promise<void> {
  const csvStream = format();
  const writableStream = createWriteStream(filePath);

  return new Promise<void>((resolve, reject) => {
    writableStream.on('error', (error: Error) => {
      console.error(`Error writing to CSV file: ${error.message}`);
      reject(error);
    });
    writableStream.on('finish', resolve);

    csvStream.pipe(writableStream);

    // Explicitly write headers
    csvStream.write(['Market ID', 'Market Question', 'Investment', 'Profit', 'ROI']);

    trades.forEach(trade => {
      csvStream.write([
        trade.market.id,
        trade.market.question,
        trade.investment.toFixed(2),
        trade.profit.toFixed(2),
        `${trade.roi.toFixed(2)}%`,
      ]);
    });
    csvStream.end();
  });
}
