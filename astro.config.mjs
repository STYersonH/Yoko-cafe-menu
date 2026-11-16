// @ts-check
import { defineConfig } from 'astro/config';
import lenis from 'astro-lenis';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { DEFAULT_LOCALE, LOCALES } from './src/i18n/locales.ts';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
  i18n: {
    defaultLocale: DEFAULT_LOCALE,
    locales: [...LOCALES],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  integrations: [lenis(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
