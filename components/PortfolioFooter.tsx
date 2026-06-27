import Link from "next/link";

import { AUTHOR, BRAND } from "@/constants/branding";

const PortfolioFooter = () => {
  return (
    <footer className="mt-16 pt-8 border-t border-dark-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-light-400">
      <div className="flex flex-col gap-1 text-center sm:text-left">
        <p>
          Built by{" "}
          <span className="text-primary-200 font-semibold">{AUTHOR.name}</span>
        </p>
        <p>
          {BRAND.name} — AI Interview Platform for Internship Prep
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href={AUTHOR.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-200 transition-colors font-medium"
        >
          GitHub @{AUTHOR.githubUsername}
        </Link>
        <Link
          href={AUTHOR.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary-200 transition-colors font-medium"
        >
          LinkedIn
        </Link>
      </div>
    </footer>
  );
};

export default PortfolioFooter;
