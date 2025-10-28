import axios from 'axios';
import config from '../utils/config.js';
import logger from '../utils/logger.js';

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

export const getMarkets = async (limit = 100, offset = 0): Promise<Market[]> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
            const response = await axios.get<any[]>(`${config.polymarketApiUrl}?limit=${limit}&offset=${offset}`);
            logger.log('Raw API response data:', JSON.stringify(response.data, null, 2));
      
                  return response.data.map((market: any) => {
                    if (!market.outcomes || !market.outcomePrices) {
                      logger.warn(`Skipping market ${market.id} due to missing outcomes or outcomePrices.`);
                      return null;
                    }
            
                    const parsedOutcomes = JSON.parse(market.outcomes);
                    const parsedOutcomePrices = JSON.parse(market.outcomePrices);
            
                    const outcomes = parsedOutcomes.map((name: string, index: number) => ({
                      name,
                      price: parseFloat(parsedOutcomePrices[index]),
                    }));
            
                            return {
            
                              id: market.id,
            
                              question: market.question,
            
                              outcomes,
            
                            };
            
                          }).filter(Boolean) as Market[];    } catch (error) {
      retries++;
      logger.warn(`Failed to fetch markets. Retrying (${retries}/${MAX_RETRIES})...`, error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  logger.error('Failed to fetch markets after multiple retries.');
  return [];
};

export const getAllMarkets = async (): Promise<Market[]> => {
  let allMarkets: Market[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const markets = await getMarkets(limit, offset);
    allMarkets = allMarkets.concat(markets);
    if (markets.length < limit) {
      break;
    }
    offset += limit;
  }
  return allMarkets;
};

export const getMarket = async (id: string): Promise<Market | null> => {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<Market>(`${config.polymarketApiUrl}/${id}`);
      return response.data;
    } catch (error) {
      retries++;
      logger.warn(`Failed to fetch market. Retrying (${retries}/${MAX_RETRIES})...`, error);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  logger.error('Failed to fetch market after multiple retries.');
  return null;
};

export const watchMarkets = async (callback: (markets: Market[]) => void, interval: number): Promise<() => void> => {
  let isWatching = true;

  const fetchAndCallback = async () => {
    if (!isWatching) return;
    const markets = await getMarkets();
    callback(markets);
    if (isWatching) {
      setTimeout(fetchAndCallback, interval);
    }
  };

  fetchAndCallback();

  return () => {
    isWatching = false;
  };
};