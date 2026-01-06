# Adding Real APIs to Your Dashboard

This guide will help you integrate real APIs when you're ready to move beyond mock data.

## 🌤️ Weather API (Already Working!)

✅ **Current Status:** Fully functional with Open-Meteo API

The weather widget is already using a real API that requires no API key:

- **API:** Open-Meteo
- **Cost:** Free
- **Limits:** Very generous
- **Setup:** Already done! ✓

## 📈 Adding Real Stock Prices

### Option 1: Alpha Vantage (Recommended for Beginners)

**Pros:** Free tier available, well documented, easy to use  
**Cons:** Limited to 5 API calls per minute

#### Steps:

1. **Get API Key**

   - Go to https://www.alphavantage.co/support/#api-key
   - Enter your email
   - Get instant API key (free)

2. **Update `src/app/services/stocks.ts`:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

@Injectable({
  providedIn: 'root',
})
export class Stocks {
  private apiKey = 'YOUR_ALPHA_VANTAGE_KEY'; // Replace with your key
  private baseUrl = 'https://www.alphavantage.co/query';

  constructor(private http: HttpClient) {}

  getStockPrice(symbol: string): Observable<any> {
    const url = `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
    return this.http.get(url);
  }

  getMultipleStocks(symbols: string[]): Observable<StockData[]> {
    const requests = symbols.map((symbol) =>
      this.getStockPrice(symbol).pipe(
        map((response) => this.parseAlphaVantageResponse(response, symbol))
      )
    );
    return forkJoin(requests);
  }

  private parseAlphaVantageResponse(response: any, symbol: string): StockData {
    const quote = response['Global Quote'];
    return {
      symbol: symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    };
  }

  // Keep mock data as fallback
  getMockStockData(): StockData[] {
    return [
      { symbol: 'AAPL', price: 185.5, change: 2.3, changePercent: 1.26 },
      { symbol: 'GOOGL', price: 142.8, change: -1.2, changePercent: -0.83 },
      { symbol: 'MSFT', price: 378.9, change: 3.5, changePercent: 0.93 },
      { symbol: 'TSLA', price: 248.2, change: -5.4, changePercent: -2.13 },
    ];
  }
}
```

3. **Update `src/app/components/stocks-widget/stocks-widget.ts`:**

```typescript
ngOnInit(): void {
  // Use real API instead of mock data
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

  this.stocksService.getMultipleStocks(symbols).subscribe({
    next: (data) => {
      this.stocks = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Failed to fetch stocks:', err);
      // Fallback to mock data on error
      this.stocks = this.stocksService.getMockStockData();
      this.loading = false;
    }
  });
}
```

### Option 2: Finnhub

**Pros:** Higher rate limits (60 calls/min), real-time data  
**Cons:** Slightly more complex

1. Get API key from https://finnhub.io/
2. Similar implementation to Alpha Vantage

## 🚗 Adding Real Traffic Data

### Option: Google Maps Directions API

**Note:** Requires Google Cloud account with billing enabled (has free tier)

#### Steps:

1. **Setup Google Cloud**

   - Go to https://console.cloud.google.com/
   - Create a new project
   - Enable "Directions API"
   - Create API credentials
   - **Important:** Set up billing (free tier includes $200/month credit)

2. **Create Traffic Service `src/app/services/traffic.ts`:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Route {
  name: string;
  duration: string;
  distance: string;
  traffic: 'light' | 'moderate' | 'heavy';
}

@Injectable({
  providedIn: 'root',
})
export class Traffic {
  private apiKey = 'YOUR_GOOGLE_MAPS_KEY';
  private baseUrl = 'https://maps.googleapis.com/maps/api/directions/json';

  constructor(private http: HttpClient) {}

  getRoute(origin: string, destination: string): Observable<any> {
    const url = `${this.baseUrl}?origin=${origin}&destination=${destination}&departure_time=now&traffic_model=best_guess&key=${this.apiKey}`;
    return this.http.get(url);
  }
}
```

**Alternative (Free):** Use OpenRouteService API

- Free tier: 2000 requests/day
- No credit card required
- https://openrouteservice.org/

## 💰 Adding Cryptocurrency Prices

### Using CoinGecko (Free, No API Key!)

1. **Create Crypto Service `src/app/services/crypto.ts`:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Crypto {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  constructor(private http: HttpClient) {}

  getCryptoPrices(ids: string[]): Observable<any> {
    const idsParam = ids.join(',');
    const url = `${this.baseUrl}/simple/price?ids=${idsParam}&vs_currencies=usd&include_24hr_change=true`;
    return this.http.get(url);
  }
}
```

2. **Create Crypto Widget:**

```bash
pnpm exec ng generate component components/crypto-widget --skip-tests
```

## 📰 Adding News Feed

### Using NewsAPI (Free Tier)

1. **Get API Key**

   - https://newsapi.org/
   - Free: 100 requests/day

2. **Create News Service:**

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class News {
  private apiKey = 'YOUR_NEWS_API_KEY';
  private baseUrl = 'https://newsapi.org/v2';

  constructor(private http: HttpClient) {}

  getTopHeadlines(country: string = 'us'): Observable<any> {
    const url = `${this.baseUrl}/top-headlines?country=${country}&apiKey=${this.apiKey}`;
    return this.http.get(url);
  }
}
```

## 🔒 Security Best Practices

### ⚠️ Important: API Keys in Frontend Apps

**Problem:** API keys in frontend code are visible to anyone!

**Solutions:**

1. **For Development (Current Approach)**

   - Use free APIs without sensitive data
   - Accept that keys are visible
   - Use rate-limited free tiers

2. **For Production (Better Security)**
   - Create a simple backend proxy
   - Store API keys on server
   - Frontend calls your backend, backend calls APIs

### Simple Backend Proxy Example (Node.js + Express)

```javascript
// backend/server.js
const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/stocks/:symbol', async (req, res) => {
  const apiKey = process.env.ALPHA_VANTAGE_KEY; // Stored securely
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.symbol}&apikey=${apiKey}`;

  const response = await axios.get(url);
  res.json(response.data);
});

app.listen(3000);
```

## 📊 Testing APIs Before Integration

Use these tools to test APIs before coding:

1. **Postman** - https://www.postman.com/
2. **Thunder Client** (VS Code extension)
3. **Browser Console**:

```javascript
fetch(
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m'
)
  .then((r) => r.json())
  .then(console.log);
```

## 🚀 Free API Resources

Here are more free APIs you can explore:

- **Weather:** OpenWeatherMap, WeatherAPI
- **Stocks:** IEX Cloud (free tier), Twelve Data
- **Crypto:** CoinGecko, CoinCap
- **News:** NewsAPI, GNews
- **Sports:** TheSportsDB, API-Football
- **Movies:** TMDB, OMDb
- **Quotes:** They Said So API
- **Random:** Random User API, Lorem Picsum

## 📚 Learning Path

1. **Start with:** CoinGecko (crypto) - no API key needed
2. **Then try:** Alpha Vantage (stocks) - simple, free
3. **Advanced:** Google Maps (traffic) - requires billing setup

## ⚡ Quick Tips

- Always handle errors gracefully
- Add loading states
- Cache responses when possible
- Respect rate limits
- Keep mock data as fallback
- Test with small datasets first

---

**Need Help?** Check the API's documentation first - most have example code!
