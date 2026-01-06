import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Weather } from '../../services/weather';

@Component({
  selector: 'app-weather-widget',
  imports: [CommonModule],
  templateUrl: './weather-widget.html',
  styleUrl: './weather-widget.scss',
})
export class WeatherWidget implements OnInit {
  location: string = 'Loading...';
  temperature: number = 0;
  description: string = '';
  humidity: number = 0;
  windSpeed: number = 0;
  loading: boolean = true;
  error: string = '';

  constructor(
    private weatherService: Weather,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.getLocation();
    }, 0);
  }

  getLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          this.fetchWeather(lat, lon);
          this.fetchLocationName(lat, lon);
        },
        (error) => {
          // Default to a location if geolocation fails (e.g., San Francisco)
          console.error('Geolocation error:', error);
          this.fetchWeather(37.7749, -122.4194);
          this.fetchLocationName(37.7749, -122.4194);
        }
      );
    }
  }

  fetchWeather(lat: number, lon: number): void {
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (data) => {
        this.temperature = Math.round(data.current.temperature_2m);
        this.humidity = data.current.relative_humidity_2m;
        this.windSpeed = Math.round(data.current.wind_speed_10m);
        this.description = this.getWeatherDescription(data.current.weather_code);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Weather fetch error:', err);
        this.error = 'Failed to fetch weather data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  fetchLocationName(lat: number, lon: number): void {
    this.weatherService.getLocationName(lat, lon).subscribe({
      next: (data) => {
        this.location = data.city || data.locality || 'Unknown Location';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Location fetch error:', err);
        this.location = 'Unknown Location';
        this.cdr.detectChanges();
      }
    });
  }

  getWeatherDescription(code: number): string {
    const weatherCodes: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    };
    return weatherCodes[code] || 'Unknown';
  }
}
