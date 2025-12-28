# Network Setup for Corcozy 2025

## To access from other devices on your network:

### 1. Find your server's IP
```bash
ipconfig
```
Look for `IPv4 Address` under your main network adapter (usually Ethernet or Wi-Fi).

### 2. Open firewall port
Windows Defender Firewall → Inbound Rules → New Rule:
- Port → TCP → 3001 (or whatever port the app runs on)
- Allow the connection
- All profiles (Domain, Private, Public)
- Name: "Corcozy 2025"

### 3. Disable VPN (if needed)
NordVPN and other VPNs can block local network traffic. Either:
- Disconnect VPN temporarily, or
- Enable "Local Network Discovery" in VPN settings

### 4. Access from other devices
Open browser on phone/tablet/other computer:
```
http://YOUR_IP:PORT
```
Example: `http://192.168.1.237:3001`

**Note:** Devices must be on the same WiFi network.

## Running as a service (keep it running)

For always-on hosting, consider:
1. Build for production: `npm run build`
2. Use `npm run preview` or serve with nginx
3. Use PM2 or Windows Task Scheduler to auto-start

## Current ports
- 3001 (configured in vite.config.js)
- May auto-increment to 3002, 3003 if port is busy
