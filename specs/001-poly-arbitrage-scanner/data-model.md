# Data Model: Polymarket Arbitrage Scanner

**Feature**: Polymarket Arbitrage Scanner
**Date**: 2025-10-22

## Entities

### Market

Represents a Polymarket market.

**Fields**:

- `id`: string (unique identifier for the market)
- `question`: string (the question the market is about)
- `outcomes`: Array<{ name: string, price: number }> (the possible outcomes and their current prices)

### Trade

Represents a simulated trade.

**Fields**:

- `id`: string (unique identifier for the trade)
- `marketId`: string (the ID of the market the trade is in)
- `invested`: number (the amount of money invested in the trade)
- `profit`: number (the potential profit from the trade)
- `roi`: number (the potential return on investment)

### Simulation

Represents a series of trades.

**Fields**:

- `id`: string (unique identifier for the simulation)
- `trades`: Array<Trade> (the trades in the simulation)
- `startTime`: Date (the time the simulation started)
- `endTime`: Date (the time the simulation ended)

### Report

Represents a summary of the results of a simulation.

**Fields**:

- `id`: string (unique identifier for the report)
- `simulationId`: string (the ID of the simulation the report is for)
- `totalInvested`: number (the total amount of money invested in the simulation)
- `totalProfit`: number (the total profit from the simulation)
- `averageRoi`: number (the average ROI of the trades in the simulation)
