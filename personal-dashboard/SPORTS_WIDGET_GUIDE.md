# Sports Widget Documentation

## Overview

The Sports Widget displays news for your favorite soccer teams and NFL updates.

## Tracked Teams

- **FC Barcelona** (La Liga)
- **Borussia Dortmund** (Bundesliga)
- **1. FC Köln** (Bundesliga)
- **NFL** (American Football)

## Current Setup

The widget is currently using **mock data** for demonstration purposes. This allows you to see the widget working without needing an API key.

## Enabling Real News (Optional)

To display real sports news, you'll need to set up a NewsAPI account:

### Step 1: Get a NewsAPI Key

1. Visit [https://newsapi.org/](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard

### Step 2: Add the API Key to Your Environment

1. Open `src/environments/environment.development.ts`
2. Replace the empty `newsApiKey` value with your actual API key:
   ```typescript
   newsApiKey: 'your_actual_api_key_here';
   ```

### Step 3: Update the Widget Component

1. Open `src/app/components/sports-widget/sports-widget.ts`
2. In the `fetchSportsNews()` method, uncomment the real API code block
3. Comment out or remove the mock data section

### Step 4: Import Required RxJS Operators

Add this import at the top of the file:

```typescript
import { forkJoin } from 'rxjs';
```

## Features

- Live news updates from multiple sources
- Team-specific color coding
- Time-ago formatting for articles
- Responsive scrollable news feed
- Automatic sorting by publication date

## Customization

### Adding More Teams

Edit the `soccerTeams` array in `sports-widget.ts`:

```typescript
soccerTeams = ['FC Barcelona', 'Borussia Dortmund', '1. FC Köln', 'Your Team'];
```

### Changing Team Colors

Update the `getTeamBadgeColor()` method in `sports-widget.ts` and the SCSS file.

### Adjusting News Count

In the real API code, change `.slice(0, 2)` to show more/fewer articles per team.

## API Limitations

- NewsAPI free tier: 100 requests per day
- Results may be delayed by up to 15 minutes on free tier
- Consider caching results to reduce API calls

## Troubleshooting

- **No news showing**: Check that your API key is correct
- **CORS errors**: NewsAPI requires server-side requests in production
- **Rate limit errors**: You've exceeded your daily quota

## Future Improvements

- Add refresh button
- Implement caching
- Add link to full articles
- Filter by specific competitions
- Add team logos
