"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../i18n/routing";
import { ChangeEvent, useTransition } from "react";

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  // Handle language change
  const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    startTransition(() => {
      // Replace the current URL with the new locale prefix
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="relative inline-block">
      <select
        value={locale}
        onChange={onSelectChange}
        disabled={isPending}
        className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium cursor-pointer transition-colors hover:bg-gray-200 disabled:opacity-50"
      >
        <option value="ru">RU</option>
        <option value="en">EN</option>
        <option value="de">DE</option>
      </select>
      {/* Custom arrow icon for the select dropdown */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
