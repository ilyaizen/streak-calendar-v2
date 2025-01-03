import { Providers } from "@/app/providers";
import { RootWrapper } from "@/components/root-wrapper";
import { Locale, defaultLocale, locales } from "@/i18n/settings";
import { cn } from "@/lib/utils";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

/**
 * Root layout component for locale-specific routes
 * Handles internationalization setup, font loading, and base layout structure
 */

// Load and configure Inter font with Latin subset for optimal performance
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

/**
 * Generate static paths for non-default locales at build time
 * Improves performance by pre-rendering locale-specific pages
 */
export function generateStaticParams() {
  return locales.filter((locale) => locale !== defaultLocale).map((locale) => ({ locale }));
}

/**
 * Layout component that wraps all pages within a locale segment
 * Handles:
 * - Locale validation and setup
 * - Message loading for translations
 * - Base styling and RTL support
 * - NoScript fallback
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate requested locale against supported ones
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Configure locale for the current request and load translations
  unstable_setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <body
      className={cn(
        inter.variable,
        "min-h-screen bg-background font-sans antialiased",
        "grid-background",
        // Enable RTL layout for Hebrew locale
        locale === "he" && "rtl"
      )}
    >
      {/* NoScript fallback for users with JavaScript disabled */}
      <noscript>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <p className="rounded border bg-card px-6 py-4 text-center shadow-lg">
            Please enable JavaScript to use this app.
          </p>
        </div>
      </noscript>

      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-muted/60 to-transparent" />

      {/* Main content wrapper with providers and root layout */}
      <div className="relative overflow-x-hidden">
        <Providers locale={locale} messages={messages}>
          <RootWrapper>{children}</RootWrapper>
        </Providers>
      </div>
    </body>
  );
}