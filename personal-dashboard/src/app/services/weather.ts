import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

@Injectable({
  providedIn: 'root',
})
export class Weather {
  constructor(private http: HttpClient) { }

  // Using Open-Meteo API (free, no API key required)
  getWeather(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;
    return this.http.get(url);
  }

  // Get location name using reverse geocoding
  getLocationName(latitude: number, longitude: number): Observable<any> {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    return this.http.get(url);
  }
}
