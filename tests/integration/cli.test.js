import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
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
//# sourceMappingURL=cli.test.js.map