#!/usr/bin/env node

import { Command } from 'commander';
import { getMarkets, getMarket, watchMarkets, getAllMarkets } from './api/polymarket.js';
import { findArbitrageOpportunities } from './scanner/scanner.js';
import { simulateTrade } from './simulator/simulator.js';
import { readMarketsFromCsv } from './utils/csv.js';
import logger from './utils/logger.js';
import { colors } from './utils/colors.js';

const program = new Command();

program
  .version('1.0.0')
  .description('A CLI tool to scan for arbitrage opportunities on Polymarket');

import { logTrade, writeTradesToCsv, generateChart } from './reporter/reporter.js';

program
  .command('scan')
  .description('Scan for arbitrage opportunities')
  .option('-f, --file <file>', 'Load market data from a CSV file')
  .option('-l, --live', 'Run in live mode')
  .action(async (options) => {
    try {
      if (options.live) {
        logger.log('Scanning for arbitrage opportunities in live mode...');
        watchMarkets(markets => {
          const opportunities = findArbitrageOpportunities(markets);
          if (opportunities.length > 0) {
            logger.log(colors.success('Arbitrage opportunities found:'));
            opportunities.forEach(opportunity => {
              logger.log(`\nMarket: ${colors.primary(opportunity.market.question)}`);
              logger.log(`  ID: ${colors.gray(opportunity.market.id)}`);
              logger.log(`  Profit: $${colors.success(opportunity.profit.toFixed(2))}`);
              logger.log(`  ROI: ${colors.success(opportunity.roi.toFixed(2))}%`);
            });
          }
        }, 5000);
      } else {
        logger.log('Scanning for arbitrage opportunities...');
        const markets = options.file ? await readMarketsFromCsv(options.file) : await getAllMarkets();
        const opportunities = findArbitrageOpportunities(markets);

        if (opportunities.length === 0) {
          logger.log('No arbitrage opportunities found.');
          return;
        }

        logger.log(colors.success('Arbitrage opportunities found:'));
        opportunities.forEach(opportunity => {
          logger.log(`\nMarket: ${colors.primary(opportunity.market.question)}`);
          logger.log(`  ID: ${colors.gray(opportunity.market.id)}`);
          logger.log(`  Profit: $${colors.success(opportunity.profit.toFixed(2))}`);
          logger.log(`  ROI: ${colors.success(opportunity.roi.toFixed(2))}%`);
        });
      }
    } catch (error) {
      logger.error('An error occurred during the scan:', error);
    }
  });

program
  .command('simulate <marketId> <investment>')
  .description('Simulate a trade for a given market and investment amount')
  .option('-o, --output <file>', 'Save the report to a CSV file')
  .option('-c, --chart <file>', 'Generate a chart of the simulation results')
  .option('-f, --file <file>', 'Load market data from a CSV file')
  .action(async (marketId, investment, options) => {
    try {
      logger.log(`Simulating trade for market ${marketId} with an investment of $${investment}...`);
      const market = options.file ? (await readMarketsFromCsv(options.file)).find(m => m.id === marketId) : await getMarket(marketId);
      if (!market) {
        logger.error('Market not found.');
        return;
      }

      const trade = simulateTrade(market, parseFloat(investment));

      if (trade) {
        if (options.output) {
          await writeTradesToCsv([trade], options.output);
          logger.log(`Report saved to ${options.output}`);
        }

        if (options.chart) {
          await generateChart([trade], options.chart);
          logger.log(`Chart saved to ${options.chart}`);
        } else {
          logTrade(trade);
        }
      }
    } catch (error) {
      logger.error('An error occurred during the simulation:', error);
    }
  });

program.parse(process.argv);