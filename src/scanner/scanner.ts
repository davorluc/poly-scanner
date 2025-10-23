import { Market } from '../api/polymarket';

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
    const inversePricesSum = prices.reduce((sum, price) => sum + (1 / price), 0);

    if (inversePricesSum < 1) {
      const investment = 100; // Example investment
      const profit = (investment / inversePricesSum) - investment;
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