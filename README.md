# Grid Guard — EV Charging Reservation & Smart Grid Management Platform

> **“Charge smarter. Reserve faster. Drive further.”**

Grid Guard is a web application designed to solve EV charging availability, reservation conflicts, waiting time, station discovery, charger management, and charging decisions for Chennai, Tamil Nadu, India.

---

## Key Features

- **EV User Portal:** Real-time charging map, station search & filters, 5-step slot reservation, live battery telemetry, smart recommendations, 6-digit OTP verification, active session tracking, virtual queue, and GST tax invoices.
- **Station Owner Portal:** Hub overview, real-time bay controls (C01–C06), 10-minute grace window tracking, walk-in lock protection, live power draw monitoring, queue allocation, and Recharts analytics (revenue, utilization, 24-hour demand forecasting).
- **Platform Administrator Portal:** City-wide Chennai grid command, 11 station hubs, 66 ports, conflict resolution engine, user directory, downloadable audit logs, and load shedding controls.
- **Walk-in Conflict Protection:** Electronic hardware locks prevent walk-in customers from taking chargers reserved by online users (`CS-20261007-4821`).

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, React Router v7
- **Maps:** Leaflet & OpenStreetMap (with optional Mapbox fallback via `VITE_MAPBOX_TOKEN`)
- **Analytics:** Recharts
- **Icons:** Lucide React

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run local development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

---

## License

MIT License
