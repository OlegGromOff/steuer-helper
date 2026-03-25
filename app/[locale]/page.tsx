import { getTranslations } from "next-intl/server";
import TaxCalculator from "../../components/TaxCalculator";

// 1. Define asynchronous function to generate dynamic metadata based on locale
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  // Await params in Next.js 15+
  const { locale } = await params;

  // Fetch translations for the server component using the "SEO" namespace
  const t = await getTranslations({ locale, namespace: "SEO" });

  return {
    title: t("title"),
    description: t("description"),
    // Open Graph settings for Telegram, LinkedIn, Facebook
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://steuer-helper.vercel.app", // Update this later when we deploy
      siteName: "SteuerHelper",
      images: [
        {
          url: "/og-image.png", // Path to your preview image in the public folder
          width: 1200,
          height: 630,
          alt: "SteuerHelper Preview",
        },
      ],
      locale: locale,
      type: "website",
    },
    // Settings for Twitter (X)
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
  };
}

// 2. Main page component
export default function Home() {
  return (
    <main className="min-h-screen py-12">
      <TaxCalculator />
    </main>
  );
}
