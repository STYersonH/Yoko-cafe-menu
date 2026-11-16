# Recarga y preloader

Un interruptor decide qué pasa al recargar el Home. La intro en sí está en [preloader.md](./preloader.md).

---

## Dónde se enciende

```ts
// src/utils/scroll-restoration.ts
export const RESTORE_SCROLL_ON_RELOAD = false;
```

Esa constante es el único lugar. Por defecto está en `false`.

| Valor   | Al recargar el Home |
| :------ | :------------------ |
| `false` | Abre en el Hero. Corre el preloader. El scroll queda bloqueado hasta que termina. |
| `true`  | Vuelve al mismo punto de la página. Si ese punto ya pasó el Hero, el preloader no corre y el scroll no se bloquea. |

La navegación interna no usa este interruptor. Un enlace, el cambio de idioma o volver desde otra página siguen sin mostrar el preloader.

---

## Piezas

```text
src/utils/scroll-restoration.ts           el interruptor y los helpers
src/pages/[lang]/index.astro              aplica la política al parsear y al navegar
src/pages/_home/hero/Hero.astro           data-home-anchor
src/pages/_home/preloader/animation.ts    reproduce o quita el preloader según el interruptor
```

`applyScrollRestorationPolicy()` mira si existe `[data-home-anchor]`. Si el Home no está en pantalla, no mueve el scroll: About y el resto restauran su posición como siempre.

`afterNativeScrollRestoration(callback)` espera dos pintados del navegador y recién entonces corre el callback. Con el interruptor en `true`, eso deja aplicar el scroll guardado antes de medir si el Hero se ve.

`isElementAboveViewport(element)` es verdadero cuando el borde inferior del elemento ya quedó por encima de la pantalla.

---

## Cómo usarlo en un sitio nuevo

1. Deja `RESTORE_SCROLL_ON_RELOAD` en `false` si cada visita al Home debe empezar en el Hero con la intro.
2. Pásalo a `true` si recargar debe devolver a la persona al mismo punto.
3. El ancla del Home es `data-home-anchor`. Si el Hero cambia de archivo, ese atributo tiene que seguir en el bloque que ocupa el primer viewport.
4. No copies el markup del preloader de otro proyecto. Este helper no anima: solo decide cuándo dejar correr la intro de este sitio.
