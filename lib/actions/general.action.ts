"use server";

import { generateObject, generateText } from "ai";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import {
  buildInterviewQuestionsPrompt,
  getFallbackQuestions,
  getGeminiModel,
  parseQuestionsJson,
} from "@/lib/ai";
import { isFirestoreUnavailable } from "@/lib/firestore";
import { getRandomInterviewCover } from "@/lib/utils";

interface CreateInterviewParams {
  userId: string;
  role: string;
  level: string;
  type: string;
  techstack: string;
  amount: number;
}

async function generateQuestions(params: CreateInterviewParams) {
  try {
    const { text } = await generateText({
      model: getGeminiModel(),
      prompt: buildInterviewQuestionsPrompt({
        role: params.role,
        level: params.level,
        techstack: params.techstack,
        type: params.type,
        amount: params.amount,
      }),
    });

    return parseQuestionsJson(text);
  } catch (error) {
    console.warn("Gemini question generation failed, using fallback:", error);
    return getFallbackQuestions(params.role, params.amount);
  }
}

export async function createInterview(params: CreateInterviewParams) {
  const { userId, role, level, type, techstack, amount } = params;

  try {
    const questions = await generateQuestions(params);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((t) => t.trim()).filter(Boolean),
      questions,
      userId,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return {
      success: true,
      interviewId: docRef.id,
      message: "Interview created successfully.",
    };
  } catch (error: unknown) {
    console.error("Error creating interview:", error);

    if (isFirestoreUnavailable(error)) {
      return {
        success: false,
        message:
          "Firestore database not set up yet. Open Firebase Console → Firestore → Create database, then retry.",
      };
    }

    return {
      success: false,
      message: "Failed to create interview. Please try again.",
    };
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  if (!transcript.length) {
    return { success: false, message: "No transcript available." };
  }

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: getGeminiModel(),
      schema: feedbackSchema,
      prompt: `
        You are a senior interviewer at a top tech company evaluating an internship candidate.
        Be rigorous but constructive. This feedback will go on their resume prep portfolio.

        Transcript:
        ${formattedTranscript}

        Score 0-100 in these exact categories:
        - Communication Skills
        - Technical Knowledge
        - Problem Solving
        - Cultural Fit
        - Confidence and Clarity
        `,
      system:
        "You are a professional interviewer providing structured, actionable feedback for internship candidates.",
    });

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false, message: "Failed to generate feedback." };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  try {
    const interview = await db.collection("interviews").doc(id).get();
    if (!interview.exists) return null;

    return { id: interview.id, ...interview.data() } as Interview;
  } catch (error) {
    console.error("Error fetching interview:", error);
    return null;
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  try {
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();

    if (querySnapshot.empty) return null;

    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return null;
  }
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  try {
    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where("finalized", "==", true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error: unknown) {
    if (!isFirestoreUnavailable(error)) {
      console.error("Error fetching latest interviews:", error);
    }
    return [];
  }
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error: unknown) {
    if (!isFirestoreUnavailable(error)) {
      console.error("Error fetching user interviews:", error);
    }
    return [];
  }
}

export async function isFirestoreReady(): Promise<boolean> {
  try {
    await db.collection("users").limit(1).get();
    return true;
  } catch (error) {
    return !isFirestoreUnavailable(error);
  }
}
