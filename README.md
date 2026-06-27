<div align="center">

<img src="public/robot.png" alt="NextRound.AI" width="120" />

# NextRound.AI

### AI-Powered Mock Interview Platform for Top Tech Internships

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vapi](https://img.shields.io/badge/Vapi_Voice_AI-7C3AED?style=for-the-badge)](https://vapi.ai)

**Built by [Ravi Varma Datla](https://www.linkedin.com/in/ravivarmadatla07) · [Live Demo](#) · [GitHub](https://github.com/varma778/NextRound.AI)**

</div>

---

## The Problem

Getting a Google, Meta, or Amazon internship is not just about knowing algorithms. It is about how you communicate under pressure, structure your thinking, and carry yourself in a real conversation. Most candidates only practice on paper — and freeze in the actual interview.

NextRound.AI puts you in a live, pressure-tested interview environment with a voice AI that asks real questions, listens to your answers, and generates structured feedback the same way a real interviewer would score you.

---

## What It Does

NextRound.AI is a full-stack SaaS platform that runs end-to-end AI mock interviews entirely in the browser:

- You select a role — Software Engineering, Machine Learning, Data Science, PM, UX, or Cloud
- Gemini AI generates a tailored question set at internship bar difficulty
- A voice AI interviewer runs the full session — questions, pacing, and follow-ups
- When the session ends, Gemini analyzes the transcript and produces a scored, actionable feedback report
- Every session is saved to your profile so you can track improvement over time

The entire pipeline from question generation to scored feedback takes under 5 minutes.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        NextRound.AI                             │
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │  Next.js 15  │    │  Firebase    │    │   Google Gemini  │  │
│  │  App Router  │───▶│  Auth +      │    │   Flash 1.5      │  │
│  │  Server      │    │  Firestore   │    │   (AI SDK)       │  │
│  │  Components  │    └──────────────┘    └──────────────────┘  │
│  └──────┬───────┘              ▲                  ▲            │
│         │                      │                  │            │
│  ┌──────▼───────┐    ┌─────────┴──────┐           │            │
│  │  Vapi Voice  │    │ Server Actions │───────────┘            │
│  │  AI Agent    │    │ (auth, CRUD,   │                        │
│  │  (WebRTC)    │    │  feedback)     │                        │
│  └──────────────┘    └────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- **Server Components by default** — data fetching happens on the server, zero client waterfalls
- **Server Actions** — no REST API layer needed; mutations go directly from client to server function
- **Parallel data fetching** — `Promise.all` across all Firestore queries eliminates N+1 problems
- **Session cookies** — Firebase session cookies over JWTs for secure, server-side auth validation
- **Graceful degradation** — demo simulation mode works without Vapi; Firestore errors are caught and surfaced cleanly

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15 App Router | Server Components, streaming, file-based routing |
| Language | TypeScript (strict) | End-to-end type safety across server and client |
| AI — Feedback | Google Gemini 1.5 Flash via Vercel AI SDK | Structured output with Zod schema validation |
| AI — Voice | Vapi WebRTC Voice Agent | Real-time STT/TTS, sub-200ms latency |
| Auth | Firebase Authentication | Session cookie strategy, email/password |
| Database | Cloud Firestore | Real-time, serverless, scales to zero |
| Styling | Tailwind CSS v4 | Utility-first, custom design system |
| Forms | React Hook Form + Zod | Type-safe validation, zero re-renders |
| Notifications | Sonner | Non-blocking toast UX |
| Deployment | Vercel | Edge network, CI/CD from GitHub |

---

## Features in Detail

### Autopilot Voice Interview
The Vapi voice agent handles the entire interview session. It uses a custom assistant config with a calibrated system prompt tuned for internship-level interviews — warm, direct, and fast-paced like a real Google interviewer. ElevenLabs TTS (Sarah voice) with 1.1x speed keeps the session energetic.

### Gemini Feedback Engine
After every session, the full transcript is sent to Gemini with a structured prompt. Output is validated against a Zod schema that enforces exactly 5 scoring categories, ensuring consistent, parseable reports every time:

- Communication Skills
- Technical Knowledge
- Problem Solving
- Cultural Fit
- Confidence and Clarity

### Demo / Simulation Mode
When Vapi is not configured, the app runs a built-in simulation — realistic AI ↔ candidate dialogue, speaking animations, live transcript, and real Gemini feedback at the end. The demo is indistinguishable from a live session visually and produces genuine AI feedback.

### Loading Skeleton UI
Every route has a matching `loading.tsx` with pixel-accurate skeleton screens. Next.js streams the skeleton instantly while server data loads — perceived load time feels under 100ms.

### QuickStart Form
Role, level, interview type, and question count — configured in one form. Gemini generates the question set in ~2 seconds, then autopilot kicks in immediately. Zero manual setup.

---

## Performance

| Metric | Approach |
|---|---|
| Server data fetching | `Promise.all` — all Firestore queries run in parallel |
| Client bundle | Server Components keep heavy logic off the client |
| Perceived load | Skeleton `loading.tsx` on every route |
| Auth overhead | Session cookies validated server-side, no client round-trip |
| AI latency | Gemini Flash selected for lowest latency at quality |

---

## Getting Started

### Prerequisites
- Node.js 18+
- Firebase project (Auth + Firestore enabled)
- Google Gemini API key — [get one free](https://aistudio.google.com/app/apikey)
- Vapi account (optional) — [vapi.ai](https://vapi.ai)

### Local Setup

```bash
# 1. Clone
git clone https://github.com/varma778/NextRound.AI.git
cd NextRound.AI

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your Firebase + Gemini keys

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Vapi (optional — demo mode works without it)
NEXT_PUBLIC_VAPI_WEB_TOKEN=
NEXT_PUBLIC_VAPI_WORKFLOW_ID=

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=
GEMINI_MODEL=gemini-1.5-flash

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### Deploy to Vercel

```bash
npx vercel
```

Add all env vars in Vercel dashboard → Project Settings → Environment Variables.

---

## Project Structure

```
├── app/
│   ├── (auth)/                  # Auth pages (sign-in, sign-up)
│   ├── (root)/
│   │   ├── page.tsx             # Dashboard — interview history + community feed
│   │   ├── loading.tsx          # Skeleton UI
│   │   └── interview/
│   │       ├── page.tsx         # QuickStart form + voice agent setup
│   │       └── [id]/
│   │           ├── page.tsx     # Live interview session
│   │           └── feedback/
│   │               └── page.tsx # Gemini feedback report
│   └── api/vapi/generate/       # Webhook endpoint for Vapi workflow
├── components/
│   ├── Agent.tsx                # Core voice interview (Vapi + demo mode)
│   ├── QuickStartForm.tsx       # Interview configuration form
│   ├── InterviewCard.tsx        # History card with score + feedback
│   └── AuthForm.tsx             # Auth form (sign-in / sign-up)
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts       # Server actions: session, sign-in, sign-up
│   │   └── general.action.ts    # Server actions: interviews, feedback, queries
│   ├── ai.ts                    # Gemini model config + prompt builders
│   ├── vapi.config.ts           # Vapi assistant config + autopilot options
│   └── firestore.ts             # Firestore error detection utilities
├── firebase/
│   ├── admin.ts                 # Firebase Admin SDK init (server)
│   └── client.ts                # Firebase Client SDK init (browser)
├── constants/
│   ├── branding.ts              # App name, author info, role list
│   └── index.ts                 # Tech icon mappings, Zod feedback schema
└── types/
    └── index.d.ts               # Global TypeScript interfaces
```

---

## Roadmap

- [ ] Real Vapi workflow with live voice (WebRTC)
- [ ] PDF feedback export — shareable report card
- [ ] Progress tracker — score trends across sessions
- [ ] Google OAuth + GitHub OAuth
- [ ] LinkedIn share card for feedback scores
- [ ] LeetCode-style question bank integration
- [ ] Leaderboard — compare scores across candidates
- [ ] Mobile app (React Native)

---

## What I Learned Building This

- Architecting Next.js 15 Server Components to eliminate client-side data waterfalls
- Integrating real-time voice AI (Vapi WebRTC) with a custom assistant configuration
- Using Vercel AI SDK's `generateObject` with Zod schemas for structured, validated LLM output
- Firebase Admin SDK session cookie auth — more secure than client-side JWT
- Designing graceful degradation so the app is fully usable without paid third-party services
- Building a demo simulation mode that produces identical UX to the live Vapi session

---

## Author

<table>
  <tr>
    <td align="center">
      <strong>Ravi Varma Datla</strong><br/>
      Software Engineering Internship Candidate<br/>
      <a href="https://github.com/varma778">@varma778</a> ·
      <a href="https://www.linkedin.com/in/ravivarmadatla07">LinkedIn</a>
    </td>
  </tr>
</table>

---

## License

MIT — open source, free to use and fork.

---

<div align="center">
  <sub>Built with Next.js · Firebase · Google Gemini · Vapi · TypeScript · Tailwind CSS</sub>
</div>
