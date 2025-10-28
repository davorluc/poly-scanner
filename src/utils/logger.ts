import { colors } from './colors.js';

const logger = {
  log: (...args: unknown[]) => console.log(colors.primary(...args)),
  error: (...args: unknown[]) => {
    console.error(colors.error('Error:', ...args));
  },
  warn: (...args: unknown[]) => console.warn(colors.warning(...args)),
};

export default logger;