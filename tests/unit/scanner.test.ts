import { describe, it, expect } from 'vitest';
import { findArbitrageOpportunities } from '../../src/scanner/scanner';
import type { Market } from '../../src/api/polymarket';

describe('scanner', () => {
  it('should find arbitrage opportunities', () => {
    const markets: Market[] = [
      {
        id: '1',
        question: 'Market 1',
        outcomes: [
          { name: 'Yes', price: 0.6 },
          { name: 'No', price: 0.5 },
        ],
      },
    ];
    const opportunities = findArbitrageOpportunities(markets);
    expect(opportunities).toHaveLength(1);
    if (opportunities[0]) {
      expect(opportunities[0].profit).toBeCloseTo(10);
    }
  });

  it('should not find arbitrage opportunities', () => {
    const markets: Market[] = [
      {
        id: '1',
        question: 'Market 1',
        outcomes: [
          { name: 'Yes', price: 0.4 },
          { name: 'No', price: 0.5 },
        ],
      },
    ];
    const opportunities = findArbitrageOpportunities(markets);
    expect(opportunities).toHaveLength(0);
  });
});
