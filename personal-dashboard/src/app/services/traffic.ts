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
        // Don't initialize in constructor - wait until it's actually needed
    }

    /**
     * Initialize Google Maps Directions Service
     * Waits for Google Maps API to be loaded
     */
    private async initializeDirectionsService(): Promise<void> {
        if (this.directionsService) {
            return; // Already initialized
        }

        const maxAttempts = 100; // 10 seconds max wait
        let attempts = 0;

        return new Promise((resolve, reject) => {
            const checkGoogle = () => {
                if (typeof google !== 'undefined' && google.maps && google.maps.DirectionsService) {
                    this.directionsService = new google.maps.DirectionsService();
                    console.log('Google Maps Directions Service initialized successfully');
                    resolve();
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        const error = 'Failed to initialize Google Maps: API not loaded after 10 seconds. Check if API key is set correctly in index.html';
                        console.error(error);
                        reject(new Error(error));
                    } else {
                        setTimeout(checkGoogle, 100);
                    }
                }
            };
            checkGoogle();
        });
    }

    /**
     * Get route information with traffic data for a single route
     * @param savedRoute The route configuration (name, origin, destination)
     * @returns Observable<Route> with traffic information
     */
    getRouteWithTraffic(savedRoute: SavedRoute): Observable<Route> {
        // First initialize the service, then make the request
        return from(
            this.initializeDirectionsService().then(() => {
                if (!this.directionsService) {
                    throw new Error('Google Maps Directions Service failed to initialize');
                }

                const request: google.maps.DirectionsRequest = {
                    origin: savedRoute.origin,
                    destination: savedRoute.destination,
                    travelMode: google.maps.TravelMode.DRIVING,
                    drivingOptions: {
                        departureTime: new Date(),
                        trafficModel: google.maps.TrafficModel.BEST_GUESS,
                    },
                };

                // Return a promise for the directions result
                return new Promise<google.maps.DirectionsResult>((resolve, reject) => {
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
                });
            }).then((result) => {
                return this.parseDirectionsResult(savedRoute.name, result);
            })
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
