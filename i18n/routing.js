// Define supported locales
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['ru', 'en', 'de'],
  defaultLocale: 'ru' // default locale to use when the detected locale is not supported
});
 
// Export lightweight wrappers for navigation APIs
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);