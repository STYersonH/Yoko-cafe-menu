/**
 * Page-to-page motion for the menu (Home ⇄ category pages).
 *
 * Going into a category: Home slides out to the left, then the category slides
 * in from the right (title first, then each dish). Going back: the category
 * slides out to the right and Home comes back in from the left.
 *
 * Markup contract:
 * - `data-menu-stage="home" | "category"` on the page root.
 * - `data-motion="<group>"` on each block that leaves and enters.
 * - `data-motion-backdrop` on the whisk and wave.
 * - Inside an item: `data-motion-photo`, `data-motion-copy`, `data-motion-divider`.
 * - Home title letters: `data-motion-letter`.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATEGORY_IDS } from '../../lib/menu';

gsap.registerPlugin(ScrollTrigger);

type Direction = 'forward' | 'back';

/**
 * `true`: Home re-enters from the left, mirroring the exit to the right.
 * `false`: Home re-enters from the right, like a category does.
 */
const MIRROR_ON_BACK = true;

const MOTION_TARGETS =
  '[data-motion], [data-motion-letter], [data-motion-photo], [data-motion-copy], [data-motion-divider], [data-motion-backdrop]';

/** Inline properties the enter tweens write, cleared once they finish. */
const GSAP_PROPS = 'transform,translate,rotate,scale,opacity,visibility,transformOrigin';

const EXIT_EASE = 'power3.in';
const ENTER_EASE = 'expo.out';
const SOFT_EASE = 'power2.out';

let enterTimeline: gsap.core.Timeline | null = null;
let exitTimeline: gsap.core.Timeline | null = null;
let pendingDirection: Direction | null = null;

type LenisLike = { scrollTo: (target: number, options?: { immediate?: boolean }) => void };

const getLenis = () => (window as Window & { lenis?: LenisLike }).lenis;
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const rem = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
const getStage = () => document.querySelector<HTMLElement>('[data-menu-stage]');

function query(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(selector));
}

function isOnScreen(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight;
}

/** `/es` → back to Home, `/es/classics` → forward into a category, anything else → no menu motion. */
function directionFor(to: URL): Direction | null {
  const segments = to.pathname.split('/').filter(Boolean);
  if (segments.length <= 1) return 'back';
  if (segments.length === 2 && (CATEGORY_IDS as readonly string[]).includes(segments[1])) {
    return 'forward';
  }
  return null;
}

/* ------------------------------------------------------------------ exit */

function playExit(root: HTMLElement, direction: Direction, to: URL) {
  const sign = direction === 'forward' ? -1 : 1;
  const distance = 5 * rem();

  const blocks = query(root, '[data-motion]').filter(isOnScreen);
  const chosen = blocks.find(
    (el) => el instanceof HTMLAnchorElement && new URL(el.href).pathname === to.pathname,
  );
  const rest = blocks.filter((el) => el !== chosen);

  const tl = gsap.timeline({ defaults: { ease: EXIT_EASE } });

  gsap.set(blocks, { transition: 'none' });
  tl.to(rest, { x: sign * distance, autoAlpha: 0, duration: 0.6, stagger: 0.04 }, 0);

  // The chosen category holds for a beat, then follows the rest out.
  if (chosen) {
    tl.to(chosen, { x: sign * distance * 0.25, duration: 0.3, ease: SOFT_EASE }, 0);
    tl.to(chosen, { x: sign * distance * 1.5, autoAlpha: 0, duration: 0.55 }, 0.28);
  }

  tl.to(
    query(root, '[data-motion-backdrop]'),
    { x: sign * distance * 0.4, autoAlpha: 0, duration: 0.75, ease: 'power2.inOut' },
    0,
  );

  return tl;
}

/* ----------------------------------------------------------------- enter */

function buildHomeEnter(root: HTMLElement, from: number) {
  const distance = 4 * rem() * from;
  const tl = gsap.timeline({ paused: true, defaults: { ease: ENTER_EASE, duration: 1.1 } });

  tl.from(
    query(root, '[data-motion-backdrop]'),
    {
      autoAlpha: 0,
      x: distance * 0.5,
      duration: 1.4,
      ease: SOFT_EASE,
    },
    0,
  )
    .from(query(root, '[data-motion="logo"]'), { x: distance, autoAlpha: 0 }, 0.05)
    .from(query(root, '[data-motion="subtitle"]'), { x: distance, autoAlpha: 0 }, 0.15)
    .from(query(root, '[data-motion="rule"]'), { scaleX: 0, autoAlpha: 0, duration: 0.9 }, 0.3)
    .from(
      query(root, '[data-motion-letter]'),
      { x: distance * 0.6, autoAlpha: 0, stagger: 0.06, duration: 1.2 },
      0.2,
    )
    .from(query(root, '[data-motion="link"]'), { x: distance, autoAlpha: 0, stagger: 0.12 }, 0.4);

  return tl;
}

function revealItem(item: HTMLElement, from: number) {
  const distance = 3 * rem() * from;
  const tl = gsap.timeline({ defaults: { ease: ENTER_EASE, duration: 1.1 } });

  tl.from(
    item.querySelector('[data-motion-photo]'),
    {
      x: distance * 1.3,
      scale: 0.94,
      autoAlpha: 0,
      duration: 1.3,
    },
    0,
  )
    .from(item.querySelector('[data-motion-copy]'), { x: distance * 0.7, autoAlpha: 0 }, 0.1)
    .from(
      item.querySelector('[data-motion-divider]'),
      { scaleX: 0, transformOrigin: from > 0 ? 'right center' : 'left center', duration: 1.2 },
      0.25,
    );

  return tl;
}

