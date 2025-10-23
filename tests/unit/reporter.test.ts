import { describe, it, expect, vi } from 'vitest';
import { logTrade, writeTradesToCsv } from '../../src/reporter/reporter';
import type { Trade } from '../../src/simulator/simulator';
import type { Market } from '../../src/api/polymarket';
import fs from 'fs';

describe('reporter', () => {
  it('should log a trade', () => {
    const market: Market = {
      id: '1',
      question: 'Market 1',
      outcomes: [
        { name: 'Yes', price: 0.6 },
        { name: 'No', price: 0.5 },
      ],
    };
    const trade: Trade = {
      market,
      investment: 100,
      profit: 10,
      roi: 10,
    };
    const spy = vi.spyOn(console, 'log');
    logTrade(trade);
    expect(spy).toHaveBeenCalledTimes(5);
  });

  it('should write trades to csv', async () => {
    const market: Market = {
      id: '1',
      question: 'Market 1',
      outcomes: [
        { name: 'Yes', price: 0.6 },
        { name: 'No', price: 0.5 },
      ],
    };
    const trades: Trade[] = [
      {
        market,
        investment: 100,
        profit: 10,
        roi: 10,
      },
    ];
    const filePath = './test.csv';

    // Ensure the file is empty before starting
    fs.writeFileSync(filePath, '');

    await writeTradesToCsv(trades, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    expect(lines[0]).toBe('Market ID,Market Question,Investment,Profit,ROI');
    expect(lines[1]).toBe('1,Market 1,100.00,10.00,10.00%');
    fs.unlinkSync(filePath);
  });
});
