"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { signOut } from "@/lib/actions/auth.action";

const SignOutButton = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      await signOut();
      toast.success("Signed out successfully.");
      router.push("/sign-in");
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isPending}
      className="text-sm font-semibold text-light-100 hover:text-primary-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "Signing out..." : "Sign out"}
    </button>
  );
};

export default SignOutButton;
