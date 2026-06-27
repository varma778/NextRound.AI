"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import {
  buildInterviewStartOptions,
  getFastInterviewerConfig,
  buildWorkflowStartOptions,
  isVapiConfigured,
  isWorkflowConfigured,
} from "@/lib/vapi.config";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
  GENERATING_FEEDBACK = "GENERATING_FEEDBACK",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Demo simulation — plays a realistic interview when Vapi isn't configured.
// Produces a real transcript that gets sent to Gemini for genuine feedback.
// ---------------------------------------------------------------------------
function buildDemoScript(questions: string[], role: string): SavedMessage[] {
  const q = questions.length > 0 ? questions : [
    "Tell me about yourself and why you want this internship.",
    "Walk me through a challenging technical problem you solved.",
    "How do you handle ambiguity when requirements are unclear?",
    "Describe a time you worked under a tight deadline.",
    "What's your strongest technical skill and how have you applied it?",
  ];

  const answers: string[] = [
    `I'm a computer science student passionate about building scalable systems. I've been working on full-stack projects using React and Node, and I'm drawn to ${role} because it aligns perfectly with my interest in solving real-world engineering challenges at scale.`,
    `During a hackathon, our real-time chat feature was dropping messages under load. I profiled the bottleneck to an unindexed Firestore query, added composite indexes, and moved heavy processing to a background worker. Latency dropped from 800ms to under 50ms.`,
    `I start by writing down what I do know, then I break the problem into the smallest testable assumptions. I'll prototype the riskiest assumption first and check in with stakeholders early rather than building in the wrong direction for a week.`,
    `Last semester I had a systems project due the same week as two other finals. I triaged features by impact, shipped a working MVP by day three, then hardened edge cases in the remaining time. We got full marks and I learned that ruthless prioritization beats perfectionism.`,
    `Data structures and algorithms — specifically graph traversal and dynamic programming. I've applied BFS to build a dependency resolver in a build-tool side project and used memoization to cut an O(2^n) solution to O(n²) for a competitive programming problem.`,
  ];

  const script: SavedMessage[] = [
    {
      role: "assistant",
      content: `Hi! I'm your NextRound AI interviewer. We're doing a ${role} mock interview today. I'll ask you ${q.length} focused questions. Ready? Let's go — ${q[0]}`,
    },
  ];

  q.forEach((question, i) => {
    script.push({ role: "user", content: answers[i] ?? `${answers[i % answers.length]}` });
    if (i < q.length - 1) {
      script.push({
        role: "assistant",
        content: `Great answer. ${q[i + 1]}`,
      });
    }
  });

  script.push({
    role: "assistant",
    content:
      "That wraps up our session. You gave strong, structured answers. I'll generate your detailed feedback report now — great work today!",
  });

  return script;
}

