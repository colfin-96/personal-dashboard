# Personal Dashboard# PersonalDashboard

A beautiful, responsive personal dashboard built with Angular that displays real-time information including:This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

- 🕐 Current time and date

- 🌤️ Weather information## Development server

- 📈 Stock prices

- 🚗 Traffic informationTo start a local development server, run:

## Features```bash

ng serve

### Current Widgets```

1. **Clock Widget** - Real-time clock with current dateOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

2. **Weather Widget** - Real-time weather data using Open-Meteo API (free, no API key required)

   - Auto-detects your location using browser geolocation## Code scaffolding

   - Shows temperature, humidity, wind speed, and weather conditions

3. **Stock Widget** - Mock stock data for demonstrationAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

   - Ready to integrate with real APIs

4. **Traffic Widget** - Mock traffic data```bash

   - Template for Google Maps integrationng generate component component-name

````

## Getting Started

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

### Prerequisites

```bash

- Node.js (v18 or higher recommended)ng generate --help

- pnpm (package manager)```



### Installation## Building



1. Clone or navigate to the project directory:To build the project run:

   ```bash

   cd personal-dashboard```bash

   ```ng build

````

2. Install dependencies:

   ```bashThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

   pnpm install

   ```## Running unit tests

   ```

3. Start the development server:To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

   ````bash

   pnpm start```bash

   ```ng test
   ````

````

4. Open your browser and navigate to:

   ```## Running end-to-end tests

   http://localhost:4200

   ```For end-to-end (e2e) testing, run:



## Project Structure```bash

ng e2e

````

personal-dashboard/

├── src/Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

│ ├── app/

│ │ ├── components/## Additional Resources

│ │ │ ├── dashboard/ # Main dashboard container

│ │ │ ├── clock-widget/ # Time and date displayFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

│ │ │ ├── weather-widget/ # Weather information
│ │ │ ├── stocks-widget/ # Stock prices
│ │ │ └── traffic-widget/ # Traffic information
│ │ ├── services/
│ │ │ ├── weather.ts # Weather API service
│ │ │ └── stocks.ts # Stock data service
│ │ ├── app.ts # Root component
│ │ └── app.config.ts # App configuration
│ ├── styles.scss # Global styles
│ └── index.html
└── package.json

````

## Customization

### Adding Real Stock Data

The stock widget currently uses mock data. To integrate real stock prices:

1. Sign up for a free API key from one of these providers:
   - [Alpha Vantage](https://www.alphavantage.co/) (Free tier available)
   - [Finnhub](https://finnhub.io/) (Free tier available)
   - [Yahoo Finance API](https://www.yahoofinanceapi.com/)

2. Update `src/app/services/stocks.ts`:
   ```typescript
   private apiKey = 'YOUR_API_KEY_HERE';

   getStockPrice(symbol: string): Observable<any> {
     const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;
     return this.http.get(url);
   }
````

### Adding Real Traffic Data

To integrate real traffic information:

1. Get a [Google Maps API key](https://developers.google.com/maps/documentation/javascript/get-api-key)

2. Enable the following APIs in Google Cloud Console:

   - Maps JavaScript API
   - Directions API
   - Distance Matrix API

3. Create a new service `src/app/services/traffic.ts` and implement the Google Maps integration

4. Update the traffic widget to use real data

### Customizing Appearance

All styling is in SCSS files:

- `src/styles.scss` - Global styles and widget base styles
- Component-specific styles in each `*.scss` file

To change colors, update the gradient in `src/styles.scss`:

```scss
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New Widgets

1. Generate a new component:

   ```bash
   pnpm exec ng generate component components/your-widget --skip-tests
   ```

2. Add your widget to the dashboard grid in `src/app/components/dashboard/dashboard.html`

3. Import and add to the dashboard component imports in `src/app/components/dashboard/dashboard.ts`

## API Information

### Weather API (Open-Meteo)

- **Provider**: [Open-Meteo](https://open-meteo.com/)
- **Cost**: Free
- **API Key**: Not required
- **Rate Limits**: Generous free tier
- **Features**: Weather forecasts, historical data, marine weather

### Geolocation (BigDataCloud)

- **Provider**: [BigDataCloud](https://www.bigdatacloud.com/)
- **Cost**: Free
- **API Key**: Not required
- **Usage**: Reverse geocoding for location names

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: The weather widget requires geolocation permission. Your browser will prompt you to allow location access.

## No Backend Required!

This dashboard is completely frontend-based and doesn't require you to set up or manage a backend server. All data is fetched directly from public APIs in the browser.

### Why No Backend?

- **Simpler Setup**: Just install and run - no server configuration needed
- **Easy Deployment**: Can be deployed to any static hosting (GitHub Pages, Netlify, Vercel)
- **Beginner Friendly**: Perfect if you're new to web development
- **Lower Costs**: No server hosting fees

### Future Backend Considerations

You might want to add a backend later if you need:

- API key security (hiding keys from the browser)
- Data caching to reduce API calls
- User authentication and personalization
- Storing user preferences

Popular backend options for Angular when you're ready:

- **Node.js + Express** (JavaScript/TypeScript)
- **NestJS** (TypeScript, similar structure to Angular)
- **Firebase** (Serverless, easy to start)

## Building for Production

To create an optimized production build:

```bash
pnpm run build
```

The build artifacts will be stored in the `dist/` directory.

## Available Scripts

- `pnpm start` - Start development server
- `pnpm run build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm run lint` - Lint the code

## Future Enhancements

Ideas for extending your dashboard:

- 📰 News feed widget
- 📧 Email notifications count
- 💰 Cryptocurrency prices
- 🏃 Fitness tracker integration
- 📅 Calendar events
- 🎵 Music player widget
- 🌍 World clock (multiple timezones)
- 📊 Personal analytics/habit tracker
- 🔔 Todo list widget

## Troubleshooting

### Weather widget shows "Unknown Location"

- Grant location permission when prompted by your browser
- Check browser console for any errors

### Development server won't start

- Ensure you're using Node.js v18 or higher: `node --version`
- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`

### CORS errors

- These APIs are CORS-friendly
- If you add new APIs, you may need to use a CORS proxy or implement a backend

## Contributing

Feel free to customize this dashboard to your needs! Some ideas:

1. Add your favorite APIs
2. Customize the color scheme
3. Add animations and transitions
4. Make it mobile-responsive (already responsive!)
5. Add dark mode support

## License

This project is open source and available for personal use.

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [SCSS/Sass](https://sass-lang.com/)

---

**Enjoy your personal dashboard! 🚀**
