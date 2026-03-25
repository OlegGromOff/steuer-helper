import { getTranslations } from "next-intl/server";
import TaxCalculator from "../../components/TaxCalculator";

interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "SEO" });

  const baseUrl = "https://steuer-helper.vercel.app";
  const imageUrl = `${baseUrl}/og.jpg`;

  return {
    metadataBase: new URL(baseUrl),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: baseUrl,
      siteName: "SteuerHelper",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "SteuerHelper Preview",
        },
      ],
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [imageUrl],
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
