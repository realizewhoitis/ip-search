# IP Geolocation Aggregator (v1.0)

A lightweight, browser-based tool for IP intelligence gathering, designed for high accuracy and exigent circumstance investigations.

## Features

### 🔍 Multi-Source IP Lookup

Aggregates data from multiple top-tier IP geolocation APIs to provide a "Consensus" rating.

- **Primary Sources**: `ipinfo.io`, `ip-api.com`, `ipapi.co`
- **Consensus Badge**: Visually indicates if sources agree on the location.

### 🗺️ Visual Intelligence

- **Interactive Map**: Built with Leaflet.js (OpenStreetMap). Automatically flies to the detected coordinates.
- **Precision Indicators**: Draws a 5km radius circle to visually represent the approximate nature of infrastructure IPs.
- **County Data**: Extracts US County / District data where available.

### 📞 Exigent Contact Directory

- **Carrier Search**: Toggle to "Carrier Name" mode to search for major ISPs (Google, Comcast, Verizon, etc.).
- **Direct Contacts**: Instantly retrieves verified **Abuse/Law Enforcement** contact numbers and emails for exigent circumstances.
- **RDAP Integration**: Automatically queries ARIN/RIPE for registered abuse contacts for specific IPs.

## Usage

1. **Open** `index.html` in any modern web browser.
2. **Select Mode**:
   - **IP Address**: Enter an IPv4 or IPv6 address.
   - **Carrier Name**: Enter an ISP name (e.g., "Comcast").
3. **View Results**:
   - See aggregated location data, map visualization, and ISP contact details.

## Disclaimer
>
> **CRITICAL**: This tool identifies **Network Infrastructure** (ISP endpoints), NOT physical caller locations. It is intended for investigational use only.

## License

MIT
