import type { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function getVapiToken() {
  return process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.trim() || "";
}

export function getVapiWorkflowId() {
  return process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID?.trim() || "";
}

export function isVapiConfigured() {
  const token = getVapiToken();
  return Boolean(token && !token.includes("your_vapi"));
}

export function isWorkflowConfigured() {
  const workflowId = getVapiWorkflowId();
  return Boolean(workflowId && !workflowId.includes("your_vapi"));
}

export const vapiAutopilotOverrides = {
  recordingEnabled: false,
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 1800,
  backgroundDenoisingEnabled: true,
} as const;

export function buildWorkflowStartOptions(userName: string, userId?: string) {
  return {
    variableValues: {
      username: userName,
      userid: userId || "guest",
    },
  };
}

export function buildInterviewStartOptions(
  questions: string[],
  userName: string,
  role?: string
) {
  const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

  return {
    variableValues: {
      questions: formattedQuestions,
      username: userName,
      role: role || "Software Engineering Intern",
    },
  };
}

export function getFastInterviewerConfig(
  questions: string[],
  role: string
): CreateAssistantDTO {
  const formattedQuestions = questions.map((q) => `- ${q}`).join("\n");

  return {
    name: "NextRound Interviewer",
    firstMessage: `Hi ${role} candidate! I'm your NextRound.ai interviewer. Let's move fast — I'll ask focused questions and you answer naturally. Ready when you are.`,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en",
      endpointing: 250,
    },
    voice: {
      provider: "11labs",
      voiceId: "sarah",
      stability: 0.35,
      similarityBoost: 0.75,
      speed: 1.1,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      temperature: 0.6,
      maxTokens: 180,
      messages: [
        {
          role: "system",
          content: `You are a senior interviewer at a top tech company running a fast-paced internship mock interview for a ${role} role.

Questions to cover:
${formattedQuestions}

Rules:
- Keep every response under 3 sentences. This is voice, not an essay.
- Acknowledge briefly, then ask the next question.
- Probe once if an answer is vague, then move on.
- Sound confident, warm, and professional — like a real Google interviewer.
- End with a short thank-you when all questions are covered.`,
        },
      ],
    },
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1200,
    backgroundDenoisingEnabled: true,
  };
}
