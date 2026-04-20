# SCOS – Backend (Exercise 2)

## Overview

This backend service is part of the SCOS Exercise 2 project. It provides REST APIs for authentication, institute selection, role management, and user-institute-role mapping.

The backend is built using Node.js and Express, and it interacts with a PostgreSQL database hosted on Render.

---

## Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Render (Deployment)

---

## Folder Structure

```id="a8x3kf"
src/
├── config/
│   └── db.js                # Database connection
│
├── constants/              # Static values and configurations
│
├── controllers/
│   ├── auth.controller.js
│   ├── institute.controller.js
│   ├── mapping.controller.js
│   ├── role.controller.js
│   ├── tenant.controller.js
│   └── user.controller.js
│
├── db/
│   └── query.js            # SQL queries
│
├── helpers/
│   └── errorHandler.js     # Error handling utilities
│
├── middleware/            # Custom middleware
│
├── models/
│   ├── authModel.js
│   ├── instituteModel.js
│   ├── mappingModel.js
│   ├── roleModel.js
│   ├── tenantModel.js
│   └── userModel.js
│
├── responses/             # Standard API responses
│
├── route_manager/
│   └── routeManager.js    # Central route handler
│
├── routes/
│   ├── auth.route.js
│   ├── institute.route.js
│   ├── mapping.route.js
│   ├── role.route.js
│   ├── tenant.route.js
│   └── user.route.js
│
├── utils/                 # Utility functions
│
├── app.js                 # Main application entry
└── server.js              # Server bootstrap
```

---

## Core Functionality

* User authentication
* Institute selection
* Role selection
* User-Institute-Role mapping
* Dynamic flow control based on user data

---

## API Endpoints

### Authentication

* POST /api/auth/login
* POST /api/auth/select-institute
* POST /api/auth/select-role

### Other Modules

* /api/users
* /api/institutes
* /api/roles
* /api/mappings
* /api/tenants

---

## Database

* PostgreSQL hosted on Render
* Tables include:

  * users
  * institutes
  * roles
  * tenants
  * user_institute_roles (mapping table)

---

## Environment Variables

Create a `.env` file:

```env id="2r4z9p"
PORT=5000
DATABASE_URL=your_render_database_url
```

---

## Running Locally

```id="t3l9fn"
npm install
npm run dev
```

Server runs on:

```id="p5x8jd"
http://localhost:5000
```

---

## Deployment

* Backend is deployed on Render
* Connected to PostgreSQL database (Render)

Live API:

```id="l0c2vw"
https://scos-backend-9bxv.onrender.com/api
```

---

## Key Features

* Modular architecture (controllers, models, routes)
* Centralized route management
* Clean separation of concerns
* Scalable database structure
* Dynamic user flow handling

---

## Notes

* CORS is enabled for frontend communication
* Render free tier may cause initial delay (cold start)
* API follows RESTful design principles

---

## Author

Bhushan Jatgade

---

## Acknowledgement

I would like to thank Ayush B Sir, Shivani Ma'am, and the entire team for their guidance and support throughout this project.

---

## Conclusion

This backend demonstrates a structured and scalable API architecture with proper separation of concerns, database integration, and real-world deployment using Render.
