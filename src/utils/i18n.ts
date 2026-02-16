/**
 * i18n Utility Functions
 * Translation helpers for German and English
 */

import deTranslations from '../i18n/de.json';
import enTranslations from '../i18n/en.json';

export type Language = 'de' | 'en';

const translations = {
  de: deTranslations,
  en: enTranslations,
};

/**
 * Get a translated string by key
 * @param lang - Language code ('de' or 'en')
 * @param key - Dot-notation key (e.g., 'nav.home', 'services.software.title')
 * @returns Translated string or the key if not found
 */
export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      return key;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get the alternate language
 * @param lang - Current language
 * @returns Alternate language
 */
export function getAlternateLang(lang: Language): Language {
  return lang === 'de' ? 'en' : 'de';
}

/**
 * Get language from URL path
 * @param pathname - URL pathname
 * @returns Language code
 */
export function getLangFromPath(pathname: string): Language {
  return pathname.startsWith('/en') ? 'en' : 'de';
}

/**
 * Convert German URL to English and vice versa
 * @param lang - Current language
 * @param path - Current path
 * @returns Alternate language path
 */
export function getAlternateUrl(lang: Language, path: string): string {
  if (lang === 'de') {
    // German to English
    if (path === '/') return '/en';
    if (path === '/dienstleistungen') return '/en/services';
    if (path === '/uber-mich') return '/en/about';
    if (path === '/portfolio') return '/en/portfolio';
    if (path === '/blog') return '/en/blog';
    if (path === '/kontakt') return '/en/contact';
    if (path.startsWith('/portfolio/'))
      return path.replace('/portfolio/', '/en/portfolio/');
    if (path.startsWith('/blog/')) return path.replace('/blog/', '/en/blog/');
    return '/en' + path;
  } else {
    // English to German
    if (path === '/en' || path === '/en/') return '/';
    if (path === '/en/services') return '/dienstleistungen';
    if (path === '/en/about') return '/uber-mich';
    if (path === '/en/portfolio') return '/portfolio';
    if (path === '/en/blog') return '/blog';
    if (path === '/en/contact') return '/kontakt';
    if (path.startsWith('/en/portfolio/'))
      return path.replace('/en/portfolio/', '/portfolio/');
    if (path.startsWith('/en/blog/'))
      return path.replace('/en/blog/', '/blog/');
    return path.replace('/en', '');
  }
}
