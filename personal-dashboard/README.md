# Personal Dashboard# Personal Dashboard# PersonalDashboard

A beautiful, responsive personal dashboard built with Angular that displays real-time information including:A beautiful, responsive personal dashboard built with Angular that displays real-time information including:This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.4.

- 🕐 Current time and date

- 🌤️ Weather information- 🕐 Current time and date

- 📈 Stock prices

- 🚗 Traffic information- 🌤️ Weather information## Development server

## Quick Start- 📈 Stock prices

````bash- 🚗 Traffic informationTo start a local development server, run:

# Install dependencies

pnpm install## Features```bash



# Start development serverng serve

pnpm start

```### Current Widgets```



Then open http://localhost:4200 in your browser.1. **Clock Widget** - Real-time clock with current dateOnce the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.



## Features2. **Weather Widget** - Real-time weather data using Open-Meteo API (free, no API key required)



### Current Widgets   - Auto-detects your location using browser geolocation## Code scaffolding



1. **Clock Widget** - Real-time clock with current date   - Shows temperature, humidity, wind speed, and weather conditions

2. **Weather Widget** - Real-time weather data using Open-Meteo API (free, no API key required)

   - Auto-detects your location using browser geolocation3. **Stock Widget** - Mock stock data for demonstrationAngular CLI includes powerful code scaffolding tools. To generate a new component, run:

   - Shows temperature, humidity, wind speed, and weather conditions

3. **Stock Widget** - Mock stock data for demonstration   - Ready to integrate with real APIs

   - Ready to integrate with real APIs

4. **Traffic Widget** - Mock traffic data4. **Traffic Widget** - Mock traffic data```bash

   - Template for Google Maps integration

   - Template for Google Maps integrationng generate component component-name

## Project Structure

````

````

src/## Getting Started

├── app/

│   ├── components/For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

│   │   ├── dashboard/          # Main dashboard container

│   │   ├── clock-widget/       # Time and date display### Prerequisites

│   │   ├── weather-widget/     # Weather information

│   │   ├── stocks-widget/      # Stock prices```bash

│   │   └── traffic-widget/     # Traffic information

│   ├── services/- Node.js (v18 or higher recommended)ng generate --help

│   │   ├── weather.ts          # Weather API service

│   │   └── stocks.ts           # Stock data service- pnpm (package manager)```

│   ├── app.ts                  # Root component

│   └── app.config.ts           # App configuration

├── styles.scss                 # Global styles

└── index.html### Installation## Building

````

## Adding Real APIs

1. Clone or navigate to the project directory:To build the project run:

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed instructions on:

- Adding real stock data (Alpha Vantage, Finnhub) ```bash

- Integrating Google Maps for traffic

- Adding cryptocurrency prices cd personal-dashboard```bash

- Adding news feeds

  ```ng build

  ```

## Customization

`````

### Changing Colors

2. Install dependencies:

Update the gradient in `src/styles.scss`:

```scss   ```bashThis will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

body {

  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);   pnpm install

}

```   ```## Running unit tests



### Adding New Widgets   ```



```bash3. Start the development server:To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

pnpm exec ng generate component components/your-widget --skip-tests

```   ````bash



Then add it to the dashboard in `src/app/components/dashboard/dashboard.html`   pnpm start```bash



## API Information   ```ng test

`````

### Weather API (Open-Meteo)

- **Provider**: [Open-Meteo](https://open-meteo.com/)````

- **Cost**: Free, no API key required

- **Features**: Current weather, forecasts, historical data4. Open your browser and navigate to:

### Geolocation (BigDataCloud) ```## Running end-to-end tests

- **Provider**: [BigDataCloud](https://www.bigdatacloud.com/)

- **Cost**: Free, no API key required http://localhost:4200

- **Usage**: Reverse geocoding for location names

  ```For end-to-end (e2e) testing, run:

  ```

## Available Scripts

- `pnpm start` - Start development server

- `pnpm run build` - Build for production## Project Structure```bash

- `pnpm test` - Run unit tests

- `pnpm run lint` - Lint the codeng e2e

## Building for Production````

`````bashpersonal-dashboard/

pnpm run build

```├── src/Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.



Build artifacts will be in `dist/personal-dashboard/browser/`│ ├── app/



## Deployment│ │ ├── components/## Additional Resources



This app can be deployed to:│ │ │ ├── dashboard/ # Main dashboard container

- **GitHub Pages** - Free static hosting

- **Netlify** - Auto-deploy from GitHub│ │ │ ├── clock-widget/ # Time and date displayFor more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

- **Vercel** - Optimized for Angular

│ │ │ ├── weather-widget/ # Weather information

## No Backend Required!│ │ │ ├── stocks-widget/ # Stock prices

│ │ │ └── traffic-widget/ # Traffic information

This dashboard is completely frontend-based:│ │ ├── services/

- ✅ No server to configure│ │ │ ├── weather.ts # Weather API service

- ✅ Uses free public APIs│ │ │ └── stocks.ts # Stock data service

- ✅ Easy to deploy│ │ ├── app.ts # Root component

- ✅ Perfect for beginners│ │ └── app.config.ts # App configuration

│ ├── styles.scss # Global styles

## Future Enhancement Ideas│ └── index.html

└── package.json

- 📰 News feed widget

- 💰 Cryptocurrency prices````

- 🏃 Fitness tracker integration

- 📅 Calendar events## Customization

- 🌍 World clock (multiple timezones)

- 📊 Analytics/habit tracker### Adding Real Stock Data



## TroubleshootingThe stock widget currently uses mock data. To integrate real stock prices:



### Weather widget shows "Unknown Location"1. Sign up for a free API key from one of these providers:

- Allow location permission in your browser   - [Alpha Vantage](https://www.alphavantage.co/) (Free tier available)

   - [Finnhub](https://finnhub.io/) (Free tier available)

### Development server won't start   - [Yahoo Finance API](https://www.yahoofinanceapi.com/)

```bash

rm -rf node_modules2. Update `src/app/services/stocks.ts`:

pnpm install   ```typescript

pnpm start   private apiKey = 'YOUR_API_KEY_HERE';

`````

getStockPrice(symbol: string): Observable<any> {

## Resources const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`;

     return this.http.get(url);

- [Angular Documentation](https://angular.dev) }

- [Angular CLI](https://angular.dev/tools/cli)````

- [TypeScript Documentation](https://www.typescriptlang.org/)

### Adding Real Traffic Data

---

To integrate real traffic information:

**Enjoy your personal dashboard! 🚀**

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
