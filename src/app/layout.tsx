import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.streakcalendar.com"),
  title: "Streak Calendar - Build Better Habits",
  description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
  keywords: [
    "habit tracking",
    "streak calendar",
    "productivity",
    "daily routine",
    "habit builder",
    "goal tracking",
    "anti-procrastination",
  ],
  openGraph: {
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
    type: "website",
    siteName: "Streak Calendar",
    url: "https://www.streakcalendar.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Streak Calendar - Build Better Habits",
    description: "Track your daily habits, build streaks, and achieve your goals with visual progress tracking",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased")}>
        <Providers>
          <div className="flex min-h-screen max-w-7xl mx-auto flex-col">
            <AppHeader />
            {children}
            <AppFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
