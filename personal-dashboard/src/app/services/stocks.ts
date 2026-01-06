import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  constructor(private http: HttpClient) { }

  // Using Yahoo Finance alternative API (free, no API key required)
  // Note: For production, you might want to use a more reliable API with an API key
  getStockPrice(symbol: string): Observable<any> {
    // We'll use a CORS proxy for demo purposes
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    return this.http.get(url);
  }

  // Mock data for demo purposes (you can replace with real API)
  getMockStockData(): StockData[] {
    return [
      { symbol: 'AAPL', price: 185.50, change: 2.30, changePercent: 1.26 },
      { symbol: 'GOOGL', price: 142.80, change: -1.20, changePercent: -0.83 },
      { symbol: 'MSFT', price: 378.90, change: 3.50, changePercent: 0.93 },
      { symbol: 'TSLA', price: 248.20, change: -5.40, changePercent: -2.13 }
    ];
  }
}
