# Quickstart: Polymarket Arbitrage Scanner

**Feature**: Polymarket Arbitrage Scanner
**Date**: 2025-10-22

## Setup

1.  Clone the repository:

    ```bash
    git clone https://github.com/davorluc/poly-scanner.git
    cd poly-scanner
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

## Running the Scanner

To scan for arbitrage opportunities, run the following command:

```bash
npm start scan
```

This will scan all Polymarket markets and output a list of any potential arbitrage opportunities that are found.

## Running a Simulation

To run a simulation, you will need a file with historical market data. Once you have this file, you can run a simulation with the following command:

```bash
npm start simulate --file <path/to/data.csv>
```

This will simulate trades based on the historical data and output a report of the results.

## Options

- `--file <path>`: Path to a CSV file with historical market data for simulation.
- `--output <path>`: Path to write the report to (defaults to stdout).
- `--chart`: Generate a chart of the simulation results.