const DEMO_DELAY_PER_MSG = 2800; // ms between transcript lines

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
  role,
  autopilot = false,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const hasAutoStarted = useRef(false);
  const isGeneratingFeedback = useRef(false);
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // -------------------------------------------------------------------------
  // Demo mode: simulate a full interview with real transcript, then send to
  // Gemini for genuine AI feedback.
  // -------------------------------------------------------------------------
  const runDemoInterview = useCallback(() => {
    const script = buildDemoScript(questions || [], role || "Software Engineering Intern");
    setCallStatus(CallStatus.ACTIVE);

    script.forEach((msg, i) => {
      const t = setTimeout(() => {
        const isAI = msg.role === "assistant";
        setIsSpeaking(isAI);
        setLastMessage(msg.content);
        setMessages((prev) => [...prev, msg]);

        // After last message, end the call
        if (i === script.length - 1) {
          setTimeout(() => {
            setIsSpeaking(false);
            setCallStatus(CallStatus.FINISHED);
          }, 1800);
        } else {
          // AI stops "speaking" after 1.5s, user takes over
          setTimeout(() => setIsSpeaking(false), 1500);
        }
      }, i * DEMO_DELAY_PER_MSG + 800);

      demoTimers.current.push(t);
    });
  }, [questions, role]);

  const stopDemo = useCallback(() => {
    demoTimers.current.forEach(clearTimeout);
    demoTimers.current = [];
    setIsSpeaking(false);
  }, []);

  // -------------------------------------------------------------------------
  // Real Vapi call
  // -------------------------------------------------------------------------
  const handleCall = useCallback(async () => {
    // No Vapi token → run the demo simulation
    if (!isVapiConfigured()) {
      toast("🎬 Demo mode — simulating live interview...", { duration: 3000 });
      setCallStatus(CallStatus.CONNECTING);
      setTimeout(() => runDemoInterview(), 1200);
      return;
    }

    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        if (!isWorkflowConfigured()) {
          toast.error("Add your workflow ID to NEXT_PUBLIC_VAPI_WORKFLOW_ID.");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }
        await vapi.start(
          process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
          buildWorkflowStartOptions(userName, userId)
        );
      } else {
        const config = getFastInterviewerConfig(questions || [], role || "Intern");
        const overrides = buildInterviewStartOptions(questions || [], userName, role);
        await vapi.start(config, overrides);
      }
    } catch (error) {
      console.error("Failed to start Vapi call:", error);
      setCallStatus(CallStatus.INACTIVE);
      toast.error("Could not start session. Running demo instead.");
      runDemoInterview();
    }
  }, [type, userName, userId, questions, role, runDemoInterview]);

  // -------------------------------------------------------------------------
  // Real Vapi event listeners
  // -------------------------------------------------------------------------
  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          { role: message.role, content: message.transcript },
        ]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
      setCallStatus(CallStatus.INACTIVE);
      toast.error("Voice session disconnected.");
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  // -------------------------------------------------------------------------
  // Autopilot: auto-start after 600ms
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!autopilot || hasAutoStarted.current) return;
    hasAutoStarted.current = true;
    const timer = setTimeout(() => handleCall(), 600);
    return () => clearTimeout(timer);
  }, [autopilot, handleCall]);

  // -------------------------------------------------------------------------
  // When call finishes → generate real Gemini feedback
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (savedMessages: SavedMessage[]) => {
      if (isGeneratingFeedback.current) return;
      isGeneratingFeedback.current = true;
      setCallStatus(CallStatus.GENERATING_FEEDBACK);

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: savedMessages,
        feedbackId,
      });

      if (success && id) {
        toast.success("Feedback ready!");
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Could not generate feedback. Returning to dashboard.");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleDisconnect = () => {
    stopDemo();
    setCallStatus(CallStatus.FINISHED);
    if (isVapiConfigured()) vapi.stop();
  };

  const statusLabel = {
    [CallStatus.INACTIVE]: autopilot ? "Start Autopilot" : "Start Interview",
    [CallStatus.CONNECTING]: "Connecting...",
    [CallStatus.ACTIVE]: "Live",
    [CallStatus.FINISHED]: "Retake",
    [CallStatus.GENERATING_FEEDBACK]: "Generating feedback...",
  }[callStatus];

  return (
    <>
      {autopilot && callStatus === CallStatus.INACTIVE && (
        <p className="text-center text-primary-200 text-sm mb-4 animate-pulse">
          Autopilot mode — interview starting automatically...
        </p>
      )}

      <div className="call-view">
        {/* AI Interviewer card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI interviewer"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>NextRound AI Interviewer</h3>
          <p className="text-sm text-light-400 text-center mt-1">
            {callStatus === CallStatus.ACTIVE
              ? isSpeaking
                ? "Speaking..."
                : "Listening..."
              : statusLabel}
          </p>
        </div>

        {/* User card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="Your profile"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
            {role && (
              <p className="text-sm text-light-400 capitalize">{role}</p>
            )}
          </div>
        </div>
      </div>

      {/* Transcript */}
      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Action button */}
      <div className="w-full flex justify-center">
        {callStatus === CallStatus.GENERATING_FEEDBACK ? (
          <div className="flex items-center gap-3 text-primary-200 font-semibold">
            <span className="animate-ping size-3 rounded-full bg-primary-200" />
            Analyzing your interview with Gemini AI...
          </div>
        ) : callStatus !== CallStatus.ACTIVE ? (
          <button
            className="relative btn-call"
            onClick={() => handleCall()}
            disabled={callStatus === CallStatus.CONNECTING}
          >
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />
            <span className="relative">{statusLabel}</span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End Interview
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
