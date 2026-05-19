# AstraExam Pro

Commercial-grade full stack online examination platform inspired by real government CBT interfaces such as SSC, Railway, Banking, CUET, JEE, and NEET portals.

## Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion + Redux Toolkit + Axios + React Router DOM + Recharts
- Backend: FastAPI + SQLAlchemy + JWT + REST APIs + WebSockets
- Database: SQLite for zero-friction local setup, PostgreSQL-ready for production, MySQL-compatible via `DATABASE_URL`
- AI: OpenAI API integration with automatic fallback generation when no API key is provided
- Deployment: Docker + Docker Compose + environment variables + PWA manifest

## Modules

- Student Panel
  - Role login/signup, OTP verification, forgot password
  - Premium dashboard, upcoming exams, history, analytics
  - Government CBT style exam workspace
  - Auto-save, timer warnings, instant result analysis
- Teacher Panel
  - Separate dashboard and exam studio
  - Create bilingual MCQ exams
  - AI question paper generation
  - Publish exams and monitor suspicious activity
- Admin Panel
  - Platform analytics
  - User governance and block/unblock actions
  - System health and risk visibility

## Security and Exam Features

- JWT authentication
- Role-based route and API protection
- Email verification and password reset with OTP
- Multi-tab detection
- Fullscreen monitoring
- Tab switch logging
- Right click and clipboard blocking
- Developer tools heuristic detection
- Suspicious activity logging with teacher/admin visibility
- Auto-submit when timer reaches zero

## Backend Structure

```text
server/
  app/
    routers/
      admin.py
      ai.py
      auth.py
      dashboard.py
      exam.py
      notifications.py
      websocket.py
    config.py
    database.py
    deps.py
    main.py
    models.py
    schemas.py
    seed.py
    security.py
    services.py
    websocket_manager.py
  requirements.txt
  Dockerfile
```

## Frontend Structure

```text
client/
  src/
    components/
    hooks/
    lib/
    pages/
    store/
    App.jsx
    main.jsx
    index.css
  public/
    manifest.json
    service-worker.js
  Dockerfile
```

## Local Development

### Backend

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python run.py
```

### Frontend

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

## Demo Credentials

- Student: `student@astraexam.com` / `Student@123`
- Teacher: `teacher@astraexam.com` / `Teacher@123`
- Admin: `admin@astraexam.com` / `Admin@123`

## AI Question Generation

Set `OPENAI_API_KEY` in `server/.env` to enable OpenAI-powered paper generation. Without a key, the platform falls back to deterministic demo generation so the workflow still works end-to-end.

## Docker

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

## Important Notes

- SQLite is the default local database for easier first run.
- For production, set `DATABASE_URL` to PostgreSQL or MySQL.
- Uploaded PDF and XLSX question imports are supported through the teacher APIs.
- WebSockets are exposed at `/ws/leaderboard/{exam_id}` and `/ws/monitor/{exam_id}`.
