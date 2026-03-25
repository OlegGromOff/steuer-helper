import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Footer() {
  const t = useTranslations("Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 border-b border-gray-800 pb-8">
          <div className="text-2xl font-extrabold text-white tracking-tight">
            Steuer<span className="text-emerald-500">Helper</span>
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link
              href="#impressum"
              className="hover:text-white transition-colors"
            >
              {t("impressum")}
            </Link>
            <Link
              href="#privacy"
              className="hover:text-white transition-colors"
            >
              {t("privacy")}
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>
            © {currentYear} SteuerHelper. {t("rights")}
          </p>
          <p className="max-w-xl text-center md:text-right text-gray-500 text-xs">
            {t("disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
