import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Route {
  name: string;
  duration: string;
  distance: string;
  traffic: 'light' | 'moderate' | 'heavy';
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
    // Mock traffic data
    // In a real app, you'd use Google Maps API or similar
    this.routes = [
      { name: 'Home to Work', duration: '25 min', distance: '12.5 km', traffic: 'moderate' },
      { name: 'Home to Downtown', duration: '18 min', distance: '8.2 km', traffic: 'light' },
      { name: 'To Airport', duration: '45 min', distance: '28 km', traffic: 'heavy' }
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
