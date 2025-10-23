#!/usr/bin/env node

import { Command } from 'commander';
import { getMarkets, getMarket } from './api/polymarket';
import { findArbitrageOpportunities } from './scanner/scanner';
import { simulateTrade } from './simulator/simulator';
import { logger } from './utils/logger';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to scan for arbitrage opportunities on Polymarket');

program
  .command('scan')
  .description('Scan for arbitrage opportunities')
  .action(async () => {
    logger.log('Scanning for arbitrage opportunities...');
    const markets = await getMarkets();
    const opportunities = findArbitrageOpportunities(markets);

    if (opportunities.length === 0) {
      logger.log('No arbitrage opportunities found.');
      return;
    }

    logger.log('Arbitrage opportunities found:');
    opportunities.forEach(opportunity => {
      logger.log(`\nMarket: ${opportunity.market.question}`);
      logger.log(`  ID: ${opportunity.market.id}`);
      logger.log(`  Profit: $${opportunity.profit.toFixed(2)}`);
      logger.log(`  ROI: ${opportunity.roi.toFixed(2)}%`);
    });
  });

program
  .command('simulate <marketId> <investment>')
  .description('Simulate a trade for a given market and investment amount')
  .action(async (marketId, investment) => {
    logger.log(`Simulating trade for market ${marketId} with an investment of $${investment}...`);
    const market = await getMarket(marketId);
    if (!market) {
      logger.error('Market not found.');
      return;
    }

    const trade = simulateTrade(market, parseFloat(investment));

    if (trade) {
      logger.log('Simulation successful:');
      logger.log(`  Market: ${trade.market.question}`);
      logger.log(`  Investment: $${trade.investment.toFixed(2)}`);
      logger.log(`  Profit: $${trade.profit.toFixed(2)}`);
      logger.log(`  ROI: ${trade.roi.toFixed(2)}%`);
    }
  });

program.parse(process.argv);