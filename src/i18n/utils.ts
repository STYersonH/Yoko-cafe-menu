import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Translations } from './translations/es';
import type { Locale } from './locales';
import { LOCALES } from './locales';
import es from './translations/es';
import en from './translations/en';

const translations = { en, es } satisfies Record<Locale, Translations>;

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join('|')})(?=/|$)`);

export function useTranslations(lang: Locale) {
  return translations[lang];
}

/** Current URL with the locale prefix swapped. `astro:i18n` does not strip one that is already there. */
export function getAlternateLocaleUrl(pathname: string, locale: Locale) {
  const unprefixed = pathname.replace(LOCALE_PREFIX, '') || '/';
  const path = unprefixed === '/' ? undefined : unprefixed.replace(/^\//, '');
  return getRelativeLocaleUrl(locale, path);
}
