# 🌐 Sajilo Sahayata

> **From Alert to Action — Instantly.**  
> A Next-Generation Disaster Reporting, Analytics, and Coordination Platform.

[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-blue?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

---

## 🚀 The Vision

**Sajilo Sahayata** bridges the critical time gap between an emerging disaster and effective governmental response. By providing a unified hub for citizens, first responders, and municipal officers, our platform guarantees that panic turns into procedure. We deliver **faster alerts, synchronized coordination, and localized immediate actions** when moments matter most.

### How It Revolutionizes Emergency Response

When access counts, precision saves lives. The system autonomously detects a user's location, instantly binding them to their respective local government node. This dynamically provisions region-specific emergency protocols, contact networks, and live crisis alerts directly to their dashboard.

**Key capabilities include:**
- 🛡️ **Real-Time Citizen Dashboard:** A modernized interface to track nearby perils, log incidents, and remain shielded with localized live updates.
- 🗺️ **Live Geospatial Mapping:** A fully interactive map overlaying incident vectors across geographies to trace disaster boundaries vividly.
- ⚡ **Centralized Command Center (Admin):** An isolated, high-security dashboard enabling localized administrators to visualize analytics, manage alerts, and dispatch resources preemptively.

---

## 🎯 High-Impact Features

- 🚨 **Real-Time Alert Systems:** Pushed notifications to dispatch command and endangered citizens simultaneously.
- 🔒 **Role-Based Workflows:** Completely isolated and secure portal pipelines strictly dividing normal Users and System Administrators.
- 🌍 **Multilingual Localization:** Breaking the language barrier with deep local language integration.
- 📊 **Big Data Visualizations:** Granular charts and analytic widgets feeding incident trends to decision-makers.
- 🛡️ **End-to-End Auth Pipelines:** Industry-standard encrypted pathways ensuring airtight and untampered operations.

---

## 🛠 Technology Stack

- **Frontend Architecture:** React.js 18, Vite, Framer Motion, Tailwind CSS
- **Backend Architecture:** Node.js, Express.js (REST APIs)
- **Database & Asset Storage:** MongoDB (GeoJSON spatial maps), Cloudinary
- **Mapping & Analytics:** React-Leaflet, Chart.js, Zustand (State Management)

---

## 📂 Architecture Blueprint

```text
Sajilo-Sahayata/
├── frontend/       # Vite React SPA (User & Admin Portals)
├── backend/        # Express Node.js Server (API & Auth Logic)
└── README.md       # Project Documentation
```

---

## 📸 System Overview

<h3>Platform Branding</h3>
<div style="display: flex; gap: 10px; align-items: center; margin-bottom: 20px;">
  <img src="./assets/images/logo.jpg" alt="Logo" width="150"/>
  <img src="./assets/images/logo-full.jpg" alt="Full Logo" width="150"/>
</div>

<details>
  <summary><strong>📱 Citizen Portal (Click to Expand)</strong></summary>
  <br />
  <div style="display: flex; flex-wrap: wrap; gap: 10px;">
    <img src="./assets/screenshots/welcome.png" alt="Welcome Portal" width="180"/>
    <img src="./assets/screenshots/signup.png" alt="Citizen Registration" width="180"/>
    <img src="./assets/screenshots/signin.png" alt="Secure Sign In" width="180"/>
    <img src="./assets/screenshots/home.png" alt="Dashboard Hub" width="180"/>
    <img src="./assets/screenshots/report.png" alt="Incident Reporting" width="180"/>
    <img src="./assets/screenshots/map.png" alt="Geospatial Map" width="180"/>
    <img src="./assets/screenshots/profile.png" alt="User Profile" width="180"/>
  </div>
</details>

<br />

<details>
  <summary><strong>🛡️ Command Center / Admin Panel (Click to Expand)</strong></summary>
  <br />
  <div style="display: flex; flex-direction: column; gap: 15px;">
    <img src="./assets/screenshots/admin-dashboard.png" alt="Analytics Dashboard" width="100%"/>
    <img src="./assets/screenshots/manage-users.png" alt="User Management" width="100%"/>
    <img src="./assets/screenshots/manage-alerts.png" alt="Alert Broadcaster" width="100%"/>
    <img src="./assets/screenshots/manage-reports.png" alt="Log Management" width="100%"/>
  </div>
</details>

---

## ⚡ Quick Start Guide

### Prerequisites
- NodeJS (v18+)
- MongoDB (Atlas URI or Local Daemon)

### 1. Retrieve the Source
```bash
git clone <repository-url>
cd sajilo_sahayata
```

### 2. Configure Environments (Critical)
Protect your keys. Create a `.env` file within the `backend/` directory. **Never commit this file.**
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
JWT_SECRET=generate_a_strong_random_hash
ADMIN_SECRET=secure_passcode_to_allow_admin_creation
CLOUDINARY_URL=cloudinary://<keys>
```

### 3. Build Options & Server Ignition

**Terminal A (Backend Engine):**
```bash
cd backend
npm install
npm run dev
```

**Terminal B (Frontend Portal):**
```bash
cd frontend
npm install
npm run dev
```

### Need Support?
For any core system issues or feature requests, please drop a detailed ticket via the **GitHub Issues** tab to maintain security and centralized tracking.

---

## 🤝 Open Source Contribution

Your contributions scale the impact. We strictly welcome PRs fixing bugs, accelerating performance, or expanding geospatial nodes!

1. Fork the Project Repository.
2. Form a Secure Branch (`git checkout -b feature/ImpactfulAddition`).
3. Commit neatly (`git commit -m "feat: adding new interactive capability"`).
4. Push the branch (`git push origin feature/ImpactfulAddition`).
5. Open a **Pull Request**.

> Note: If proposing a massive architectural change, kindly drop an Issue first for technical review.

---

## 🌟 Acknowledgements

Crafted with dedication by the Sajilo Sahayata collective. Special recognition to our supervising nodes & these monumental open-source tools: React-Leaflet, TailwindCSS, Framer Motion, and MongoDB.

### Final Mission Statement
**Sajilo Sahayata** is more than code—it is an infrastructure of resilience. Designed scalable, secure, and ready to mobilize cities into safer tomorrows. 

---
