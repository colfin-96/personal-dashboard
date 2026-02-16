import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';

export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    publishedAt: string;
    source: string;
    team?: string;
    league?: string;
}

@Injectable({
    providedIn: 'root',
})
export class Sports {
    constructor(private http: HttpClient) { }

    // Simple approach: Use publicly available JSON feeds
    getSoccerNews(): Observable<NewsArticle[]> {
        // Using a CORS proxy to access ESPN RSS
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const rssUrl = encodeURIComponent('https://www.espn.com/espn/rss/soccer/news');
        const url = `${corsProxy}${rssUrl}`;

        return this.http.get(url, { responseType: 'text' }).pipe(
            map(response => this.parseXMLtoArticles(response, 'ESPN Soccer', 'Soccer')),
            catchError(err => {
                console.error('Error fetching soccer news:', err);
                return of([]);
            })
        );
    }

    getNFLNews(): Observable<NewsArticle[]> {
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const rssUrl = encodeURIComponent('https://www.espn.com/espn/rss/nfl/news');
        const url = `${corsProxy}${rssUrl}`;

        return this.http.get(url, { responseType: 'text' }).pipe(
            map(response => this.parseXMLtoArticles(response, 'ESPN NFL', 'NFL')),
            catchError(err => {
                console.error('Error fetching NFL news:', err);
                return of([]);
            })
        );
    }

    private parseXMLtoArticles(xmlString: string, source: string, league: string): NewsArticle[] {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
            const items = xmlDoc.querySelectorAll('item');
            
            const articles: NewsArticle[] = [];
            items.forEach((item, index) => {
                if (index < 8) { // Limit to 8 articles per source
                    const title = item.querySelector('title')?.textContent || 'No title';
                    const description = item.querySelector('description')?.textContent || '';
                    const link = item.querySelector('link')?.textContent || '#';
                    const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
                    
                    articles.push({
                        title: this.cleanHtml(title),
                        description: this.cleanHtml(description),
                        url: link,
                        publishedAt: new Date(pubDate).toISOString(),
                        source: source,
                        league: league
                    });
                }
            });
            
            return articles;
        } catch (error) {
            console.error('Error parsing XML:', error);
            return [];
        }
    }

    // Get all sports news combined
    getAllSportsNews(): Observable<NewsArticle[]> {
        return forkJoin({
            soccer: this.getSoccerNews(),
            nfl: this.getNFLNews()
        }).pipe(
            map(results => {
                const combined = [...results.soccer, ...results.nfl];
                console.log('Fetched articles:', combined.length, combined);

                if (combined.length === 0) {
                    console.warn('No articles fetched, using mock data');
                    return this.getMockSportsNews();
                }

                // Sort by publish date, most recent first
                return combined.sort((a, b) =>
                    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                ).slice(0, 12); // Show up to 12 articles
            }),
            catchError(err => {
                console.error('Error fetching all sports news:', err);
                return of(this.getMockSportsNews());
            })
        );
    }

    private cleanHtml(html: string): string {
        if (!html) return '';
        // Remove HTML tags and decode entities
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return (tmp.textContent || tmp.innerText || '').trim();
    }

    // Mock data for demonstration purposes
    getMockSportsNews(): NewsArticle[] {
        return [
            {
                title: 'Barcelona Secures Victory in La Liga Clash',
                description: 'FC Barcelona claims three points with a dominant performance against their rivals.',
                url: '#',
                publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                source: 'ESPN',
                team: 'FC Barcelona',
                league: 'La Liga'
            },
            {
                title: 'Dortmund Advances in Champions League',
                description: 'Borussia Dortmund showcases strong form in European competition.',
                url: '#',
                publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                source: 'Sky Sports',
                team: 'Borussia Dortmund',
                league: 'Bundesliga'
            },
            {
                title: '1. FC Köln Fights for Bundesliga Position',
                description: 'The Billy Goats show determination in their latest league match.',
                url: '#',
                publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
                source: 'Kicker',
                team: '1. FC Köln',
                league: 'Bundesliga'
            },
            {
                title: 'NFL Playoffs: Conference Championships Preview',
                description: 'The road to the Super Bowl narrows as teams prepare for crucial matchups.',
                url: '#',
                publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
                source: 'NFL.com',
                league: 'NFL'
            },
            {
                title: 'NFL Star Players to Watch This Season',
                description: 'Key athletes making an impact across the league.',
                url: '#',
                publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
                source: 'The Athletic',
                league: 'NFL'
            }
        ];
    }
}
