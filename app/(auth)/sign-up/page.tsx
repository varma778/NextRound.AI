import type { Metadata } from "next";

import AuthForm from "@/components/AuthForm";
import { BRAND } from "@/constants/branding";

export const metadata: Metadata = {
  title: "Sign Up",
  description: `Create your ${BRAND.name} account — ${BRAND.shortDescription}`,
};

const Page = () => {
  return <AuthForm type="sign-up" />;
};

export default Page;
