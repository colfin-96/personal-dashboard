import { Injectable } from '@angular/core';
import { Observable, from, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Route, SavedRoute } from '../components/traffic-widget/traffic-widget';

/// <reference types="@types/google.maps" />

@Injectable({
    providedIn: 'root',
})
export class TrafficService {
    private directionsService: google.maps.DirectionsService | null = null;

    constructor() {
        // Initialize the Directions Service when Google Maps is loaded
        this.initializeDirectionsService();
    }

    /**
     * Initialize Google Maps Directions Service
     * Waits for Google Maps API to be loaded
     */
    private initializeDirectionsService(): void {
        if (typeof google !== 'undefined' && google.maps) {
            this.directionsService = new google.maps.DirectionsService();
        } else {
            // If Google Maps isn't loaded yet, wait and try again
            setTimeout(() => this.initializeDirectionsService(), 100);
        }
    }

    /**
     * Get route information with traffic data for a single route
     * @param savedRoute The route configuration (name, origin, destination)
     * @returns Observable<Route> with traffic information
     */
    getRouteWithTraffic(savedRoute: SavedRoute): Observable<Route> {
        if (!this.directionsService) {
            throw new Error('Google Maps Directions Service is not initialized');
        }

        const request: google.maps.DirectionsRequest = {
            origin: savedRoute.origin,
            destination: savedRoute.destination,
            travelMode: google.maps.TravelMode.DRIVING,
            drivingOptions: {
                departureTime: new Date(), // Current time for traffic data
                trafficModel: google.maps.TrafficModel.BEST_GUESS,
            },
        };

        // Convert the callback-based API to a Promise, then to Observable
        const directionsPromise = new Promise<google.maps.DirectionsResult>(
            (resolve, reject) => {
                this.directionsService!.route(
                    request,
                    (
                        result: google.maps.DirectionsResult | null,
                        status: google.maps.DirectionsStatus
                    ) => {
                        if (status === google.maps.DirectionsStatus.OK && result) {
                            resolve(result);
                        } else {
                            reject(new Error(`Directions request failed: ${status}`));
                        }
                    }
                );
            }
        );

        return from(directionsPromise).pipe(
            map((result) => this.parseDirectionsResult(savedRoute.name, result))
        );
    }

    /**
     * Get route information for multiple routes
     * @param savedRoutes Array of saved route configurations
     * @returns Observable<Route[]> with traffic information
     */
    getMultipleRoutesWithTraffic(savedRoutes: SavedRoute[]): Observable<Route[]> {
        const routeObservables = savedRoutes.map((savedRoute) =>
            this.getRouteWithTraffic(savedRoute)
        );

        // Use forkJoin to wait for all routes to complete
        return forkJoin(routeObservables);
    }

    /**
     * Parse Google Maps DirectionsResult into our Route interface
     * @param name Route name
     * @param result Google Maps DirectionsResult
     * @returns Route with traffic data
     */
    private parseDirectionsResult(
        name: string,
        result: google.maps.DirectionsResult
    ): Route {
        const leg = result.routes[0].legs[0];

        // Duration in traffic (current conditions)
        const durationInTraffic = leg.duration_in_traffic
            ? Math.round(leg.duration_in_traffic.value / 60)
            : leg.duration
                ? Math.round(leg.duration.value / 60)
                : 0;

        // Normal duration (without traffic)
        const duration = leg.duration ? Math.round(leg.duration.value / 60) : 0;

        // Distance in kilometers
        const distance = leg.distance
            ? Math.round((leg.distance.value / 1000) * 10) / 10
            : 0;

        // Determine traffic level
        const traffic = this.determineTrafficLevel(duration, durationInTraffic);

        return {
            name,
            origin: leg.start_address,
            destination: leg.end_address,
            duration,
            durationInTraffic,
            distance,
            traffic,
        };
    }

    /**
     * Determine traffic level based on duration comparison
     * @param normalDuration Duration without traffic (minutes)
     * @param trafficDuration Duration with current traffic (minutes)
     * @returns Traffic level: 'light', 'moderate', or 'heavy'
     */
    private determineTrafficLevel(
        normalDuration: number,
        trafficDuration: number
    ): 'light' | 'moderate' | 'heavy' {
        const delayPercentage =
            ((trafficDuration - normalDuration) / normalDuration) * 100;

        if (delayPercentage < 15) {
            return 'light';
        } else if (delayPercentage < 35) {
            return 'moderate';
        } else {
            return 'heavy';
        }
    }
}
