"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BRAND } from "@/constants/branding";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex items-center justify-center size-12 rounded-xl blue-gradient font-bold text-dark-100 text-lg">
        NR
      </div>
      <h1 className="text-2xl font-semibold text-primary-100">
        Something went wrong
      </h1>
      <p className="text-light-400 max-w-md">
        {BRAND.name} hit an unexpected error. This is usually a temporary issue
        with auth or database connectivity. Try again or sign in fresh.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} className="btn-primary">
          Try Again
        </Button>
        <Button asChild className="btn-secondary">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      </div>
    </div>
  );
}
