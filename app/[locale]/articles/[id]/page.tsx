import { getTranslations } from "next-intl/server";
import { Link } from "../../../../i18n/routing"; // Adjust path if needed
import { notFound } from "next/navigation";

// 1. Define interface for dynamic params
interface ArticlePageProps {
  params: Promise<{ locale: string; id: string }>;
}

// Mock data (Normally you fetch this from a Database or Markdown files)
const articlesData = [
  {
    id: "1",
    key: "article1",
    image:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200",
    date: "Март 2026",
    time: 7,
  },
  {
    id: "2",
    key: "article2",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=1200",
    date: "Февраль 2026",
    time: 5,
  },
  {
    id: "3",
    key: "article3",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=1200",
    date: "Январь 2026",
    time: 10,
  },
];

export default async function ArticlePage({ params }: ArticlePageProps) {
  // 2. Await params for Next.js 15 compatibility
  const { locale, id } = await params;

  // Find the article by ID from the URL
  const article = articlesData.find((a) => a.id === id);

  // If someone types a wrong ID in the URL, show 404 page
  if (!article) {
    notFound();
  }

  // Fetch translations
  const t = await getTranslations({ locale, namespace: "Blog" });

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Image Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative bg-gray-900">
        <img
          src={article.image}
          alt={t(`${article.key}.title`)}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-6 pb-12 w-full">
            <div className="flex items-center gap-4 text-emerald-400 font-bold text-sm mb-4">
              <span className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                {t(`${article.key}.category`)}
              </span>
              <span className="text-gray-300">{article.date}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {t(`${article.key}.title`)}
            </h1>
          </div>
        </div>
      </div>

      {/* Article Content Section */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        {/* Back button */}
        <Link
          href="/articles"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Назад к статьям
        </Link>

        {/* The actual text (Placeholder for now) */}
        <article className="prose prose-lg md:prose-xl prose-gray max-w-none">
          <p className="lead text-xl text-gray-600 mb-8 font-medium">
            {t(`${article.key}.excerpt`)}
          </p>

          <h2>Почему это важно?</h2>
          <p>
            Здесь будет находиться полный текст твоей статьи. В будущем мы
            подключим сюда реальную базу данных (например, Supabase) или
            настроим чтение файлов в формате Markdown, чтобы ты мог писать посты
            прямо в VS Code, как настоящий хакер.
          </p>

          <blockquote>
            <p>
              Налоги в Германии — это не просто математика, это стратегия.
              Правильный выбор может сэкономить вам тысячи евро в год.
            </p>
          </blockquote>

          <h3>Что делать дальше?</h3>
          <p>
            Пока ты читаешь этот текст, наш движок Next.js безупречно отрендерил
            эту страницу на сервере, обеспечив идеальное SEO и мгновенную
            загрузку.
          </p>
        </article>
      </div>
    </main>
  );
}
