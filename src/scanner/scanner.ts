import type { Market } from '../api/polymarket.js';

const LIQUIDITY_THRESHOLD = 1000; // Example threshold

export interface ArbitrageOpportunity {
  market: Market;
  profit: number;
  roi: number;
}

export const findArbitrageOpportunities = (markets: Market[]): ArbitrageOpportunity[] => {
  const opportunities: ArbitrageOpportunity[] = [];

  for (const market of markets) {
    const prices = market.outcomes.map(o => o.price);
    const pricesSum = prices.reduce((sum, price) => sum + price, 0);

    if (pricesSum > 1) {
      const investment = 100; // Example investment
      const profit = (investment * pricesSum) - investment;
      const roi = (profit / investment) * 100;

      const isLowLiquidity = market.outcomes.some(o => o.price * LIQUIDITY_THRESHOLD < 1);

      if (!isLowLiquidity) {
        opportunities.push({
          market,
          profit,
          roi,
        });
      }
    }
  }

  return opportunities;
};