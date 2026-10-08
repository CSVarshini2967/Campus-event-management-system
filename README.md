# Campus Event Management System (FSD Project)

A production-grade, full-stack event management platform for colleges and universities.

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, React Router 7, Axios, Lucide React, Modern CSS Design System
- **Backend**: Node.js, Express.js, MySQL2 (Connection Pool), JWT, BcryptJS, Express-Validator
- **Database**: MySQL

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
Make sure MySQL server is running (e.g., via XAMPP, MySQL Workbench, or local service).

Import the database schema and seed data:
```bash
# Log in to MySQL CLI and run:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
*Or open `database/schema.sql` followed by `database/seed.sql` inside MySQL Workbench / phpMyAdmin and execute.*

---

### 2. Backend Setup
1. Open a terminal in `/backend`:
   ```bash
   cd backend
   npm install
   ```
2. Configure `.env`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=campus_event_db
   JWT_SECRET=super_secret_jwt_key_for_campus_events_2026
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
3. Start backend development server:
   ```bash
   npm run dev
   ```
   API runs at: `http://localhost:5000`

---

### 3. Frontend Setup
1. Open a terminal in `/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Configure `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start frontend development server:
   ```bash
   npm run dev
   ```
   App runs at: `http://localhost:5173`

---

## 🔑 Pre-seeded Test Accounts

All accounts share the default password: **`password123`**

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campusevents.com` | `password123` | Full control: events, clubs, venues, stats, roster, all CRUD |
| **Organiser** | `organiser@campusevents.com` | `password123` | Create/manage assigned events, view roster & mark attendance |
| **Student** | `sreevarshini@college.edu` | `password123` | Browse events, register/cancel, view attendance & submit feedback |
| **Student** | `rahul.kumar@college.edu` | `password123` | Browse events, register/cancel, view attendance & submit feedback |

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student or organiser | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Bearer Token |

### 📅 Events (`/api/events`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | List events with filters & search (`q`, `category`, `status`, `date`) | Public |
| `GET` | `/api/events/:id` | Get single event details with registration status | Optional |
| `POST` | `/api/events` | Create new event (with venue collision check) | Organiser / Admin |
| `PUT` | `/api/events/:id` | Update event details | Organiser / Admin |
| `DELETE`| `/api/events/:id` | Delete event | Organiser / Admin |

### 📝 Registrations (`/api/registrations` or `/api/events/:id/register`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/events/:id/register` | Register student for an event | Student |
| `DELETE`| `/api/events/:id/register` | Cancel student's registration | Student |
| `GET` | `/api/registrations/my` | Get current student's registered events | Student |
| `GET` | `/api/events/:id/registrations`| View registered students list for an event | Organiser / Admin |

### 📋 Attendance (`/api/attendance`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/mark` | Mark single or bulk attendance (`present`/`absent`) | Organiser / Admin |
| `GET` | `/api/attendance/my` | Student attendance records | Student |
| `GET` | `/api/attendance/event/:eventId`| Event attendance roster | Organiser / Admin |

### ⭐ Feedback & Reviews (`/api/feedback`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/feedback/:eventId` | Submit event rating (1-5) and comments | Registered Student |
| `GET` | `/api/feedback/event/:eventId` | View event ratings and attendee feedback | Public |

### 🏛️ Clubs & Venues
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/clubs` | List all clubs & student bodies | Public |
| `POST` | `/api/clubs` | Create club | Organiser / Admin |
| `GET` | `/api/venues` | List campus venues & capacity | Public |
| `POST` | `/api/venues` | Create venue | Organiser / Admin |

### 📊 Statistics (`/api/stats`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stats/dashboard` | Dashboard metrics (events, counts, attendance %) | Public |

---

## 🧪 cURL Testing Examples

### 1. User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@campusevents.com","password":"password123"}'
```

### 2. Fetch Events
```bash
curl -X GET "http://localhost:5000/api/events?category=Technical"
```

### 3. Register for Event (Student)
```bash
curl -X POST http://localhost:5000/api/events/1/register \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```
