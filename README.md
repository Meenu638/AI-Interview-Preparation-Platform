# AI Interview Preparation Platform

A full-stack MERN application for practicing technical, HR, behavioral, and coding interviews with AI-generated questions and AI-scored feedback (Google Gemini).

## Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Framer Motion, Recharts, Monaco Editor, React Webcam
- **Backend:** Node.js, Express, MongoDB/Mongoose, JWT (access + refresh), bcrypt, Multer, Cloudinary, Helmet, CORS, express-validator
- **AI:** Google Gemini API for question generation, answer evaluation, and resume parsing
- **Speech:** Browser Web Speech API (no external service required)

## Project Structure

```
ai-interview-platform/
├── backend/
│   ├── config/          # DB, Cloudinary, Gemini client setup
│   ├── models/           # 12 Mongoose schemas
│   ├── repositories/     # DB query layer
│   ├── services/         # Business logic (auth, interview, AI, etc.)
│   ├── prompts/          # Gemini prompt templates
│   ├── controllers/      # Thin request handlers
│   ├── routes/           # Express routers
│   ├── middlewares/      # auth, error, validation, rate limiting, uploads
│   ├── validators/       # express-validator rule sets
│   ├── utils/            # ApiError, ApiResponse, token helpers
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── pages/         # Route-level pages
        ├── components/    # ui / layout / interview subfolders
        ├── layouts/        # Auth & Dashboard shells
        ├── context/       # Auth, Theme, Notification providers
        ├── services/      # Axios API modules
        ├── hooks/         # useSpeechToText, useTimer
        └── utils/
```

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

Required environment variables (`.env`):

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Long random strings for signing tokens |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials for avatar/resume uploads |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Optional — email is skipped (logged only) if unset |

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:5000` in development (see `vite.config.js`).

## Deployment

- **Frontend → Vercel:** set build command `npm run build`, output dir `dist`. Set `VITE_API_BASE_URL` if the API isn't proxied.
- **Backend → Render:** set start command `npm start`, add all backend env vars in the Render dashboard.
- **Database → MongoDB Atlas:** whitelist Render's outbound IPs (or `0.0.0.0/0` for simplicity) and use the SRV connection string as `MONGODB_URI`.

## Notes on this build

- All AI features (question generation, answer scoring, resume parsing) require a valid `GEMINI_API_KEY` — the server will throw a clear 500 error if it's missing rather than failing silently.
- Avatar and resume uploads require Cloudinary credentials.
- Email (password reset, welcome mail) is optional in development — if SMTP isn't configured, the email service logs to the console instead of sending, so registration/reset flows still work end-to-end without SMTP set up.
