import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AUTHOR, BRAND } from "@/constants/branding";
import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="auth-layout flex flex-col gap-8">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center size-9 rounded-xl blue-gradient font-bold text-dark-100 text-sm">
          NR
        </div>
        <span className="text-primary-100 font-bold text-lg">{BRAND.name}</span>
      </div>
      {children}
      <p className="text-center text-sm text-light-400">
        Built by{" "}
        <Link
          href={AUTHOR.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-200 hover:underline"
        >
          {AUTHOR.name}
        </Link>
        {" · "}
        <Link
          href={AUTHOR.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-200 hover:underline"
        >
          GitHub
        </Link>
      </p>
    </div>
  );
};

export default AuthLayout;
