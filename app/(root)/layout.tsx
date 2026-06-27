import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import PortfolioFooter from "@/components/PortfolioFooter";
import SignOutButton from "@/components/SignOutButton";
import { AUTHOR, BRAND } from "@/constants/branding";
import { getCurrentUser, isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  const user = await getCurrentUser();

  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center size-9 rounded-xl blue-gradient font-bold text-dark-100 text-sm">
            NR
          </div>
          <div className="flex flex-col leading-tight">
            <h2 className="text-primary-100 text-lg font-bold group-hover:text-white transition-colors">
              {BRAND.name}
            </h2>
            <span className="text-xs text-light-400 hidden sm:block">
              by {AUTHOR.name}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={AUTHOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-light-400 hover:text-primary-200 hidden md:block"
          >
            GitHub
          </Link>
          <Link
            href={AUTHOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-light-400 hover:text-primary-200 hidden md:block"
          >
            LinkedIn
          </Link>
          {user?.name && (
            <span className="text-sm text-light-400 hidden sm:block">
              {user.name}
            </span>
          )}
          <SignOutButton />
        </div>
      </nav>

      {children}

      <PortfolioFooter />
    </div>
  );
};

export default Layout;
