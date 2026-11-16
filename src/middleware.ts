import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LOCALE } from './i18n/locales';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname === '/') {
    return context.redirect(`/${DEFAULT_LOCALE}`, 301);
  }

  return next();
});
