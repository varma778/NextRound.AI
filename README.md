# NextRound.ai

**Built by [Ravi Varma Datla](https://www.linkedin.com/in/ravivarmadatla07)** · [GitHub @varma778](https://github.com/varma778)

> AI-powered mock interview platform with autopilot voice agents, Gemini feedback, and internship-ready practice tracks.

---

## Resume Bullet Points

Copy these directly into your Google internship application:

- Built **NextRound.ai**, a full-stack AI interview prep platform — portfolio project by **Ravi Varma Datla**
- Integrated **Vapi AI** voice agents for real-time autopilot mock interviews with sub-second response latency tuning
- Used **Google Gemini** via Vercel AI SDK for dynamic question generation and structured 5-category interview feedback
- Implemented **Firebase Auth** session cookies and **Firestore** for secure user management, interview storage, and feedback history
- Designed a dual-path UX: fast form-based interview setup + hands-free voice configuration via Vapi workflows
- Pre-built internship tracks for **SWE, ML, PM, Data Science, UX, and Cloud** roles with fallback question banks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| Voice AI | Vapi Web SDK (Deepgram + ElevenLabs + GPT-4o-mini) |
| LLM | Google Gemini 1.5 Flash (Vercel AI SDK) |
| Auth | Firebase Authentication + Admin session cookies |
| Database | Cloud Firestore |
| UI | shadcn/ui, Sonner toasts, React Hook Form + Zod |

---

## End-to-End Architecture

```mermaid
flowchart TD
    A[User] -->|Sign In| B[Firebase Auth Client]
    B -->|ID Token| C[signIn Server Action]
    C -->|Session Cookie| D[Protected Routes]

    D --> E[Dashboard /]
    E -->|Launch Interview| F[/interview QuickStartForm]
    F -->|createInterview| G[Gemini Question Gen]
    G -->|Save| H[(Firestore interviews)]
    H -->|Redirect| I[/interview/id?autopilot=1]

    I --> J[Agent Component]
    J -->|vapi.start| K[Vapi Voice Session]
    K -->|Live Transcript| J
    J -->|Call End| L[createFeedback]
    L -->|Gemini Analysis| M[(Firestore feedback)]
    M --> N[/interview/id/feedback]

    O[Vapi Workflow Mode] -->|POST| P[/api/vapi/generate]
    P --> G
```

---

## End-to-End User Flow

### 1. Authentication
- User signs up or signs in at `/sign-in` or `/sign-up`
- Firebase client authenticates with email/password
- Server action `signIn()` verifies the ID token and sets an HTTP-only session cookie
- Protected routes under `(root)/` check `isAuthenticated()` before rendering

### 2. Dashboard (`/`)
- Shows welcome CTA, feature cards, and interview history
- **Your Interviews** — interviews the user created or completed
- **Community Interviews** — interviews from other users (Firestore query)

### 3. Create Interview — Fast Path (`/interview`)
- User selects role, level, type, tech stack, and question count
- `createInterview()` server action calls Gemini to generate tailored questions
- Interview saved to Firestore → redirects to `/interview/[id]?autopilot=1`

### 4. Autopilot Voice Interview (`/interview/[id]`)
- Agent component auto-starts Vapi call after 600ms when `autopilot=1`
- Uses optimized config: GPT-4o-mini, Deepgram Nova-2, ElevenLabs Sarah at 1.1x speed
- Live transcript displayed in real time
- User clicks **End Interview** when done

### 5. AI Feedback (`/interview/[id]/feedback`)
- On call end, `createFeedback()` sends transcript to Gemini
- Structured output: total score, 5 category scores, strengths, improvements, final assessment
- Saved to Firestore and displayed on feedback page

### 6. Voice Setup Path (optional)
- Alternative flow on `/interview` using Vapi workflow
- User talks to AI to configure interview hands-free
- Workflow calls `POST /api/vapi/generate` to create questions in Firestore

---

## Project Structure

```
ai_mock_interviews/
├── app/
│   ├── (auth)/              # Sign-in, sign-up (redirects if logged in)
│   ├── (root)/              # Protected app shell
│   │   ├── page.tsx         # Dashboard
│   │   └── interview/
│   │       ├── page.tsx     # Quick start + voice setup
│   │       └── [id]/
│   │           ├── page.tsx # Live interview (autopilot)
│   │           └── feedback/page.tsx
│   ├── api/vapi/generate/   # Vapi webhook for voice-created interviews
│   └── layout.tsx           # Root metadata + fonts
├── components/
│   ├── Agent.tsx            # Vapi voice session + autopilot
│   ├── QuickStartForm.tsx   # Fast interview creation form
│   ├── InterviewCard.tsx    # Dashboard interview cards
│   ├── AuthForm.tsx         # Login / signup
│   └── SignOutButton.tsx
├── lib/
│   ├── actions/
│   │   ├── auth.action.ts   # Session cookies, getCurrentUser
│   │   └── general.action.ts # CRUD interviews + feedback
│   ├── ai.ts                # Gemini helpers + fallback questions
│   └── vapi.config.ts       # Vapi autopilot voice configuration
├── constants/
│   ├── branding.ts          # NextRound.ai brand + internship roles
│   └── index.ts             # Feedback schema, tech icons, covers
└── firebase/
    ├── admin.ts             # Firebase Admin SDK init
    ├── client.ts            # Firebase client SDK
    └── service-account.json # Server credentials (gitignored)
```

---

## Firestore Schema

### `users/{uid}`
```json
{ "name": "string", "email": "string" }
```

### `interviews/{id}`
```json
{
  "role": "Software Engineering Intern",
  "level": "Intern",
  "type": "Technical",
  "techstack": ["Python", "Algorithms"],
  "questions": ["Question 1", "Question 2"],
  "userId": "uid",
  "finalized": true,
  "coverImage": "/covers/amazon.png",
  "createdAt": "ISO timestamp"
}
```

### `feedback/{id}`
```json
{
  "interviewId": "string",
  "userId": "string",
  "totalScore": 85,
  "categoryScores": [{ "name": "...", "score": 80, "comment": "..." }],
  "strengths": ["..."],
  "areasForImprovement": ["..."],
  "finalAssessment": "string",
  "createdAt": "ISO timestamp"
}
```

---

## Setup (Local)

### Prerequisites
- Node.js 18+
- Firebase project with Auth + Firestore enabled
- Vapi account (for voice features)
- Google AI Studio API key (for Gemini)

### Install & Run

```bash
cd ai_mock_interviews
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open **http://localhost:3000**

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_VAPI_WEB_TOKEN` | Voice | Vapi public web token |
| `NEXT_PUBLIC_VAPI_WORKFLOW_ID` | Voice setup | Vapi workflow ID |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | Gemini API key |
| `GEMINI_MODEL` | No | Default: `gemini-1.5-flash` |
| `NEXT_PUBLIC_FIREBASE_*` | Yes | Firebase client config |
| `GOOGLE_APPLICATION_CREDENTIALS` | Yes | Path to service account JSON |

### Firebase Setup
1. Create a Firebase project
2. Enable **Email/Password** authentication
3. Enable **Cloud Firestore** and create a database
4. Download service account JSON → save as `firebase/service-account.json`

---

## API Reference

### Server Actions

| Action | File | Purpose |
|---|---|---|
| `signIn` | auth.action.ts | Verify token, set session cookie |
| `signUp` | auth.action.ts | Create user record in Firestore |
| `signOut` | auth.action.ts | Clear session cookies |
| `getCurrentUser` | auth.action.ts | Resolve user from session |
| `createInterview` | general.action.ts | Gemini questions → Firestore |
| `createFeedback` | general.action.ts | Transcript → Gemini → Firestore |
| `getInterviewById` | general.action.ts | Fetch single interview |
| `getInterviewsByUserId` | general.action.ts | User's interview history |
| `getLatestInterviews` | general.action.ts | Community interviews |
| `getFeedbackByInterviewId` | general.action.ts | Feedback for interview + user |

### REST Routes

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/vapi/generate` | Vapi workflow webhook — generates interview |
| `GET` | `/api/vapi/generate` | Health check |

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add all `.env.local` variables to Vercel environment settings
4. Upload `firebase/service-account.json` contents as `FIREBASE_PRIVATE_KEY` + related vars, or use Vercel env for `GOOGLE_APPLICATION_CREDENTIALS`
5. Set `NEXT_PUBLIC_BASE_URL` to your production URL
6. Deploy

---

## Internship Role Tracks

Pre-configured in `QuickStartForm` with smart defaults:

| Role | Default Focus |
|---|---|
| Software Engineering Intern | Python, Java, DSA, System Design |
| Machine Learning Intern | TensorFlow, PyTorch, Statistics |
| Data Science Intern | Python, SQL, Pandas, Visualization |
| Product Manager Intern | Strategy, Metrics, User Research |
| UX Design Intern | Figma, Prototyping, Design Systems |
| Cloud Engineering Intern | GCP, Kubernetes, Docker, Linux |

---

## Author

| | |
|---|---|
| **Name** | Ravi Varma Datla |
| **GitHub** | [github.com/varma778](https://github.com/varma778) |
| **LinkedIn** | [linkedin.com/in/ravivarmadatla07](https://www.linkedin.com/in/ravivarmadatla07) |
| **Project** | NextRound.ai — AI Interview Platform |

---

## License

MIT — built by you, for your internship portfolio.