function buildCategoryEnter(root: HTMLElement, from: number) {
  const distance = 4 * rem() * from;
  const tl = gsap.timeline({ paused: true, defaults: { ease: ENTER_EASE, duration: 1.1 } });
  const items = query(root, '[data-motion="item"]').filter(isOnScreen);

  tl.from(
    query(root, '[data-motion-backdrop]'),
    {
      autoAlpha: 0,
      x: distance * 0.5,
      duration: 1.4,
      ease: SOFT_EASE,
    },
    0,
  )
    .from(query(root, '[data-motion="title"]'), { x: distance, autoAlpha: 0, duration: 1.2 }, 0.05)
    .from(
      query(root, '[data-motion="meta"]'),
      { x: distance * 0.6, autoAlpha: 0, stagger: 0.08 },
      0.2,
    )
    .from(query(root, '[data-motion="rule"]'), { scaleX: 0, autoAlpha: 0, duration: 0.9 }, 0.35);

  items.forEach((item, index) => {
    tl.add(revealItem(item, from), 0.5 + index * 0.18);
  });

  tl.from(
    query(root, '[data-motion="back"], [data-motion="footer"]').filter(isOnScreen),
    { autoAlpha: 0, duration: 0.9, ease: SOFT_EASE },
    0.5 + items.length * 0.18,
  );

  return tl;
}

/** Dishes below the fold come in one by one as they scroll into view. */
function setupScrollReveals(root: HTMLElement) {
  query(root, '[data-motion="item"]')
    .filter((item) => item.getBoundingClientRect().top >= window.innerHeight)
    .forEach((item) => {
      const reveal = revealItem(item, 1).pause();
      ScrollTrigger.create({
        trigger: item,
        start: 'top 92%',
        once: true,
        onEnter: () => reveal.play(),
      });
    });
}

/** Waits for the on-screen photos so they don't pop in mid-slide. */
function photosReady(root: HTMLElement) {
  const photos = query(root, '[data-motion-photo] img')
    .filter(isOnScreen)
    .map((img) => (img as HTMLImageElement).decode().catch(() => undefined));
  const timeout = new Promise((resolve) => setTimeout(resolve, 500));
  return Promise.race([Promise.all(photos), timeout]);
}

/* ------------------------------------------------------------- lifecycle */

function prepareEnter(direction: Direction) {
  const root = getStage();
  if (!root) return;

  const from = direction === 'back' && MIRROR_ON_BACK ? -1 : 1;
  const targets = query(root, MOTION_TARGETS);
  // CSS hover transitions would fight GSAP on every frame.
  gsap.set(targets, { transition: 'none' });
  // `from` tweens render their start state right away, so the new page is
  // already hidden when the browser paints it.
  const tl =
    root.dataset.menuStage === 'home' ? buildHomeEnter(root, from) : buildCategoryEnter(root, from);
  // Only clean what this timeline animated: dishes below the fold keep their
  // hidden state for the scroll reveal.
  const animated = tl
    .getChildren(true, true, false)
    .flatMap((tween) => tween.targets<HTMLElement>());
  // Never `clearProps: 'all'`: it wipes the whole `style` attribute, and the
  // backdrop and photos keep their Figma position (top, width, height) there.
  tl.eventCallback('onComplete', () => {
    gsap.set(animated, { clearProps: GSAP_PROPS });
    gsap.set(targets, { clearProps: 'transition' });
  });
  enterTimeline = tl;
}

function onPageLoad() {
  const root = getStage();
  if (!root || root.dataset.motionReady) return;
  root.dataset.motionReady = 'true';

  if (prefersReducedMotion()) return;

  if (root.dataset.menuStage === 'category') setupScrollReveals(root);

  const tl = enterTimeline;
  if (!tl) return;
  photosReady(root).then(() => tl.play());
}

document.addEventListener('astro:before-preparation', (event) => {
  const root = getStage();
  const direction = directionFor(event.to);
  if (!root || !direction || prefersReducedMotion()) return;

  enterTimeline?.kill();
  exitTimeline?.kill();
  root.style.pointerEvents = 'none';
  pendingDirection = direction;

  const exit = playExit(root, direction, event.to);
  exitTimeline = exit;
  const load = event.loader;
  event.loader = async () => {
    await Promise.all([load(), exit.then()]);
  };
});

document.addEventListener('astro:before-swap', (event) => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  enterTimeline = null;
  exitTimeline = null;
  // Our own motion replaces the browser's default crossfade.
  if (pendingDirection) {
    try {
      event.viewTransition.skipTransition();
    } catch {
      /* not supported, crossfade between two blank frames is harmless */
    }
  }
});

document.addEventListener('astro:after-swap', () => {
  getLenis()?.scrollTo(window.scrollY, { immediate: true });
  if (pendingDirection) prepareEnter(pendingDirection);
  pendingDirection = null;
});

document.addEventListener('astro:page-load', onPageLoad);
onPageLoad();
