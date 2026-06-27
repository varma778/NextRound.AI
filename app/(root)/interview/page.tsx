import Agent from "@/components/Agent";
import QuickStartForm from "@/components/QuickStartForm";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="text-primary-200 font-semibold text-sm uppercase tracking-wider">
          Fast track
        </p>
        <h3>Launch an autopilot interview</h3>
        <p className="text-light-400 max-w-2xl">
          Pick your role, generate tailored questions with Gemini, and jump
          straight into a live Vapi voice session — no manual setup.
        </p>
        <QuickStartForm userId={user?.id!} />
      </section>

      <section className="flex flex-col gap-4 border-t border-dark-200 pt-10">
        <p className="text-primary-200 font-semibold text-sm uppercase tracking-wider">
          Voice mode
        </p>
        <h3>Or create via voice assistant</h3>
        <p className="text-light-400 max-w-2xl">
          Talk to the AI to configure your interview hands-free. Requires Vapi
          workflow credentials.
        </p>

        <Agent
          userName={user?.name!}
          userId={user?.id}
          type="generate"
        />
      </section>
    </div>
  );
};

export default Page;
