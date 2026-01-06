import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TrafficService } from '../../services/traffic';
import { SettingsService } from '../../services/settings';
import { environment } from '../../../environments/environment';

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
  private settingsService = inject(SettingsService);
  private sanitizer = inject(DomSanitizer);

  // Use signals for reactive state
  routes = signal<Route[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Debug panel state
  debugPanelOpen = signal<boolean>(false);

  // Map display state
  selectedRoute = signal<Route | null>(null);
  showMap = signal<boolean>(false);

  // Access debug mode from settings service
  get debugMode() {
    return this.settingsService.debugMode;
  }

  // Define your saved routes here with real addresses
  private savedRoutes: SavedRoute[] = [
    {
      name: 'Home to Work',
      origin: 'Johannes-Prassel-Straße 51, 50765 Köln, Germany',
      destination: 'Serviceware SE, An der Hasenkaule, Hürth, Germany'
    },
    {
      name: 'Work to Home',
      origin: 'Serviceware SE, An der Hasenkaule, Hürth, Germany',
      destination: 'Johannes-Prassel-Straße 51, 50765 Köln, Germany'
    }
  ];

  constructor(private trafficService: TrafficService) { }

  ngOnInit(): void {
    this.loadTrafficData();
  }

  /**
   * Load traffic data from Google Maps API
   */
  loadTrafficData(): void {
    this.loading.set(true);
    this.error.set(null);

    this.trafficService.getMultipleRoutesWithTraffic(this.savedRoutes).subscribe({
      next: (routes) => {
        this.routes.set(routes);
        this.loading.set(false);
        console.log('Traffic data loaded successfully');
      },
      error: (err) => {
        console.error('TrafficWidget: Error loading traffic data:', err);

        // Determine error message based on error type
        let errorMessage = 'Failed to load traffic data.';

        if (err.message) {
          if (err.message.includes('quota exceeded') || err.message.includes('OVER_QUERY_LIMIT')) {
            errorMessage = '⚠️ API quota exceeded. Please try again later.';
          } else if (err.message.includes('API key') || err.message.includes('REQUEST_DENIED')) {
            errorMessage = '⚠️ API key error. Please check your configuration.';
          } else if (err.message.includes('not found') || err.message.includes('NOT_FOUND')) {
            errorMessage = '⚠️ One or more locations could not be found. Please check addresses.';
          } else if (err.message.includes('not loaded') || err.message.includes('initialize')) {
            errorMessage = '⚠️ Google Maps failed to load. Please refresh the page.';
          } else {
            errorMessage = `⚠️ ${err.message}`;
          }
        }

        this.error.set(errorMessage);
        this.loading.set(false);

        // Fall back to mock data
        this.loadMockData();
      }
    });
  }

  /**
   * Retry loading traffic data
   * Called when user clicks retry button
   */
  retryLoadTrafficData(): void {
    console.log('Retrying traffic data load...');
    this.loadTrafficData();
  }

  /**
   * Fallback mock data if API fails
   */
  private loadMockData(): void {
    this.routes.set([
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
    ]);
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

  getDelayText(route: Route): string {
    const delay = route.durationInTraffic - route.duration;
    if (delay <= 0) {
      return 'no delay';
    }
    return `+${delay} min delay`;
  }

  // ============ DEBUG METHODS ============

  toggleDebugPanel(): void {
    this.debugPanelOpen.set(!this.debugPanelOpen());
  }

  simulateError(errorType: string): void {
    this.loading.set(false);
    this.routes.set([]);

    switch (errorType) {
      case 'quota':
        this.error.set('⚠️ API quota exceeded. Please try again later.');
        break;
      case 'apikey':
        this.error.set('⚠️ API key error. Please check your configuration.');
        break;
      case 'notfound':
        this.error.set('⚠️ One or more locations could not be found. Please check addresses.');
        break;
      case 'offline':
        this.error.set('⚠️ No internet connection. Please check your network and try again.');
        break;
      case 'generic':
        this.error.set('⚠️ Failed to load traffic data.');
        break;
      default:
        this.error.set('⚠️ Unknown error occurred.');
    }

    // Also load mock data for display
    this.loadMockData();
    console.log(`Debug: Simulated ${errorType} error`);
  }

  simulateLoading(): void {
    this.loading.set(true);
    this.error.set(null);
    this.routes.set([]);
    console.log('Debug: Simulating loading state');

    // Auto-clear after 3 seconds
    setTimeout(() => {
      this.loading.set(false);
      this.loadMockData();
    }, 3000);
  }

  simulateMockData(): void {
    this.loading.set(false);
    this.error.set(null);
    this.loadMockData();
    console.log('Debug: Loading mock data');
  }

  clearAll(): void {
    this.loading.set(false);
    this.error.set(null);
    this.routes.set([]);
    console.log('Debug: Cleared all data');
  }

  // ============ MAP INTERACTION METHODS ============

  /**
   * Handle route click - toggle map or open in Google Maps
   * First click: Show embedded map OR open directly if embed not available
   * Second click: Open in Google Maps
   */
  onRouteClick(route: Route): void {
    const currentlySelected = this.selectedRoute();

    if (currentlySelected && currentlySelected.name === route.name && this.showMap()) {
      // Second click on same route - open in Google Maps
      this.openInGoogleMaps(route);
    } else {
      // First click - try to show embedded map, or open directly if embed unavailable
      if (this.canUseEmbedApi()) {
        this.selectedRoute.set(route);
        this.showMap.set(true);
        console.log(`📍 Showing map for: ${route.name}`);
      } else {
        // If embed API not available, open directly in Google Maps
        console.log('⚠️ Maps Embed API not available, opening in Google Maps directly');
        this.openInGoogleMaps(route);
      }
    }
  }

  /**
   * Check if Maps Embed API is available
   */
  canUseEmbedApi(): boolean {
    // Check if API key exists and is not the example key
    const apiKey = environment.googleMapsApiKey;
    return !!(apiKey && apiKey !== 'YOUR_API_KEY_HERE' && apiKey.length > 20);
  }

  /**
   * Close the map view
   */
  closeMap(): void {
    this.showMap.set(false);
    this.selectedRoute.set(null);
    console.log('📍 Map closed');
  }

  /**
   * Open route in Google Maps (new tab)
   */
  openInGoogleMaps(route: Route): void {
    const origin = encodeURIComponent(route.origin);
    const destination = encodeURIComponent(route.destination);
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

    window.open(url, '_blank');
    console.log(`🗺️ Opening ${route.name} in Google Maps`);

    // Close the embedded map after opening
    this.closeMap();
  }

  /**
   * Get embedded map URL for iframe
   */
  getEmbeddedMapUrl(route: Route): SafeResourceUrl {
    const origin = encodeURIComponent(route.origin);
    const destination = encodeURIComponent(route.destination);
    const apiKey = environment.googleMapsApiKey;
    const url = `https://www.google.com/maps/embed/v1/directions?key=${apiKey}&origin=${origin}&destination=${destination}&mode=driving`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
