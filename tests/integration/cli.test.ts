import { describe, it, expect, vi } from 'vitest';
import { execSync } from 'child_process';

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

describe('cli', () => {
  it('should run the scan command', () => {
    const output = execSync('node dist/index.js scan').toString();
    expect(output).toContain('Scanning for arbitrage opportunities');
  });

  it('should run the simulate command', () => {
    const output = execSync('node dist/index.js simulate 0x123 100').toString();
    expect(output).toContain('Simulating trade for market 0x123 with an investment of $100');
  });
});
