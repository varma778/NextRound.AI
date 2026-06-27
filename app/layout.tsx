import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Toaster } from "sonner";

import { BRAND } from "@/constants/branding";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description: BRAND.description,
  keywords: [
    "mock interview",
    "AI interview",
    "internship prep",
    "Google interview",
    "voice AI",
    "NextRound.ai",
  ],
  applicationName: BRAND.name,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${monaSans.className} antialiased pattern`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
