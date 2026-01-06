import { Component } from '@angular/core';
import { ClockWidget } from '../clock-widget/clock-widget';
import { WeatherWidget } from '../weather-widget/weather-widget';
import { StocksWidget } from '../stocks-widget/stocks-widget';
import { TrafficWidget } from '../traffic-widget/traffic-widget';

@Component({
  selector: 'app-dashboard',
  imports: [ClockWidget, WeatherWidget, StocksWidget, TrafficWidget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
