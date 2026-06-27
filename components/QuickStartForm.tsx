"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { GOOGLE_INTERNSHIP_ROLES } from "@/constants/branding";
import { createInterview } from "@/lib/actions/general.action";

const LEVELS = ["Intern", "Junior", "Mid-Level", "Senior"] as const;
const TYPES = ["Technical", "Behavioral", "Mixed"] as const;

const ROLE_DEFAULTS: Record<string, { tech: string; type: string }> = {
  "Software Engineering Intern": {
    tech: "Python, Java, Data Structures, Algorithms, System Design",
    type: "Technical",
  },
  "Machine Learning Intern": {
    tech: "Python, TensorFlow, PyTorch, Statistics, ML Systems",
    type: "Technical",
  },
  "Data Science Intern": {
    tech: "Python, SQL, Statistics, Pandas, Data Visualization",
    type: "Mixed",
  },
  "Product Manager Intern": {
    tech: "Product Strategy, Metrics, User Research, Roadmapping",
    type: "Behavioral",
  },
  "UX Design Intern": {
    tech: "Figma, User Research, Prototyping, Design Systems",
    type: "Mixed",
  },
  "Cloud Engineering Intern": {
    tech: "GCP, Kubernetes, Docker, Networking, Linux",
    type: "Technical",
  },
};

const QuickStartForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<string>(GOOGLE_INTERNSHIP_ROLES[0]);
  const [level, setLevel] = useState<string>("Intern");
  const [type, setType] = useState<string>("Technical");
  const [techstack, setTechstack] = useState(
    ROLE_DEFAULTS[GOOGLE_INTERNSHIP_ROLES[0]].tech
  );
  const [amount, setAmount] = useState(5);

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    const defaults = ROLE_DEFAULTS[newRole];
    if (defaults) {
      setTechstack(defaults.tech);
      setType(defaults.type);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createInterview({
        userId,
        role,
        level,
        type,
        techstack,
        amount,
      });

      if (result.success && result.interviewId) {
        toast.success("Interview ready! Starting autopilot session...");
        router.push(`/interview/${result.interviewId}?autopilot=1`);
        return;
      }

      toast.error(result.message || "Failed to create interview.");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form space-y-5 w-full max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2">
          <span className="label">Target Role</span>
          <select
            className="input"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
          >
            {GOOGLE_INTERNSHIP_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">Experience Level</span>
          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">Interview Type</span>
          <select
            className="input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="label">Number of Questions</span>
          <select
            className="input"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          >
            {[3, 5, 7, 10].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="label">Tech Stack / Focus Areas</span>
        <input
          className="input"
          value={techstack}
          onChange={(e) => setTechstack(e.target.value)}
          placeholder="e.g. Python, Algorithms, System Design"
        />
      </label>

      <Button type="submit" className="btn w-full" disabled={isPending}>
        {isPending ? "Generating interview..." : "Launch Autopilot Interview"}
      </Button>
    </form>
  );
};

export default QuickStartForm;
