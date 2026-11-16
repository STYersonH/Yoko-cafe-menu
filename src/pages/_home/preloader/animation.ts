import gsap from 'gsap';
import {
  RESTORE_SCROLL_ON_RELOAD,
  afterNativeScrollRestoration,
  applyScrollRestorationPolicy,
  isElementAboveViewport,
} from '../../../utils/scroll-restoration';

const ROOT = '#preloader';
const PRE = '[data-anim="preloader"]';
const SPLIT = '[data-anim="preloader-split"]';
const HOME_ANCHOR = '[data-home-anchor]';

/** Time the words stay on screen before the two layers split open. */
const HOLD_MS = 2400;

type LenisLike = {
  stop: () => void;
  start: () => void;
  scrollTo: (target: number, options?: { immediate?: boolean }) => void;
};

let timeline: gsap.core.Timeline | null = null;
let holdTimer = 0;
let failSafe = 0;
let scrollLocked = false;
let lenisHeld = false;

const SCROLL_KEYS = [' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'];

function getLenis() {
  return (window as Window & { lenis?: LenisLike }).lenis;
}

function pinToTop() {
  if (window.scrollY !== 0) window.scrollTo(0, 0);
  const lenis = getLenis();
  if (!lenis || lenisHeld) return;
  lenis.scrollTo(0, { immediate: true });
  lenis.stop();
  lenisHeld = true;
}

function preventScroll(event: Event) {
  event.preventDefault();
}

function preventScrollKey(event: KeyboardEvent) {
  if (SCROLL_KEYS.includes(event.key)) event.preventDefault();
}

function watchScroll() {
  if (!scrollLocked) return;
  pinToTop();
  requestAnimationFrame(watchScroll);
}

function freezePage() {
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
  window.addEventListener('wheel', preventScroll, { passive: false });
  window.addEventListener('touchmove', preventScroll, { passive: false });
  window.addEventListener('keydown', preventScrollKey);

  const lenis = getLenis();
  if (!lenis || lenisHeld) return;
  lenis.stop();
  lenisHeld = true;
}

function lockScroll() {
  if (scrollLocked) return;
  scrollLocked = true;
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  freezePage();

  // Keep the restored position when reload-at-position is on.
  if (RESTORE_SCROLL_ON_RELOAD) return;

  pinToTop();
  requestAnimationFrame(watchScroll);
}

function unlockScroll() {
  if (!scrollLocked) return;
  scrollLocked = false;
  lenisHeld = false;
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  if ('scrollRestoration' in history && !RESTORE_SCROLL_ON_RELOAD) {
    history.scrollRestoration = 'auto';
  }
  window.removeEventListener('wheel', preventScroll);
  window.removeEventListener('touchmove', preventScroll);
  window.removeEventListener('keydown', preventScrollKey);
  getLenis()?.start();
}

function hide(root: HTMLElement) {
  timeline?.kill();
  timeline = null;
  window.clearTimeout(holdTimer);
  window.clearTimeout(failSafe);
  root.remove();
  unlockScroll();
}

function splitOpen(root: HTMLElement) {
  window.clearTimeout(failSafe);
  failSafe = window.setTimeout(() => {
    if (root.isConnected) hide(root);
  }, 1400);

  timeline?.kill();
  timeline = gsap.timeline({
    onComplete: () => {
      window.clearTimeout(failSafe);
      hide(root);
    },
  });

  timeline.set(PRE, { clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' });
  timeline.set(SPLIT, { clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' });
  timeline.to(PRE, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' });
  timeline.to(SPLIT, { yPercent: 100, duration: 0.95, ease: 'power4.inOut' }, '<');
}

function isClientNavigation() {
  return document.documentElement.hasAttribute('data-astro-transition');
}

function playPreloader(root: HTMLElement) {
  root.dataset.running = '1';
  lockScroll();
  window.clearTimeout(holdTimer);

  holdTimer = window.setTimeout(() => {
    if (!root.isConnected) {
      unlockScroll();
      return;
    }
    splitOpen(root);
  }, HOLD_MS);
}

/** Words fade in with CSS, stay on screen, then the two layers split away. A full load only. */
export function initPreloader() {
  applyScrollRestorationPolicy();

  const root = document.querySelector<HTMLElement>(ROOT);
  if (!root || root.dataset.running === '1') return;

  if (isClientNavigation()) {
    root.remove();
    unlockScroll();
    return;
  }

  if (!RESTORE_SCROLL_ON_RELOAD) {
    playPreloader(root);
    return;
  }

  const homeAnchor = document.querySelector<HTMLElement>(HOME_ANCHOR);
  if (homeAnchor && isElementAboveViewport(homeAnchor)) {
    root.remove();
    return;
  }

  playPreloader(root);
}

const boot = afterNativeScrollRestoration(initPreloader);

document.addEventListener(
  'astro:page-load',
  RESTORE_SCROLL_ON_RELOAD ? boot : initPreloader,
);

document.addEventListener('astro:before-preparation', () => {
  timeline?.kill();
  timeline = null;
  window.clearTimeout(holdTimer);
  window.clearTimeout(failSafe);
  unlockScroll();
});

if (RESTORE_SCROLL_ON_RELOAD) {
  boot();
} else {
  initPreloader();
}
