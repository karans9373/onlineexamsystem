# AstraExam Cloud

A premium, futuristic online examination system concept built as a portfolio-grade EdTech SaaS experience.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + GSAP + Recharts
- Backend: Flask REST API with JWT-ready authentication scaffolding
- Data Layer: MongoDB-ready configuration with clean environment variables
- Product Features: Role-based dashboards, live exam UX, analytics, leaderboard, certificates, AI assistant, support surfaces

## Project Structure

```text
astraexam/
  client/   # React frontend
  server/   # Flask API
  docs/     # Architecture notes or future assets
```

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

## Backend Setup

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

## API Endpoints Included

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `GET /api/dashboard/<role>`
- `GET /api/notifications`
- `GET /api/exams`
- `GET /api/leaderboard`
- `GET /api/courses`

## Notes

- The UI is intentionally productized with premium gradients, glassmorphism, motion, chart-heavy dashboards, and multi-role navigation.
- The backend is scaffolded for JWT auth, Google OAuth integration, MongoDB wiring, and future realtime or Node-based services if needed.
- Replace the mock datasets with database-backed services as the next implementation step.
