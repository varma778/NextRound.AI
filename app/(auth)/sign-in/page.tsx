import type { Metadata } from "next";

import AuthForm from "@/components/AuthForm";
import { BRAND } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Sign In",
  description: `Sign in to ${BRAND.name} — ${BRAND.shortDescription}`,
};

const Page = () => {
  return <AuthForm type="sign-in" />;
};

export default Page;
