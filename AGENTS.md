# Instrucciones del proyecto

Estas instrucciones proceden de las reglas de `.cursor/rules/` con `alwaysApply: true`.
Se aplican a todo el repositorio. Las reglas originales de Cursor se conservan para seguir usando ambos editores.

## Skills según la tarea

Antes de realizar una tarea que corresponda a alguna de estas skills, lee su `SKILL.md` y sigue sus instrucciones. Las rutas son relativas a la raíz del repositorio.

- Implementar diseños de Figma en Astro: [.agents/skills/ffs-figma-faithful-structure/SKILL.md](.agents/skills/ffs-figma-faithful-structure/SKILL.md).
- Resolver tamaños, constraints, Fill/Hug, máscaras o elementos con Ignore auto layout de Figma: [.agents/skills/alc-advanced-layouts-to-code/SKILL.md](.agents/skills/alc-advanced-layouts-to-code/SKILL.md).
- Incorporar imágenes raster de Figma: [.agents/skills/di-download-raw-images/SKILL.md](.agents/skills/di-download-raw-images/SKILL.md).
- Ordenar clases Tailwind seleccionadas, o petición `ots` / `order-tailwindcss-styles`: [.agents/skills/ots-order-tailwindcss-styles/SKILL.md](.agents/skills/ots-order-tailwindcss-styles/SKILL.md).
- Expandir un token tipográfico seleccionado, o petición `stt` / `split-text-token`: [.agents/skills/stt-split-text-token/SKILL.md](.agents/skills/stt-split-text-token/SKILL.md).

Varias skills pueden aplicar a la misma tarea de Figma. Lee las que correspondan. Si una skill necesita acceso a Figma o una herramienta que no está disponible, indica la limitación antes de sustituir datos del diseño por suposiciones.

# Frontend rules

## Breakpoints

| Prefix | Width |
| --- | --- |
| base (no prefix) | < 440px |
| `tb:` | 440px |
| `dk:` | 1025px |
| `dk-lg:` | 1600px |

Defined in `src/styles/global.css` as `--breakpoint-tb`, `--breakpoint-dk`, and `--breakpoint-dk-lg`.

## Units

Use `rem` for layout, type, and component sizing. This applies to Tailwind arbitrary values and inline styles. Root is 16: `px / 16 = rem`.

Prefer a token class when it already equals the resolved rem. Keep `%` for Scale constraints, unitless or `%` line-heights, and `deg` for rotate.

- `size-[7.5rem]` instead of `size-[120px]`
- `max-w-[100rem]` instead of `max-w-[1600px]`
- `style="width: 12rem"` instead of `style="width: 192px"`

# i18n

Guía: `docs/i18n.md`. Arranque de un sitio: `docs/setup.md`. Intro de la home: `docs/preloader.md`. Recarga: `docs/scroll-restoration.md`.

- Locales y default salen de `src/i18n/locales.ts`. `astro.config.mjs` los importa. Todos los idiomas llevan prefijo (`/en`, `/es`). `/` redirige al default.
- `es.ts` define `Translations`. `en.ts` se tipa contra ese tipo, con las mismas keys.
- Nada de strings de UI en Astro o TS. Namespace nuevo en `es` y `en`. La página pasa `lang` (`Astro.currentLocale`, o `DEFAULT_LOCALE` si falta).
- Links a una ruta conocida: `getRelativeLocaleUrl` de `astro:i18n`. Cambio de idioma de la URL actual: `getAlternateLocaleUrl`.
- Página nueva: secciones en `src/pages/_page/` (la carpeta `_` no es una URL). `src/components/` solo para lo que usan dos páginas, o el chrome. Ruta única en `src/pages/[lang]/`, con `getStaticPaths` sobre `LOCALES`.

```astro
---
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '../../i18n/locales';
import { DEFAULT_LOCALE } from '../../i18n/locales';
import { useTranslations } from '../../i18n/utils';

interface Props {
  lang?: Locale;
}

const { lang = DEFAULT_LOCALE } = Astro.props;
const t = useTranslations(lang);
---

<a href={getRelativeLocaleUrl(lang)}>{t.home.titleLine1}</a>
```

# Recarga y preloader

Guía: `docs/scroll-restoration.md`. Intro visual: `docs/preloader.md`.

El interruptor es uno solo: `RESTORE_SCROLL_ON_RELOAD` en `src/utils/scroll-restoration.ts`. No se duplica por página.

- `false`: recargar abre en el primer bloque, corre el preloader y el scroll queda bloqueado hasta que termina.
- `true`: recargar vuelve al mismo punto. Si el ancla ya quedó arriba de la pantalla, el preloader no corre.

## Página sin intro

No hagas nada. About, Contact y similares no llevan ancla, no montan preloader y no llaman al helper.

## Página con intro

Cablea estas cuatro piezas. El interruptor solo no basta.

1. **Ancla.** En el primer bloque visible: `data-home-anchor`. `applyScrollRestorationPolicy()` mira ese atributo. Si mudas el Hero, el atributo se muda con él.
2. **Política en la ruta.** En el `.astro` de la página, un `script is:inline` con `define:vars` de la constante: si es `false`, `history.scrollRestoration = 'manual'` y `window.scrollTo(0, 0)` durante el parseo. Un script de módulo llama a `applyScrollRestorationPolicy()`.
3. **Preloader.** Lo monta la ruta. Markup, copy y animación son de esa página. No copies el overlay de otro sitio.
4. **Decisión al arrancar.** En el `animation.ts` del preloader:
   - navegación interna (`data-astro-transition`): quitar sin animar
   - `false`: reproducir y bloquear el scroll en el inicio
   - `true`: `afterNativeScrollRestoration` (dos frames) y luego medir el ancla con `isElementAboveViewport`. Si ya pasó, quitar y no bloquear. Si se ve, reproducir sin mandar el scroll a `0`

```astro
<script is:inline define:vars={{ restoreScrollOnReload: RESTORE_SCROLL_ON_RELOAD }}>
  if (!restoreScrollOnReload && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }
</script>
```

# Una sola revisión visual

Al implementar o corregir una sección de UI, cierra así:

1. Escribe el layout y enganchalo a la página.
2. Si la ruta da 500 y el build pasa, reinicia el dev server una sola vez. Si responde 200, sigue.
3. Una captura de escritorio y una de móvil, comparadas con el frame.
4. Corrige solo lo que se vea mal en esas dos capturas (texto cortado, foto girada al revés, color distinto).
5. Para y di que está listo.

En esa pasada no midas píxeles, no abras Chrome por depuración, no recortes zonas, no parchees `node_modules` y no repitas el mismo diagnóstico. Si algo no cuadra y no se ve en la captura, dilo y espera.

Cierre: «Listo. Revisé 1280 y 375; el titular y el collage coinciden con el frame.»
