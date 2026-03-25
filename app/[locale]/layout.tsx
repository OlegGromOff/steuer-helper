import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { Analytics } from "@vercel/analytics/react";
import Header from "../../components/Header"; // <--- 1. Import Header
import Footer from "../../components/Footer"; // <--- 2. Import Footer

import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en" | "de")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-gray-50 antialiased flex flex-col min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {/* Main App Layout */}
          <Header />

          {/* The flex-grow ensures the footer is pushed to the bottom even if content is short */}
          <div className="flex-grow">{children}</div>

          <Footer />
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  );
}
