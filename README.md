# Polymarket Arbitrage Scanner

A CLI tool to scan for arbitrage opportunities on Polymarket.

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/davorluc/poly-scanner.git
    cd poly-scanner
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Build the project:

    ```bash
    npm run build
    ```

## Usage

Then, you can run the commands using `node dist/index.js <command> [options]`.

### Scan for Arbitrage Opportunities

The `scan` command is used to find arbitrage opportunities.

*   **Basic Scan:** Scans for arbitrage opportunities using live market data.
    ```bash
    node dist/index.js scan
    ```

*   **Scan from a CSV file:** Loads market data from a specified CSV file for scanning.
    ```bash
    node dist/index.js scan --file <path_to_your_csv_file>
    ```
    Replace `<path_to_your_csv_file>` with the actual path to your CSV file.

*   **Live Scan:** Continuously scans for arbitrage opportunities in live mode.
    ```bash
    node dist/index.js scan --live
    ```

### Simulate a Trade

The `simulate` command allows you to simulate a trade for a given market and investment amount. It requires a `marketId` and an `investment` amount.

*   **Basic Simulation:** Simulates a trade for a specific market and investment.
    ```bash
    node dist/index.js simulate <marketId> <investment_amount>
    ```
    Replace `<marketId>` with the ID of the market you want to simulate, and `<investment_amount>` with the amount you wish to invest (e.g., `100` for $100).

*   **Simulation with Output to CSV:** Saves the simulation report to a CSV file.
    ```bash
    node dist/index.js simulate <marketId> <investment_amount> --output <path_to_output_csv>
    ```
    Replace `<path_to_output_csv>` with the desired path and filename for the output CSV.

*   **Simulation with Chart Generation:** Generates a chart of the simulation results.
    ```bash
    node dist/index.js simulate <marketId> <investment_amount> --chart <path_to_chart_file>
    ```
    Replace `<path_to_chart_file>` with the desired path and filename for the chart image.

*   **Simulation Loading Market Data from CSV:** Uses market data from a CSV file to find the market for simulation.
    ```bash
    node dist/index.js simulate <marketId> <investment_amount> --file <path_to_your_csv_file>
    ```
    Replace `<path_to_your_csv_file>` with the actual path to your CSV file.

You can combine options for the `simulate` command, for example:
```bash
node dist/index.js simulate <marketId> <investment_amount> --output report.csv --chart simulation_chart.png
```

## Development

### Running Tests

To run the tests, use the following command:

```bash
npm test
```

### Building the Project

To build the project, use the following command:

```bash
npm run build
```