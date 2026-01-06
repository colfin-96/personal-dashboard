import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Route {
  name: string;
  origin: string;      // Starting address or place
  destination: string; // Ending address or place
  duration: number;    // Normal duration in minutes
  durationInTraffic: number; // Current duration with traffic in minutes
  distance: number;    // Distance in kilometers
  traffic: 'light' | 'moderate' | 'heavy';
}

// Interface for saved route configuration (what user defines)
export interface SavedRoute {
  name: string;
  origin: string;
  destination: string;
}

@Component({
  selector: 'app-traffic-widget',
  imports: [CommonModule],
  templateUrl: './traffic-widget.html',
  styleUrl: './traffic-widget.scss',
})
export class TrafficWidget implements OnInit {
  routes: Route[] = [];

  ngOnInit(): void {
    // Mock traffic data - will be replaced with real Google Maps data
    this.routes = [
      {
        name: 'Home to Work',
        origin: 'Home',
        destination: 'Work',
        duration: 20,
        durationInTraffic: 25,
        distance: 12.5,
        traffic: 'moderate'
      },
      {
        name: 'Home to Downtown',
        origin: 'Home',
        destination: 'Downtown',
        duration: 15,
        durationInTraffic: 18,
        distance: 8.2,
        traffic: 'light'
      },
      {
        name: 'To Airport',
        origin: 'Home',
        destination: 'Airport',
        duration: 35,
        durationInTraffic: 45,
        distance: 28,
        traffic: 'heavy'
      }
    ];
  }

  getTrafficClass(traffic: string): string {
    return `traffic-${traffic}`;
  }

  getTrafficIcon(traffic: string): string {
    const icons: { [key: string]: string } = {
      'light': '🟢',
      'moderate': '🟡',
      'heavy': '🔴'
    };
    return icons[traffic] || '⚪';
  }
}
