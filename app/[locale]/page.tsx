import { getTranslations } from "next-intl/server";
import TaxCalculator from "../../components/TaxCalculator";

// 1. Updated interface for Next.js 15 (params is a Promise)
interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });

  const baseUrl = "https://steuer-helper.vercel.app";

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: baseUrl,
      siteName: "SteuerHelper",
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
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
