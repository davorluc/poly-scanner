import type { Market } from '../api/polymarket.js';
import logger from '../utils/logger.js';

export interface Trade {
  market: Market;
  investment: number;
  profit: number;
  roi: number;
}

export const simulateTrade = (market: Market, investment: number): Trade | null => {
  const prices = market.outcomes.map(o => o.price);
  const pricesSum = prices.reduce((sum, price) => sum + price, 0);

  if (pricesSum <= 1) {
    logger.warn('No arbitrage opportunity found for this market.');
    const loss = investment - (investment * pricesSum);
    logger.warn(`Simulated loss: $${loss.toFixed(2)}`);
    return null;
  }

  const profit = (investment * pricesSum) - investment;
  const roi = (profit / investment) * 100;

  return {
    market,
    investment,
    profit,
    roi,
  };
};