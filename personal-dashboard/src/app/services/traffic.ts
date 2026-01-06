import { Injectable } from '@angular/core';
import { Observable, from, forkJoin, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Route, SavedRoute } from '../components/traffic-widget/traffic-widget';

/// <reference types="@types/google.maps" />

@Injectable({
    providedIn: 'root',
})
export class TrafficService {
    private directionsService: google.maps.DirectionsService | null = null;
    private initializationPromise: Promise<void> | null = null; // Cache the initialization promise

    constructor() {
        // Don't initialize in constructor - wait until it's actually needed
    }

    /**
     * Initialize Google Maps Directions Service
     * Waits for Google Maps API to be loaded
     * Caches initialization promise to prevent multiple simultaneous initializations
     */
    private async initializeDirectionsService(): Promise<void> {
        if (this.directionsService) {
            return; // Already initialized
        }

        // Return cached promise if initialization is already in progress
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        // Check if we're online
        if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your network and try again.');
        }

        const maxAttempts = 100; // 10 seconds max wait
        let attempts = 0;

        this.initializationPromise = new Promise((resolve, reject) => {
            const checkGoogle = () => {
                if (typeof google !== 'undefined' && google.maps && google.maps.DirectionsService) {
                    this.directionsService = new google.maps.DirectionsService();
                    console.log('✅ Google Maps Directions Service initialized successfully');
                    this.initializationPromise = null; // Clear the promise
                    resolve();
                } else {
                    attempts++;
                    if (attempts >= maxAttempts) {
                        const error = 'Failed to initialize Google Maps: API not loaded after 10 seconds. Check if API key is set correctly in index.html and that you have an active internet connection.';
                        console.error('❌', error);
                        this.initializationPromise = null; // Clear the promise on error
                        reject(new Error(error));
                    } else {
                        setTimeout(checkGoogle, 100);
                    }
                }
            };
            checkGoogle();
        });

        return this.initializationPromise;
    }

    /**
     * Get route information with traffic data for a single route
     * @param savedRoute The route configuration (name, origin, destination)
     * @returns Observable<Route> with traffic information
     */
    getRouteWithTraffic(savedRoute: SavedRoute): Observable<Route> {
        const startTime = performance.now();

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
                                // Provide detailed error messages based on status
                                const errorMessage = this.getDirectionsErrorMessage(status, savedRoute);
                                reject(new Error(errorMessage));
                            }
                        }
                    );
                });
            }).then((result) => {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                console.log(`⏱️ Route "${savedRoute.name}" fetched in ${duration}ms`);
                return this.parseDirectionsResult(savedRoute.name, result);
            })
        ).pipe(
            catchError((error) => {
                const endTime = performance.now();
                const duration = Math.round(endTime - startTime);
                console.error(`❌ Error fetching route "${savedRoute.name}" after ${duration}ms:`, error);
                return throwError(() => error);
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
     * Get user-friendly error message based on Google Maps API status
     * @param status Google Maps DirectionsStatus
     * @param savedRoute The route that failed
     * @returns User-friendly error message
     */
    private getDirectionsErrorMessage(
        status: google.maps.DirectionsStatus,
        savedRoute: SavedRoute
    ): string {
        switch (status) {
            case google.maps.DirectionsStatus.NOT_FOUND:
                return `Location not found for route "${savedRoute.name}". Please check the addresses.`;
            case google.maps.DirectionsStatus.ZERO_RESULTS:
                return `No route found between ${savedRoute.origin} and ${savedRoute.destination}.`;
            case google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED:
                return `Too many waypoints in the route request.`;
            case google.maps.DirectionsStatus.INVALID_REQUEST:
                return `Invalid request for route "${savedRoute.name}". Check the route configuration.`;
            case google.maps.DirectionsStatus.OVER_QUERY_LIMIT:
                return `Google Maps API quota exceeded. Please try again later.`;
            case google.maps.DirectionsStatus.REQUEST_DENIED:
                return `Google Maps API request denied. Check your API key configuration.`;
            case google.maps.DirectionsStatus.UNKNOWN_ERROR:
                return `Unknown error occurred. Please try again.`;
            default:
                return `Directions request failed with status: ${status}`;
        }
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
