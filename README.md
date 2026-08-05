# Cohort-SubhankarDasMohanty-25E113C38

A small two-part web application (React frontend + Node.js/Express backend) used for a cohort assignment. The app provides a registration UI and a simple PostgreSQL-backed API for storing registrations.

## Features
- React-based registration form (frontend/src/components/RegisterForm.jsx)
- Express API (backend/server.js)
- PostgreSQL connection helper and DB init script (backend/models/connection.js, backend/controllers/initDb.js)
- Simple static assets and styles (frontend/index.html, frontend/src/*.css)

## Tech stack
- Languages: JavaScript, CSS, HTML
- Backend: Node.js + Express
- Database: PostgreSQL (via node-postgres/pg)
- Frontend: React + Vite

## Quick start

Prerequisites
- Node.js (16+ recommended)
- npm
- PostgreSQL (if you want persistence)

1. Clone the repo
   git clone https://github.com/subhankardasmohanty/Cohort-SubhankarDasMohanty-25E113C38.git
   cd Cohort-SubhankarDasMohanty-25E113C38

2. Start the backend
   cd backend
   npm install
   # create a backend/.env with the DB connection and any env vars referenced by server.js
   npm start

3. Start the frontend (development)
   cd ../frontend
   npm install
   npm run dev
   # or open frontend/index.html directly for a static demo

## Environment variables (example)
Create `backend/.env` with at least the database connection. Example keys used commonly:

```
DATABASE_URL=postgres://user:password@localhost:5432/dbname
PORT=8080
```
(Adjust names to match what `server.js` expects.)

## Project structure
- backend/ — Express server, DB helpers, package.json and start script
- frontend/ — React + Vite app, components, static HTML & CSS

## Development notes
- backend/package.json includes `start: node server.js`. Add a dev script using nodemon if you want auto-restart during development.
- controllers/initDb.js appears to contain DB initialization logic; run it once (or the server may run it on startup if implemented) to create tables.

## Contributing
- Fork the repo, create a branch, make changes, push, and open a PR.
- Keep commits small and descriptive.

## License
This project currently has no license file in the repository — add a LICENSE if you want to specify reuse/redistribution terms.

## Contact
Created by Subhankar Das Mohanty — see the repository for details.
