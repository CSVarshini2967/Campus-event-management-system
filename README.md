# Campus Event Management System — Reference

This is a **reference/starter structure**, not the complete project.

## Stack
- Frontend: React + Vite + Tailwind-style CSS
- Backend: Node.js + Express
- Database: MySQL

## Included
- Student dashboard UI reference
- Admin/Faculty dashboard UI reference
- Backend folder structure
- Express server setup
- MySQL connection setup
- Example route/controller structure
- MySQL schema for users, clubs, events, venues, registrations, attendance and feedback

## Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_event_db
JWT_SECRET=change_this_for_real_project
```

Run:

```bash
npm run dev
```

The backend starts at `http://localhost:5000`.

The files under `controllers/` and `routes/` are intentionally simple reference implementations/placeholders. Your team should build the actual authentication, CRUD, registration, attendance and feedback logic.
