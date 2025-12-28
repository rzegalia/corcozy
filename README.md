# Corcozy 2025

A cozy New Year's Eve party planning dashboard. Claim menu items, generate shopping lists, and view step-by-step cooking instructions.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server (accessible from other devices on your network)
npm run dev

# Or build and serve production version
npm run build
npm run preview
```

The app will be available at `http://localhost:3000` (or your server's IP address).

## Features

- **Plan Mode**: View the full menu and claim items by entering your name
- **Shop Mode**: Get a personalized shopping list based on your claimed items
- **Cook Mode**: Step-by-step instructions with cooking term tooltips

## Firebase Setup (Optional - for real-time sync)

Without Firebase, the app runs in "demo mode" using local storage. Data won't sync across devices.

To enable real-time sync:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Add a web app (Settings > Your apps > Add app > Web)
4. Enable Realtime Database (Build > Realtime Database > Create Database > Start in test mode)
5. Copy `.env.example` to `.env` and fill in your Firebase config:

```bash
cp .env.example .env
# Edit .env with your Firebase credentials
```

## Running on a Home Server

```bash
# Build for production
npm run build

# Serve on all network interfaces
npm run preview
```

The `--host 0.0.0.0` flag is already configured in `vite.config.js`, so other devices on your network can access the app using your server's IP address.

## Pre-populated Claims

- Big Mike → The Meatball Mountain

Happy New Year!
