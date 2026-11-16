/**
 * Dish preview: the tapped photo flies from its spot on the list to the centre
 * while the page blurs behind it. Then the name rises in above it and the
 * description, price and note settle in below. Closing plays it backwards and
 * lands the photo exactly where it was.
 *
 * Markup: `[data-dish-trigger]` buttons inside `[data-motion="item"]` rows,
 * and one `DishViewer.astro` on the page.
 */
import gsap from 'gsap';

type LenisLike = { stop: () => void; start: () => void };

interface OpenDish {
  trigger: HTMLButtonElement;
  source: HTMLImageElement;
  clone: HTMLImageElement;
}

/** Inline properties the tweens write on the copy, cleared after closing. */
const GSAP_PROPS = 'transform,translate,rotate,scale,opacity,visibility';

const FLIGHT_EASE = 'expo.inOut';

let current: OpenDish | null = null;
let timeline: gsap.core.Timeline | null = null;
let closing = false;

const getLenis = () => (window as Window & { lenis?: LenisLike }).lenis;
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

function parts() {
  const viewer = document.querySelector<HTMLElement>('[data-dish-viewer]');
  if (!viewer) return null;
  const get = (selector: string) => viewer.querySelector<HTMLElement>(selector)!;
  return {
    viewer,
    veil: get('[data-dish-veil]'),
    frame: get('[data-dish-frame]'),
    name: get('[data-dish-viewer-name]'),
    description: get('[data-dish-viewer-description]'),
    price: get('[data-dish-viewer-price]'),
    note: get('[data-dish-viewer-note]'),
    close: get('[data-dish-close]'),
  };
}

/** Offset and scale that put an element sitting on `to` back over `from`. */
function flip(from: DOMRect, to: DOMRect) {
  return { x: from.left - to.left, y: from.top - to.top, scale: from.width / to.width };
}

function textOf(row: Element, selector: string) {
  return row.querySelector(selector)?.textContent?.trim() ?? '';
}

/* ------------------------------------------------------------------ open */

function open(trigger: HTMLButtonElement) {
  const ui = parts();
  const row = trigger.closest('[data-motion="item"]');
  const source = trigger.querySelector<HTMLImageElement>('[data-dish-image]');
  if (!ui || !row || !source || current || closing) return;

  ui.name.textContent = textOf(row, '[data-dish-name]');
  ui.description.textContent = textOf(row, '[data-dish-description]');
  ui.price.textContent = textOf(row, '[data-dish-price]');
  ui.note.textContent = textOf(row, '[data-dish-note]');
  ui.note.hidden = !ui.note.textContent;

  // Measure the photo before anything on the page changes.
  const start = trigger.getBoundingClientRect();
  ui.viewer.hidden = false;
  const end = ui.frame.getBoundingClientRect();

  const clone = source.cloneNode() as HTMLImageElement;
  clone.removeAttribute('data-dish-image');
  clone.loading = 'eager';
  clone.className = 'pointer-events-none fixed max-w-none object-contain';
  Object.assign(clone.style, {
    left: `${end.left}px`,
    top: `${end.top}px`,
    width: `${end.width}px`,
    height: `${end.height}px`,
    transformOrigin: '0 0',
  });
  ui.viewer.append(clone);
  source.style.visibility = 'hidden';

  current = { trigger, source, clone };
  getLenis()?.stop();

  const copy = [ui.description, ui.price, ui.note].filter((el) => !el.hidden);

  timeline = gsap
    .timeline()
    .fromTo(
      ui.veil,
      { '--blur': '0rem', opacity: 0 },
      { '--blur': '1.5rem', opacity: 1, duration: 0.9, ease: 'power2.out' },
      0,
    )
    .fromTo(clone, flip(start, end), { x: 0, y: 0, scale: 1, duration: 1.05, ease: FLIGHT_EASE }, 0)
    .fromTo(ui.name, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.8)
    .fromTo(
      copy,
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
      0.95,
    )
    .fromTo(
      ui.close,
      // Opacity only (not autoAlpha), so the button can take focus right away.
      { opacity: 0, rotate: -90 },
      { opacity: 1, rotate: 0, duration: 0.7, ease: 'power3.out' },
      1,
    );

  if (prefersReducedMotion()) timeline.progress(1);
  ui.close.focus({ preventScroll: true });
}

/* ----------------------------------------------------------------- close */

function finish() {
  const ui = parts();
  if (current) {
    current.source.style.visibility = '';
    current.clone.remove();
    current.trigger.focus({ preventScroll: true });
  }
  if (ui) {
    ui.viewer.hidden = true;
    gsap.set([ui.name, ui.description, ui.price, ui.note, ui.close], { clearProps: GSAP_PROPS });
    gsap.set(ui.veil, { opacity: 0, '--blur': '0rem' });
  }
  current = null;
  closing = false;
  timeline = null;
  getLenis()?.start();
}

function close() {
  const ui = parts();
  if (!ui || !current || closing) return;
  closing = true;
  timeline?.kill();

  const { trigger, clone } = current;
  // The photo goes back to wherever its slot is now.
  const back = flip(trigger.getBoundingClientRect(), ui.frame.getBoundingClientRect());
  const copy = [ui.close, ui.note, ui.price, ui.description].filter((el) => !el.hidden);

  timeline = gsap
    .timeline({ onComplete: finish })
    .to(copy, { y: -10, autoAlpha: 0, duration: 0.4, stagger: 0.05, ease: 'power2.in' }, 0)
    .to(ui.name, { yPercent: -110, duration: 0.55, ease: 'power3.in' }, 0.05)
    .to(clone, { ...back, duration: 0.95, ease: FLIGHT_EASE }, 0.3)
    .to(ui.veil, { '--blur': '0rem', opacity: 0, duration: 0.8, ease: 'power2.inOut' }, 0.5);

  if (prefersReducedMotion()) timeline.progress(1);
}

/* ------------------------------------------------------------- listeners */

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;
  const trigger = target?.closest<HTMLButtonElement>('[data-dish-trigger]');
  if (trigger) {
    open(trigger);
    return;
  }
  // Anywhere on the open preview closes it.
  if (current && target?.closest('[data-dish-viewer]')) close();
});

document.addEventListener('keydown', (event) => {
  if (!current) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  }
  // The close button is the only stop inside the dialog.
  if (event.key === 'Tab') {
    event.preventDefault();
    parts()?.close.focus();
  }
});

// Keep the page still underneath while the preview is open.
const blockScroll = (event: Event) => {
  if (current) event.preventDefault();
};
document.addEventListener('wheel', blockScroll, { passive: false });
document.addEventListener('touchmove', blockScroll, { passive: false });

// Leaving the page (browser back) drops the preview at once.
document.addEventListener('astro:before-preparation', () => {
  if (!current) return;
  timeline?.kill();
  finish();
});
