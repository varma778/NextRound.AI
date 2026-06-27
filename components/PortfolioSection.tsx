import Link from "next/link";

import { AUTHOR, BRAND } from "@/constants/branding";

const PortfolioSection = () => {
  return (
    <section className="card p-8 flex flex-col gap-4 mt-4">
      <p className="text-primary-200 font-semibold text-sm uppercase tracking-wider">
        Portfolio Project
      </p>
      <h3 className="text-xl text-primary-100">
        Built by {AUTHOR.name}
      </h3>
      <p className="text-light-400 text-sm max-w-2xl">
        {BRAND.name} is a full-stack AI interview platform showcasing Next.js 15,
        Firebase, Vapi voice agents, and Google Gemini — designed for internship
        preparation at top tech companies.
      </p>
      <div className="flex flex-wrap gap-3 mt-2">
        <Link
          href={AUTHOR.github}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-5 py-2 rounded-full text-sm font-bold"
        >
          GitHub @{AUTHOR.githubUsername}
        </Link>
        <Link
          href={AUTHOR.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-5 py-2 rounded-full text-sm font-bold"
        >
          LinkedIn Profile
        </Link>
      </div>
    </section>
  );
};

export default PortfolioSection;
