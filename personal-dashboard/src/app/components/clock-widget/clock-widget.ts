import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clock-widget',
  imports: [CommonModule],
  templateUrl: './clock-widget.html',
  styleUrl: './clock-widget.scss',
})
export class ClockWidget implements OnInit, OnDestroy {
  currentTime: Date = new Date();
  private intervalId: any;

  ngOnInit(): void {
    // Update time every second
    this.intervalId = setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  get formattedTime(): string {
    return this.currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  get formattedDate(): string {
    return this.currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
