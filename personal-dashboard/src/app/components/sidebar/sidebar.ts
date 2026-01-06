import { Component, signal, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../services/settings';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.html',
    styleUrl: './sidebar.scss',
})
export class Sidebar {
    private settingsService = inject(SettingsService);

    isOpen = signal<boolean>(false);

    // Use the shared debug mode from service
    get debugMode() {
        return this.settingsService.debugMode;
    }

    toggleSidebar(): void {
        this.isOpen.set(!this.isOpen());
    }

    closeSidebar(): void {
        this.isOpen.set(false);
    }

    toggleDebugMode(): void {
        this.settingsService.toggleDebugMode();
    }    // Close sidebar when clicking outside
    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        const sidebar = document.querySelector('.sidebar-container');
        const hamburger = document.querySelector('.hamburger-menu');

        // Close if clicking outside sidebar and not on hamburger
        if (this.isOpen() && sidebar && hamburger &&
            !sidebar.contains(target) && !hamburger.contains(target)) {
            this.closeSidebar();
        }
    }
}
