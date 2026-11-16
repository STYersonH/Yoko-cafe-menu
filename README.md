# Astro + GSAP Template

Plantilla mínima lista para clonar con Astro, GSAP, React, Tailwind CSS y Lenis.

## Stack

- [Astro](https://astro.build)
- [GSAP](https://gsap.com)
- [React](https://react.dev) (`@astrojs/react`)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lenis](https://lenis.darkroom.engineering) (`astro-lenis`)
- [Vercel adapter](https://docs.astro.build/en/guides/deploy/vercel/)

## Estructura

```text
/
├── public/
│   └── favicon.svg
├── docs/
│   ├── i18n.md
│   ├── preloader.md
│   ├── scroll-restoration.md
│   └── setup.md
├── src/
│   ├── i18n/
│   │   ├── locales.ts
│   │   ├── utils.ts
│   │   └── translations/
│   ├── components/
│   │   └── header/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── utils/
│   │   └── scroll-restoration.ts
│   ├── pages/
│   │   ├── [lang]/
│   │   ├── _home/
│   │   └── _about/
│   └── styles/
│       └── global.css
├── astro.config.mjs
└── package.json
```

## Idiomas

Español e inglés, los dos con prefijo: `/en` y `/es`. `/` redirige a `/en`. El copy vive en `src/i18n/translations/`. Cómo agregar una página o un idioma está en [docs/i18n.md](docs/i18n.md).

## Comandos

| Comando         | Acción                                      |
| :-------------- | :------------------------------------------ |
| `bun install`   | Instala dependencias                        |
| `bun dev`       | Servidor local en `localhost:4321`          |
| `bun build`     | Build de producción en `./dist/`            |
| `bun preview`   | Preview del build local                     |

## Uso

1. Clona el repositorio.
2. Ejecuta `bun install`.
3. Sigue [docs/setup.md](docs/setup.md). El detalle de páginas e idiomas está en [docs/i18n.md](docs/i18n.md). La intro de la home está en [docs/preloader.md](docs/preloader.md). El interruptor de recarga está en [docs/scroll-restoration.md](docs/scroll-restoration.md).
