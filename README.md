# StadiumMind AI

**The AI Operating System for Smart Stadiums**

StadiumMind AI is a production-style hackathon project for FIFA World Cup 2026 stadium operations. It combines a Next.js operations console, an Express API, real-time crowd updates, contextual AI reasoning, accessibility-aware routing, volunteer coordination, emergency response, and sustainability intelligence.

## Challenge Vertical: Stadium Operations Manager

**Chosen Persona:** Stadium Operations Manager responsible for real-time crowd management, safety monitoring, and operational decision-making during FIFA World Cup 2026 matches.

**Problem Statement:** Stadium operators need real-time intelligence to make split-second decisions about crowd flow, emergency response, and resource allocation. Traditional systems lack AI-powered contextual reasoning and multi-stadium coordination capabilities.

**Solution Approach:** StadiumMind AI provides an intelligent decision support system that:
- Monitors real-time crowd metrics across multiple stadium gates
- Uses AI to analyze situations and recommend optimal actions
- Coordinates volunteers and emergency response teams
- Provides accessibility-aware navigation for diverse fan needs
- Supports multilingual operations for international events
- Tracks sustainability metrics for environmental responsibility

## Architecture

```mermaid
flowchart LR
  Fan["Fans, volunteers, staff"] --> UI["Next.js Dashboard"]
  UI --> API["Express API"]
  UI <--> Socket["Socket.IO Crowd Updates"]
  API --> AI["GROQ_API or local AI fallback"]
  API --> Data["PostgreSQL-ready repository layer"]
  API --> Maps["Google Maps, Routes, Places, Translation, Speech APIs"]
```

## Tech Stack

- Frontend: Next.js 15 App Router, React, TypeScript, Tailwind CSS, Framer Motion, lucide icons
- Backend: Node.js 22, Express, TypeScript, Socket.IO
- AI: GROQ_API integration with deterministic local fallback
- Data: PostgreSQL-ready configuration with realistic mock operational data
- Security: Helmet, CORS, rate limiting, request validation, environment variables, input sanitization
- Testing: Vitest, Supertest, React Testing Library
- Deployment: Docker, Docker Compose, Google Cloud Run

## Features

### Core Capabilities
- **AI Stadium Assistant**: Contextual AI reasoning with situation analysis, prediction, recommended actions, confidence scores, and evidence sources
- **Crowd Intelligence Dashboard**: Real-time monitoring of gate occupancy, queue lengths, risk scoring, and heatmap visualization
- **Smart Navigation**: Multi-mode routing (fastest, least-crowded, wheelchair-accessible, emergency) with step-by-step directions
- **Multi-Stadium Support**: Dynamic stadium selection with venue-specific data and operational metrics

### User Experience
- **Multilingual Support**: English, Spanish, French, Hindi, Arabic, and Portuguese for international events
- **Accessibility-First Design**: WCAG AA compliant with keyboard navigation, screen reader support, and high contrast modes
- **Responsive Interface**: Optimized for desktop, tablet, and mobile devices with touch-friendly controls
- **Real-Time Updates**: Live crowd metrics, alerts, and volunteer status with WebSocket integration

### Operational Features
- **Volunteer Copilot**: Task assignment with priority levels, location tracking, ETA estimates, and reasoning
- **Emergency Response Panel**: Quick-action evacuation routes, medical dispatch, and multi-language announcements
- **Sustainability Dashboard**: Energy consumption, water usage, waste management, and carbon footprint tracking
- **Alert System**: Severity-based notifications with recommended actions and confidence levels

### Technical Excellence
- **Modern UI/UX**: Gradient-based design, smooth animations with Framer Motion, dark/light mode
- **Security Best Practices**: Helmet headers, CORS protection, rate limiting, input validation, environment variable isolation
- **Performance**: Optimized rendering, caching strategies, efficient API responses
- **Testing**: Comprehensive unit tests, integration tests, and accuracy scoring

## Evaluation-Focused API Surface

The backend exposes challenge-aligned endpoints so the project can be evaluated beyond the visual dashboard:

- `GET /api/operations/snapshot?stadium=metlife`
- `POST /api/assistant`
- `GET /api/navigation?stadium=metlife&mode=wheelchair`
- `GET /api/volunteers/copilot?stadium=metlife`
- `GET /api/emergency/plan?stadium=metlife&language=es`
- `GET /api/sustainability/recommendations?stadium=metlife`
- `GET /api/accuracy`

Each AI decision returns current situation, reasoning, prediction, recommended action, confidence, evidence sources, and a deterministic quality score.

## Google APIs

The app is designed to use only Google APIs that improve the experience:

- Gemini API for operational reasoning
- Google Maps JavaScript API for venue map rendering
- Routes API and Distance Matrix API for routing
- Places and Geocoding APIs for location lookup
- Cloud Translation, Speech-to-Text, and Text-to-Speech for multilingual voice assistance
- reCAPTCHA v3 for public-facing form protection

The current build works with realistic mock data when API keys are not configured.

## Folder Structure

```text
backend/   Express API, AI service, real-time events, tests
frontend/  Next.js dashboard, UI components, tests
shared/    Shared TypeScript types and scoring utilities
docs/      Space for screenshots and architecture notes
```

## Installation

```bash
npm install
cp .env.example .env
npm run build
npm test
npm run accuracy
```

## Run Locally

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000/api/health

## Environment Variables

See `.env.example`.

-   GROQ_API
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: authentication signing secret
- `FRONTEND_ORIGIN`: allowed browser origin for CORS

## Accuracy Score

The project includes a deterministic AI decision quality score. It checks whether AI output includes operational completeness, confidence, evidence sources, and stadium-specific details.

Current final score:

```json
{
  "finalAccuracyScore": 100,
  "passed": true
}
```

## Screenshots

Add final screenshots in `docs/screenshots/` after deployment or local browser capture.

## Future Improvements

- Persist event telemetry in PostgreSQL with migrations
- Add JWT login screens for role-based access
- Render a real Google stadium map once venue coordinates and API keys are available
- Add Web Speech API voice capture and playback in the browser
- Add Playwright end-to-end tests

## License

MIT
