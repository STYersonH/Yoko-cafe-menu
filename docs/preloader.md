# Preloader

Pantalla de entrada de una página. La demo lo usa en la home. About no lo tiene.

El arranque del sitio está en [setup.md](./setup.md). El copy y las rutas, en [i18n.md](./i18n.md).

La animación de la demo se puede reemplazar. Estas reglas no dependen de ella.

---

## Dónde vive

Lo monta la ruta de la página, no una sección.

```text
src/pages/[lang]/index.astro              <Preloader lang={lang} />
src/pages/_home/preloader/Preloader.astro markup y estilos
src/pages/_home/preloader/animation.ts    la animación
```

El componente recibe `lang` y llama a `useTranslations`. El texto visible sale de las traducciones, en `es.ts` y en `en.ts`. El script vive en el propio componente e importa su `animation.ts`. Las secciones de al lado no saben que existe.

Si otra página necesita el mismo preloader, se muda a `src/components/`. Mientras sea de una sola página, se queda en `src/pages/_page/preloader/`.

---

## Cuándo se muestra

Solo en una carga completa de esa página: la primera visita y, según el interruptor, cada recarga.

No se repite al navegar. Un enlace interno, el cambio de idioma o volver desde otra página entran directo. Durante esa navegación Astro marca `<html>` con `data-astro-transition`. El preloader tiene que esconderse en ese caso y quitarse sin animar.

La recarga la decide `RESTORE_SCROLL_ON_RELOAD` en `src/utils/scroll-restoration.ts`. El detalle está en [scroll-restoration.md](./scroll-restoration.md):

- `false`: recargar abre en el Hero y corre el preloader.
- `true`: recargar vuelve al mismo punto. Si el Hero ya quedó arriba de la pantalla, el preloader se quita y no bloquea el scroll.

Si el usuario sale de la página a mitad de la intro, hay que cortar la animación y devolver el scroll. El layout usa `ClientRouter`, así que el script escucha `astro:page-load` para arrancar y `astro:before-preparation` para limpiar.

---

## Al cambiar la animación

Se puede cambiar el markup, el CSS y `animation.ts`. Esto se mantiene:

- El copy sigue en los dos archivos de traducción.
- Sigue montado desde la ruta, con `lang`.
- Sigue sin aparecer en una navegación entre páginas.
- Mientras está en pantalla, no se puede scrollear. Con el interruptor en `false`, la página queda al inicio. Con el interruptor en `true` y el Hero todavía visible, se conserva el punto restaurado. El scroll se libera al terminar y al salir de la página.
- Al acabar, el overlay sale del DOM para no tapar la página.
