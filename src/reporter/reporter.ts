
import { format } from '@fast-csv/format';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createWriteStream } from 'fs';
import type { Trade } from '../simulator/simulator.js';
import logger from '../utils/logger.js';
import { colors } from '../utils/colors.js';

export function logTrade(trade: Trade): void {
  logger.log(colors.success('Simulation successful:'));
  logger.log(`  Market: ${colors.primary(trade.market.question)}`);
  logger.log(`  Investment: $${colors.primary(trade.investment.toFixed(2))}`);
  logger.log(`  Profit: $${colors.success(trade.profit.toFixed(2))}`);
  logger.log(`  ROI: ${colors.success(trade.roi.toFixed(2))}%`);
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

export async function generateChart(trades: Trade[], filePath: string): Promise<void> {
  const width = 800;
  const height = 600;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const labels = trades.map(trade => trade.market.question);
  const data = trades.map(trade => trade.profit);

  const configuration = {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Profit',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration as any);
  const writableStream = createWriteStream(filePath);
  writableStream.write(image);
  writableStream.end();
}
