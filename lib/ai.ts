import { google } from "@ai-sdk/google";

const GEMINI_MODELS = [
  "gemini-1.5-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-pro",
] as const;

export function getGeminiModel() {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const modelId = preferred || GEMINI_MODELS[0];
  return google(modelId);
}

export function buildInterviewQuestionsPrompt(params: {
  role: string;
  level: string;
  techstack: string;
  type: string;
  amount: number;
}) {
  const { role, level, techstack, type, amount } = params;

  return `Generate ${amount} internship-level mock interview questions for a ${level} ${role} candidate.

Tech focus: ${techstack}
Interview style: ${type} (lean toward this style)

Requirements:
- Questions should match top tech company internship bar (Google, Meta, Amazon level).
- Mix coding concepts, system thinking, and behavioral depth where appropriate.
- Return ONLY a JSON array of strings, no markdown, no extra text.
- No special characters like "/" or "*" that break voice assistants.
- Each question must be concise and speakable aloud.

Format exactly:
["Question 1", "Question 2", "Question 3"]`;
}

export function parseQuestionsJson(raw: string): string[] {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "");

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("Question response is not an array.");
  }

  return parsed.map((q) => String(q).trim()).filter(Boolean);
}

export const FALLBACK_QUESTIONS: Record<string, string[]> = {
  "Software Engineering Intern": [
    "Tell me about a project where you optimized performance or reduced latency.",
    "How would you design a URL shortener at internship scale?",
    "Explain time and space complexity for a problem you recently solved.",
    "Describe a bug you fixed that taught you something important.",
    "How do you approach learning a new codebase quickly?",
  ],
  "Machine Learning Intern": [
    "Walk me through an ML project from data collection to evaluation.",
    "How do you detect and handle overfitting in a model?",
    "Explain the tradeoff between precision and recall with an example.",
    "What metrics would you use for an imbalanced classification task?",
    "How would you deploy an ML model for low-latency inference?",
  ],
  default: [
    "Tell me about yourself and why you are interested in this internship.",
    "Describe a challenging problem you solved recently.",
    "How do you handle ambiguity when requirements are unclear?",
    "Tell me about a time you collaborated under a tight deadline.",
    "What is your strongest technical skill and how have you applied it?",
  ],
};

export function getFallbackQuestions(role: string, amount: number) {
  const pool = FALLBACK_QUESTIONS[role] || FALLBACK_QUESTIONS.default;
  return pool.slice(0, amount);
}
