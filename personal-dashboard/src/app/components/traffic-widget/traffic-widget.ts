import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficService } from '../../services/traffic';

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
  loading: boolean = true;
  error: string | null = null;

  // Define your saved routes here with real addresses
  // TODO: Replace these with your actual addresses!
  private savedRoutes: SavedRoute[] = [
    {
      name: 'Home to Work',
      origin: '1600 Amphitheatre Parkway, Mountain View, CA', // Example - replace with your address
      destination: 'San Francisco, CA' // Example - replace with your address
    },
    {
      name: 'Home to Airport',
      origin: '1600 Amphitheatre Parkway, Mountain View, CA', // Example - replace with your address
      destination: 'San Francisco International Airport, CA'
    },
    // Add more routes as needed
  ];

  constructor(
    private trafficService: TrafficService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadTrafficData();
  }

  /**
   * Load traffic data from Google Maps API
   */
  loadTrafficData(): void {
    this.loading = true;
    this.error = null;

    this.trafficService.getMultipleRoutesWithTraffic(this.savedRoutes).subscribe({
      next: (routes) => {
        this.routes = routes;
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('TrafficWidget: Error loading traffic data:', err);
        this.error = 'Failed to load traffic data. Using mock data.';
        this.loading = false;
        this.cdr.detectChanges(); // Manually trigger change detection
        // Fall back to mock data
        this.loadMockData();
      }
    });
  }

  /**
   * Fallback mock data if API fails
   */
  private loadMockData(): void {
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
        name: 'Home to Airport',
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
