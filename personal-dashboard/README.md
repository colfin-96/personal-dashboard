# Personal Dashboard

A beautiful, responsive personal dashboard built with Angular that displays real-time information.

## Features

- 🕐 **Clock Widget** - Real-time clock with current date
- 🌤️ **Weather Widget** - Live weather data using Open-Meteo API (free, no API key required)
- 📈 **Stock Widget** - Stock prices display (currently mock data, ready for API integration)
- 🚗 **Traffic Widget** - Traffic information (currently mock data, template for Google Maps)

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start
```

Then open http://localhost:4200 in your browser.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dashboard/          # Main dashboard container
│   │   ├── clock-widget/       # Time and date display
│   │   ├── weather-widget/     # Weather information
│   │   ├── stocks-widget/      # Stock prices
│   │   └── traffic-widget/     # Traffic information
│   ├── services/
│   │   ├── weather.ts          # Weather API service
│   │   └── stocks.ts           # Stock data service
│   ├── app.ts                  # Root component
│   └── app.config.ts           # App configuration
├── styles.scss                 # Global styles
└── index.html
```

## Adding Real APIs

See [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) for detailed instructions on integrating:

- Real stock data (Alpha Vantage, Finnhub)
- Google Maps for traffic
- Cryptocurrency prices
- News feeds

## Customization

### Changing Colors

Update `src/styles.scss`:

```scss
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adding New Widgets

```bash
pnpm exec ng generate component components/your-widget --skip-tests
```

Then add it to `src/app/components/dashboard/dashboard.html`

## APIs Used

### Weather API (Open-Meteo)

- Provider: https://open-meteo.com/
- Cost: Free, no API key required
- Features: Current weather, forecasts, historical data

### Geolocation (BigDataCloud)

- Provider: https://www.bigdatacloud.com/
- Cost: Free, no API key required
- Usage: Reverse geocoding for location names

## Available Commands

- `pnpm start` - Start development server
- `pnpm run build` - Build for production
- `pnpm test` - Run unit tests
- `pnpm run lint` - Lint the code

## Building for Production

```bash
pnpm run build
```

Build artifacts will be in `dist/personal-dashboard/browser/`

## Deployment Options

- **GitHub Pages** - Free static hosting
- **Netlify** - Auto-deploy from GitHub
- **Vercel** - Optimized for Angular

## No Backend Required

This dashboard is completely frontend-based:

- No server to configure
- Uses free public APIs
- Easy to deploy
- Perfect for beginners

## Future Enhancement Ideas

- News feed widget
- Cryptocurrency prices
- Fitness tracker integration
- Calendar events
- World clock (multiple timezones)
- Analytics/habit tracker

## Troubleshooting

### Weather widget shows "Unknown Location"

Allow location permission when prompted by your browser.

### Development server won't start

```bash
rm -rf node_modules
pnpm install
pnpm start
```

## Resources

- [Angular Documentation](https://angular.dev)
- [Angular CLI](https://angular.dev/tools/cli)
- [TypeScript Documentation](https://www.typescriptlang.org/)

---

**Enjoy your personal dashboard!** 🚀
