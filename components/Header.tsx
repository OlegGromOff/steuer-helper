import { useTranslations } from "next-intl";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Navigation");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo area */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500 text-white font-bold text-xl w-10 h-10 flex items-center justify-center rounded-xl group-hover:bg-emerald-600 transition-colors">
            SH
          </div>
          <span className="font-extrabold text-2xl text-gray-900 tracking-tight">
            Steuer<span className="text-emerald-500">Helper</span>
          </span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <Link href="/" className="hover:text-emerald-500 transition-colors">
            {t("calculator")}
          </Link>
          {/* Temporary anchor links, replace with real routes later */}
          <Link
            href="#articles"
            className="hover:text-emerald-500 transition-colors"
          >
            {t("articles")}
          </Link>
          <Link
            href="#news"
            className="hover:text-emerald-500 transition-colors"
          >
            {t("news")}
          </Link>
          <Link
            href="#about"
            className="hover:text-emerald-500 transition-colors"
          >
            {t("about")}
          </Link>
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
