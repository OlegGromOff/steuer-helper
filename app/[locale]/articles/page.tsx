import { useTranslations } from "next-intl";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

// 1. SEO Metadata for the Articles page
interface LocalePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return {
    title: `${t("title")} | SteuerHelper`,
    description: t("subtitle"),
  };
}

// 2. Mock data for the articles (in a real app, you'd fetch this from a CMS or API)
const articlesData = [
  {
    id: 1,
    key: "article1",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    date: "Март 2026",
    time: 7,
  },
  {
    id: 2,
    key: "article2",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800",
    date: "Февраль 2026",
    time: 5,
  },
  {
    id: 3,
    key: "article3",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
    date: "Январь 2026",
    time: 10,
  },
];

export default function ArticlesPage() {
  const t = useTranslations("Blog");

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">{t("subtitle")}</p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`} // Dummy link for now
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image Container with Zoom Effect */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={article.image}
                  alt={t(`${article.key}.title`)}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  {t(`${article.key}.category`)}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{t("readTime", { minutes: article.time })}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {t(`${article.key}.title`)}
                </h2>

                <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">
                  {t(`${article.key}.excerpt`)}
                </p>

                <div className="text-emerald-500 font-semibold text-sm flex items-center mt-auto">
                  {t("readMore")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
