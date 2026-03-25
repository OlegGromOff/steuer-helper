import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import "../globals.css"; // Make sure Tailwind styles are connected

export default async function LocaleLayout({ children, params }) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // Validate the incoming locale
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Fetch the dictionary for the current language
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="bg-gray-50 antialiased">
        {/* Wrap the app to provide translations to client components */}
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
