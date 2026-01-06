import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    // Debug mode state shared across components
    debugMode = signal<boolean>(false);

    toggleDebugMode(): void {
        this.debugMode.set(!this.debugMode());
        console.log(`🔧 Debug Mode: ${this.debugMode() ? 'ON' : 'OFF'}`);
    }

    setDebugMode(enabled: boolean): void {
        this.debugMode.set(enabled);
    }
}
