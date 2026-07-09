# StadiumMind AI Evaluation Rubric

This project targets Prompt Wars Virtual Challenge 4: a GenAI-enabled solution for FIFA World Cup 2026 stadium operations and fan experience.

## Direct Challenge Coverage

| Required Area | Evidence in Product | API / Code |
| --- | --- | --- |
| Navigation | Fastest, least-crowded, wheelchair, and emergency routes with duration, crowd exposure, and steps | `GET /api/navigation`, `frontend/src/components/dashboard.tsx` |
| Crowd Management | Gate occupancy, queue time, incoming fans, risk score, alerts, heatmap | `GET /api/operations/snapshot`, `backend/src/services/operationsService.ts` |
| Accessibility | Accessible routing, high contrast theme support, focus-visible styles, semantic labels | `frontend/src/app/globals.css`, `frontend/src/components/stadium-map.tsx` |
| Transportation | Parking and transit gate pressure modeled in route and gate data | `backend/src/data/stadium.ts` |
| Sustainability | Energy, water, waste, carbon metrics plus AI recommendations | `GET /api/sustainability/recommendations` |
| Multilingual Assistance | Six language options and multilingual emergency announcements | `GET /api/emergency/plan?language=es` |
| Operational Intelligence | Volunteer copilot, medical alerts, live alerts, source-backed AI decisions | `GET /api/volunteers/copilot` |
| Real-Time Decision Support | Socket.IO crowd updates and confidence-scored decisions | `backend/src/server.ts`, `scoreDecision` |

## Quality Safeguards

- Shared package owns reusable domain types and scoring logic.
- Backend uses service-layer functions for operations, navigation, emergency response, volunteer dispatch, and sustainability.
- AI calls use Groq when configured and deterministic fallback when unavailable.
- Input is validated with Zod and prompt text is sanitized before model calls.
- Helmet, CORS, rate limiting, trust proxy, and environment variables protect deployed APIs.
- Tests cover assistant responses, navigation, volunteer copilot, emergency response, sustainability, CORS rejection, and scoring.

## Deployed URLs

- Frontend: https://stadiummind-web-aqzxduhtwq-uc.a.run.app
- Backend: https://stadiummind-api-aqzxduhtwq-uc.a.run.app
