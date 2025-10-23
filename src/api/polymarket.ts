import axios from 'axios';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export interface Market {
  id: string;
  question: string;
  outcomes: {
    name: string;
    price: number;
  }[];
}

export const getMarkets = async (): Promise<Market[]> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<Market[]>(config.polymarketApiUrl);
      return response.data;
    } catch (error) {
      retries++;
      logger.warn(`Failed to fetch markets. Retrying (${retries}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  logger.error('Failed to fetch markets after multiple retries.');
  return [];
};

export const getMarket = async (id: string): Promise<Market | null> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<Market>(`${config.polymarketApiUrl}/${id}`);
      return response.data;
    } catch (error) {
      retries++;
      logger.warn(`Failed to fetch market. Retrying (${retries}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  logger.error('Failed to fetch market after multiple retries.');
  return null;
};