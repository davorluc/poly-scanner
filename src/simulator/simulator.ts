import { Market } from '../api/polymarket';
import { logger } from '../utils/logger';

export interface Trade {
  market: Market;
  investment: number;
  profit: number;
  roi: number;
}

export const simulateTrade = (market: Market, investment: number): Trade | null => {
  const prices = market.outcomes.map(o => o.price);
  const inversePricesSum = prices.reduce((sum, price) => sum + (1 / price), 0);

  if (inversePricesSum >= 1) {
    logger.warn('No arbitrage opportunity found for this market.');
    const loss = investment - (investment / inversePricesSum);
    logger.warn(`Simulated loss: $${loss.toFixed(2)}`);
    return null;
  }

  const profit = (investment / inversePricesSum) - investment;
  const roi = (profit / investment) * 100;

  return {
    market,
    investment,
    profit,
    roi,
  };
};