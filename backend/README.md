# ⚙️ Sajilo Sahayata – Backend

**Disaster Reporting & Coordination API**

[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-Framework-lightgrey)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## 📖 Overview

The backend of **Sajilo Sahayata** powers real-time disaster reporting and coordination.  
It provides APIs for user authentication, incident reporting, and alert broadcasting, ensuring citizens and local governments can respond quickly to emergencies.

---

## Features

- **User Authentication** — Secure login and signup using JWT
- **Incident Reporting** — Citizens can submit reports with geolocation & media
- **Real-Time Alerts** — Broadcast alerts to frontend dashboards
- **Role-Based Access Control** — Separate access for citizens and admins
- **Data Management** — Store reports, users, and alerts in MongoDB
- **Middleware Security** — Authentication and admin guards
- Modular structure with controllers, models, and routes

---

## Tech Stack

- **Runtime:** Node.js 18
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT
- **Realtime:** Socket.IO (planned)

---

## Quick Start

### 1. Clone Repository

````bash
git clone <repository-url>
cd sajilo-sahayata/backend
npm install
npm run dev

## Repository Structure
<pre lang="plaintext"> ```
sajilo-sahayata-backend/
📁 src
  📄 env.ts
  📄 express.d.ts
  📄 main.ts
  📁 routes
    📄 alertRoutes.ts
    📄 authRoutes.ts
    📄 reportRoutes.ts
  📁 models
    📄 alertModel.ts
    📄 reportModel.ts
    📄 userModel.ts
  📁 middlewares
    📄 authenticateToken.ts
    📄 requireAdmin.ts
  📁 controllers
    📄 alertController.ts
    📄 authController.ts
    📄 reportController.ts
  📁 config
    📄 db.ts

``` </pre>
````

## Create a .env file in /backend with:

```

PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key

```

## Run Server

```
npm run dev

```


