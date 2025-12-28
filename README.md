# Corcozy 2025

A cozy New Year's Eve party planning dashboard. Claim menu items, generate shopping lists, and view step-by-step cooking instructions.

**Live at: https://nye.madfatter.lol**

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app runs on port 3030 at `http://localhost:3030`.

## Features

- **Plan Mode**: View the full menu and claim items by entering your name
- **Shop Mode**: Get a personalized shopping list based on your claimed items
- **Cook Mode**: Step-by-step instructions with cooking term tooltips

## Deployment

The app is hosted on MADSERVER and auto-deploys via git.

### To deploy changes:

```powershell
# From this repo's directory
git add . && git commit -m "Your message"
.\scripts\deploy.ps1
```

### Manual deploy:
```powershell
git push origin main
ssh madserver@192.168.1.157 "cd /d C:\Apps\corcozy-2025 && git pull && npm run build && taskkill /f /im node.exe & schtasks /run /tn \"Corcozy NYE\""
```

### Server Details
- **Location**: MADSERVER `C:\Apps\corcozy-2025`
- **Port**: 3030
- **Auto-start**: Task Scheduler "Corcozy NYE"
- **Reverse proxy**: Caddy (handles HTTPS via Let's Encrypt)
- **Domain**: nye.madfatter.lol

## Firebase Setup

Firebase Realtime Database is used for syncing claims and pantry data across devices.

### Security Rules (Applied)
```json
{
  "rules": {
    "claims": {
      ".read": true,
      "$itemId": {
        ".write": true,
        ".validate": "newData.hasChildren(['claimedBy', 'claimedAt']) && newData.child('claimedBy').isString() && newData.child('claimedBy').val().length > 0 && newData.child('claimedBy').val().length < 50"
      }
    },
    "pantry": {
      ".read": true,
      "$userName": {
        ".write": true
      }
    }
  }
}
```

## Pre-populated Claims

- Big Mike → The Meatball Mountain

Happy New Year!
