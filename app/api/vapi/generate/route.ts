import { generateText } from "ai";

import { db } from "@/firebase/admin";
import {
  buildInterviewQuestionsPrompt,
  getGeminiModel,
  parseQuestionsJson,
} from "@/lib/ai";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();

  try {
    const { text: questions } = await generateText({
      model: getGeminiModel(),
      prompt: buildInterviewQuestionsPrompt({
        role,
        level,
        techstack,
        type,
        amount,
      }),
    });

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t: string) => t.trim()).filter(Boolean),
      questions: parseQuestionsJson(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json(
      { success: true, interviewId: docRef.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, service: "NextRound.ai Vapi API" }, { status: 200 });
}
