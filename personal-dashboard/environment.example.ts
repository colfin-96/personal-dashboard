// Environment configuration template
// Copy this to create environment files when you're ready to add API keys

export const environment = {
  production: false,
  
  // Weather API (currently using Open-Meteo - no key needed)
  weather: {
    apiUrl: 'https://api.open-meteo.com/v1/forecast',
    // If you switch to a different weather API:
    // apiKey: 'YOUR_WEATHER_API_KEY_HERE',
  },
  
  // Stock API (currently using mock data)
  stocks: {
    // Option 1: Alpha Vantage (free tier: 5 calls/min, 500 calls/day)
    // apiUrl: 'https://www.alphavantage.co/query',
    // apiKey: 'YOUR_ALPHA_VANTAGE_KEY',
    
    // Option 2: Finnhub (free tier: 60 calls/min)
    // apiUrl: 'https://finnhub.io/api/v1',
    // apiKey: 'YOUR_FINNHUB_KEY',
    
    // Current: Using mock data (no API key needed)
    useMockData: true,
  },
  
  // Traffic API (currently using mock data)
  traffic: {
    // Google Maps (requires credit card, but has free tier)
    // apiKey: 'YOUR_GOOGLE_MAPS_KEY',
    // directionsUrl: 'https://maps.googleapis.com/maps/api/directions/json',
    
    // Current: Using mock data (no API key needed)
    useMockData: true,
  },
  
  // Other potential APIs you might want to add
  news: {
    // NewsAPI (free tier: 100 calls/day)
    // apiUrl: 'https://newsapi.org/v2',
    // apiKey: 'YOUR_NEWS_API_KEY',
  },
  
  crypto: {
    // CoinGecko (free, no key required)
    // apiUrl: 'https://api.coingecko.com/api/v3',
  },
};

/* 
 * HOW TO USE THIS FILE:
 * 
 * 1. Create this file structure:
 *    src/
 *      environments/
 *        environment.ts          (for development)
 *        environment.prod.ts     (for production)
 * 
 * 2. Update angular.json to use environments:
 *    "configurations": {
 *      "production": {
 *        "fileReplacements": [
 *          {
 *            "replace": "src/environments/environment.ts",
 *            "with": "src/environments/environment.prod.ts"
 *          }
 *        ]
 *      }
 *    }
 * 
 * 3. Import in your services:
 *    import { environment } from '../../environments/environment';
 * 
 * 4. Use in code:
 *    const apiKey = environment.stocks.apiKey;
 * 
 * SECURITY NOTE:
 * - Never commit API keys to git!
 * - Add environments/ to .gitignore
 * - For production apps, use a backend to hide keys
 */
