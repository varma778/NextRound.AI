import Link from "next/link";
import Image from "next/image";

import FirestoreSetupBanner from "@/components/FirestoreSetupBanner";
import InterviewCard from "@/components/InterviewCard";
import PortfolioSection from "@/components/PortfolioSection";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/branding";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  isFirestoreReady,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";

const FEATURES = [
  {
    title: "Autopilot Voice Interviews",
    desc: "Vapi AI runs the full session — questions, follow-ups, and pacing handled for you.",
  },
  {
    title: "Gemini-Powered Feedback",
    desc: "Instant scores across communication, technical depth, problem-solving, and culture fit.",
  },
  {
    title: "Internship-Ready Templates",
    desc: "Pre-built tracks for SWE, ML, PM, and Data Science intern roles at top tech companies.",
  },
];

async function Home() {
  const user = await getCurrentUser();

  if (!user?.id) {
    return (
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <p className="text-primary-200 font-semibold text-sm uppercase tracking-wider">
            Built for internship prep
          </p>
          <h2>{BRAND.tagline}</h2>
          <p className="text-lg">{BRAND.shortDescription}</p>
          <Link href="/sign-in">
            <Button size="lg" className="btn-primary">
              Get Started Free
            </Button>
          </Link>
        </div>
        <Image
          src="/robot.png"
          alt="NextRound.ai interview prep"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>
    );
  }

  const [userInterviews, allInterview, firestoreReady] = await Promise.all([
    getInterviewsByUserId(user.id),
    getLatestInterviews({ userId: user.id }),
    isFirestoreReady(),
  ]);

  // Batch-fetch all feedback in parallel — eliminates N+1 per InterviewCard
  const userFeedbackMap = new Map<string, Feedback | null>();
  if (userInterviews?.length) {
    const feedbacks = await Promise.all(
      userInterviews.map((iv) =>
        getFeedbackByInterviewId({ interviewId: iv.id, userId: user.id })
      )
    );
    userInterviews.forEach((iv, i) => userFeedbackMap.set(iv.id, feedbacks[i]));
  }

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterview?.length ?? 0) > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-xl">
          <p className="text-primary-200 font-semibold text-sm uppercase tracking-wider">
            Welcome back, {user.name?.split(" ")[0] || "candidate"}
          </p>
          <h2>Your next round starts here.</h2>
          <p className="text-lg">
            Launch an autopilot mock interview in under 30 seconds. Get
            AI feedback you can put on your resume portfolio.
          </p>

          <Button asChild className="btn-primary max-sm:w-full w-fit">
            <Link href="/interview">Launch Autopilot Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="NextRound.ai AI interviewer"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="card p-6 flex flex-col gap-2">
            <h3 className="text-lg text-primary-100">{feature.title}</h3>
            <p className="text-sm">{feature.desc}</p>
          </div>
        ))}
      </section>

      {!firestoreReady && <FirestoreSetupBanner />}

      <PortfolioSection />

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={userFeedbackMap.get(interview.id)}
              />
            ))
          ) : (
            <p className="text-light-400">
              No interviews yet. Hit &quot;Launch Autopilot Interview&quot; to
              start practicing.
            </p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Community Interviews</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard
                key={interview.id}
                userId={user.id}
                interviewId={interview.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
                feedback={null}
              />
            ))
          ) : (
            <p className="text-light-400">
              Community interviews appear here once Firestore is enabled.
            </p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
