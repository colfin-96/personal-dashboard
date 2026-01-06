import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stocks, StockData } from '../../services/stocks';

@Component({
  selector: 'app-stocks-widget',
  imports: [CommonModule],
  templateUrl: './stocks-widget.html',
  styleUrl: './stocks-widget.scss',
})
export class StocksWidget implements OnInit {
  stocks: StockData[] = [];
  loading: boolean = true;

  constructor(private stocksService: Stocks) { }

  ngOnInit(): void {
    // Using mock data for demo purposes
    // In production, you'd want to use a real API with proper authentication
    this.stocks = this.stocksService.getMockStockData();
    this.loading = false;
  }
}
