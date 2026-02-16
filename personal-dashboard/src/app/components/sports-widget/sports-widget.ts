import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sports, NewsArticle } from '../../services/sports';

@Component({
    selector: 'app-sports-widget',
    imports: [CommonModule],
    templateUrl: './sports-widget.html',
    styleUrl: './sports-widget.scss',
})
export class SportsWidget implements OnInit {
    news = signal<NewsArticle[]>([]);
    loading = signal<boolean>(true);
    error = signal<string>('');

    // Teams to follow
    soccerTeams = ['FC Barcelona', 'Borussia Dortmund', '1. FC Köln'];

    constructor(private sportsService: Sports) { }

    ngOnInit(): void {
        this.fetchSportsNews();
    }

    fetchSportsNews(): void {
        this.loading.set(true);
        this.error.set('');

        // Fetch real sports news from RSS feeds
        this.sportsService.getAllSportsNews().subscribe({
            next: (articles) => {
                if (articles.length === 0) {
                    // Fallback to mock data if no articles returned
                    this.news.set(this.sportsService.getMockSportsNews());
                } else {
                    this.news.set(articles);
                }
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error fetching sports news:', err);
                // Use mock data as fallback
                this.news.set(this.sportsService.getMockSportsNews());
                this.loading.set(false);
            }
        });
    }

    getTimeAgo(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 1) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            return `${diffMinutes}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else {
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}d ago`;
        }
    }

    getTeamBadgeColor(team?: string): string {
        if (!team) return '#013369'; // NFL blue

        switch (team) {
            case 'FC Barcelona':
                return '#A50044'; // Barcelona burgundy
            case 'Borussia Dortmund':
                return '#FDE100'; // Dortmund yellow
            case '1. FC Köln':
                return '#ED1C24'; // Köln red
            default:
                return '#333';
        }
    }
}
