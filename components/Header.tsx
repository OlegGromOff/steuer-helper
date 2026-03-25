"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const t = useTranslations("Navigation");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
          <Link
            href="/articles"
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

        {/* Right Side: Language Switcher & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* Language Switcher - visible on all screens */}
          <LanguageSwitcher />

          {/* Hamburger Button (Mobile Only) */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-emerald-500 focus:outline-none transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              // Close Icon (X)
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger Menu Icon
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Visible only when isMobileMenuOpen is true) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl z-40">
          <nav className="flex flex-col px-6 py-6 gap-6 font-medium text-gray-600">
            {/* Adding onClick to close menu after clicking a link */}
            <Link
              href="/"
              onClick={toggleMenu}
              className="hover:text-emerald-500 transition-colors block text-lg"
            >
              {t("calculator")}
            </Link>
            <Link
              href="/articles"
              onClick={toggleMenu}
              className="hover:text-emerald-500 transition-colors block text-lg"
            >
              {t("articles")}
            </Link>
            <Link
              href="#news"
              onClick={toggleMenu}
              className="hover:text-emerald-500 transition-colors block text-lg"
            >
              {t("news")}
            </Link>
            <Link
              href="#about"
              onClick={toggleMenu}
              className="hover:text-emerald-500 transition-colors block text-lg"
            >
              {t("about")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
