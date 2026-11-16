# Configuración al arrancar un sitio

Pasos para un proyecto nuevo a partir de esta plantilla. El detalle de rutas, copy y secciones está en [i18n.md](./i18n.md). La intro de la home está en [preloader.md](./preloader.md). Si recargar debe volver al mismo punto o siempre al Hero, está en [scroll-restoration.md](./scroll-restoration.md).

Node `>=22.12.0`.

---

## 1. Instalar y ver la demo

```bash
bun install
bun dev
```

`/` redirige a `/en`. La home en español es `/es`. About es `/en/about` y `/es/about`.

Eso ya está cableado. No hace falta crear el sistema de idiomas ni duplicar páginas por locale.

---

## 2. Identidad del sitio

| Qué | Dónde |
| --- | ----- |
| Nombre del paquete | `package.json` → `name` |
| Fuente | `src/layouts/Layout.astro` (el `<link>` de Google Fonts) y `src/styles/global.css` (`--font-sans`, `--font-serif`) |
| Icono | `public/favicon.svg` |
| Título de fallback | `src/layouts/Layout.astro`. El título real de cada página sale de las traducciones (`t.home.metaTitle`, etc.) |

Los breakpoints ya están en `global.css`: base `< 440px`, `tb` `440px`, `dk` `1025px`, `dk-lg` `1600px`. Las medidas van en `rem`.

---

## 3. Idioma por defecto

[`src/i18n/locales.ts`](../src/i18n/locales.ts) es la única lista. `astro.config.mjs` la importa.

```ts
export const LOCALES = ['en', 'es'] as const;
export const DEFAULT_LOCALE: Locale = 'en';
```

`DEFAULT_LOCALE` solo decide a dónde manda `/`. [`src/middleware.ts`](../src/middleware.ts) redirige ahí. Inglés y español llevan prefijo igual: `/en` y `/es`.

Deja `prefixDefaultLocale: true`. Si lo pasas a `false`, el idioma por defecto pierde el prefijo y cada página vuelve a necesitar dos archivos de ruta.

---

## 4. Recarga del Home

[`src/utils/scroll-restoration.ts`](../src/utils/scroll-restoration.ts) decide qué pasa al recargar.

```ts
export const RESTORE_SCROLL_ON_RELOAD = false;
```

| Valor   | Al recargar |
| :------ | :---------- |
| `false` | El Home abre en el Hero, corre el preloader y no se puede scrollear hasta que termina. |
| `true`  | Vuelve al mismo punto. Si ese punto ya pasó el Hero, el preloader no corre. |

Esa constante es el único interruptor. El Hero de la home lleva `data-home-anchor`; si lo mudas, ese atributo tiene que seguir en el primer bloque visible. El detalle está en [scroll-restoration.md](./scroll-restoration.md).

---

## 5. Quitar la demo

Home y About son el ejemplo. Si no van en el sitio:

- Borra `src/pages/[lang]/about.astro` y `src/pages/_about/`.
- Borra `src/pages/_home/` si vas a rehacer la home, y deja `src/pages/[lang]/index.astro` como la ruta. Eso se lleva el preloader. Si la home nueva no lo usa, quita también `<Preloader />` de esa ruta. El comportamiento está en [preloader.md](./preloader.md).
- Quita los namespaces `home`, `homeSteps` y `about` en `src/i18n/translations/es.ts` y `en.ts`.
- Quita los links de About en `header.links` de los dos archivos.

No borres `src/i18n/`, `src/middleware.ts`, `src/components/header/` ni `src/pages/[lang]/`.

---

## 6. Una página nueva

1. Secciones en `src/pages/_nombre/`. La carpeta con `_` no es una URL.
2. Una sola ruta: `src/pages/[lang]/nombre.astro`, con `getStaticPaths` sobre `LOCALES` y `const { lang } = Astro.params`.
3. La ruta pasa `lang` a cada sección. La sección llama a `useTranslations(lang)` y les pasa strings a sus piezas.
4. El mismo namespace en `es.ts` y en `en.ts`. `es.ts` define el tipo.
5. Links con `getRelativeLocaleUrl(lang, 'nombre')`.
6. Si el header debe mostrarla, agrega el slug en `header.links` de los dos idiomas.

`src/components/` es para el header y para lo que usen dos páginas. Una pieza que solo vive en Home se queda en `src/pages/_home/`.

Checklist completo: [i18n.md](./i18n.md).

---

## 7. Otro idioma

1. Agrégalo a `LOCALES` en `src/i18n/locales.ts`.
2. Crea `src/i18n/translations/fr.ts` (o el código que sea) tipado contra `Translations`.
3. Regístralo en el objeto `translations` de `src/i18n/utils.ts`.
4. Agrega su nombre en `localeNames` de todos los archivos de traducción.

No copies `src/pages/[lang]/`. Esa carpeta ya genera `/fr` y `/fr/about` porque `getStaticPaths` recorre `LOCALES`.
