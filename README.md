# NextRound.AI

> AI-powered mock interview platform built for internship prep at top tech companies.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![Firebase](https://img.shields.io/badge/Firebase-orange?style=for-the-badge&logo=firebase)
![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## What is NextRound.AI?

NextRound.AI lets you run realistic mock interviews with a voice AI, get instant scored feedback from Google Gemini, and track your progress — all in the browser. Built specifically for software engineering, ML, data science, PM, and UX internship candidates targeting Google, Meta, Amazon, and similar companies.

**Live Demo:** _deploy to Vercel and add your URL here_

---

## Features

- **Autopilot Voice Interviews** — Vapi AI handles questions, pacing, and follow-ups hands-free
- **Gemini-Powered Feedback** — Scored breakdown across Communication, Technical Knowledge, Problem Solving, Cultural Fit, and Confidence
- **Role-Specific Templates** — Pre-built tracks for SWE, ML, Data Science, PM, UX, and Cloud Engineering intern roles
- **QuickStart Form** — Launch a tailored interview in under 30 seconds
- **Demo Mode** — Fully simulated interview works without a Vapi token, great for showcasing
- **Firebase Auth** — Secure email/password auth with session cookies
- **Interview History** — All past sessions and feedback saved per user
- **Community Feed** — Browse interviews from other users
- **Skeleton Loading UI** — Instant perceived performance with loading states on every route
- **Fully Responsive** — Works on mobile, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| AI Feedback | Google Gemini via Vercel AI SDK (`@ai-sdk/google`) |
| Voice Agent | Vapi (`@vapi-ai/web`) |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Deployment | Vercel (recommended) |

---

## Project Structure

```
app/
├── (auth)/          # Sign-in & sign-up pages
├── (root)/
│   ├── page.tsx         # Dashboard
│   ├── interview/
│   │   ├── page.tsx         # QuickStart + Voice Agent setup
│   │   └── [id]/
│   │       ├── page.tsx         # Live interview session
│   │       └── feedback/
│   │           └── page.tsx     # Gemini feedback report
│   └── loading.tsx      # Skeleton UIs for all routes
├── api/
│   └── vapi/generate/   # Webhook endpoint for Vapi workflow
components/
├── Agent.tsx            # Core voice interview component (Vapi + demo mode)
├── QuickStartForm.tsx   # Role/level/type selector
├── InterviewCard.tsx    # Interview history card
├── AuthForm.tsx         # Sign in / Sign up form
└── ...
lib/
├── actions/
│   ├── auth.action.ts       # Server actions: sign in, sign up, session
│   └── general.action.ts    # Server actions: interviews, feedback
├── ai.ts                # Gemini model + prompt builders
├── vapi.config.ts       # Vapi assistant config + autopilot options
└── firestore.ts         # Firestore error utilities
firebase/
├── admin.ts             # Firebase Admin SDK (server-side)
└── client.ts            # Firebase Client SDK (browser)
constants/
├── branding.ts          # App name, author, roles
└── index.ts             # Tech mappings, feedback schema
types/
└── index.d.ts           # Global TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Auth + Firestore enabled
- A Google Gemini API key
- (Optional) A Vapi account for live voice interviews

### 1. Clone the repo

```bash
git clone https://github.com/varma778/NextRound.AI.git
cd NextRound.AI
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

```env
# Vapi (optional — demo mode works without this)
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_workflow_id

# Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash

# Firebase Client (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin (server-side only)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
```

### 3. Firebase setup

1. Go to [Firebase Console](https://console.firebase.google.com) → Create project
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database** → Start in production mode
4. Download your service account JSON → save as `firebase/service-account.json`

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables in your Vercel project settings under **Environment Variables**.

> Note: `FIREBASE_PRIVATE_KEY` must have actual newlines — in Vercel paste the raw key with `\n` replaced by real line breaks, or wrap it in double quotes.

---

## Demo Mode

If `NEXT_PUBLIC_VAPI_WEB_TOKEN` is not set or is a placeholder, the app automatically runs a **simulated interview** in the browser. The demo:

- Plays a realistic AI ↔ candidate conversation
- Shows the speaking animation and live transcript
- Sends the transcript to Gemini and generates **real scored feedback**

This means the full flow works as a portfolio demo with zero Vapi cost.

---

## Firestore Indexes

The app uses compound queries. If you see index errors in production, create these in Firebase Console → Firestore → Indexes:

| Collection | Fields | Order |
|---|---|---|
| `interviews` | `userId` ASC, `createdAt` DESC | — |
| `interviews` | `finalized` ASC, `userId` ASC, `createdAt` DESC | — |
| `feedback` | `interviewId` ASC, `userId` ASC | — |

---

## Roadmap

- [ ] Real-time Vapi voice with WebRTC
- [ ] PDF feedback export for resume portfolio
- [ ] Leaderboard — compare scores across candidates
- [ ] LeetCode-style question bank integration
- [ ] LinkedIn share card for feedback scores
- [ ] Google OAuth sign-in

---

## Author

**Ravi Varma Datla**
- GitHub: [@varma778](https://github.com/varma778)
- LinkedIn: [ravivarmadatla07](https://www.linkedin.com/in/ravivarmadatla07)

Built as a portfolio project targeting **Google SWE Internship 2025**.

---

## License

MIT — free to use, fork, and build on.
