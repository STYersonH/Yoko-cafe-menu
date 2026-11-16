---
name: ots-order-tailwindcss-styles
description: >-
  Order selected Astro class strings with cn(): never one class alone on a
  line except leading-*; group by category; property + tb:/dk:/dk-lg: stay
  together. Breakpoints: base below 440, tb 440, dk 1025, dk-lg 1600. Trigger on
  ordenar, ots, order-tailwindcss-styles, or a request to sort Tailwind classes.
---

# Order Tailwind CSS styles

## Breakpoints

| Prefix | Width |
| --- | --- |
| base (no prefix) | < 440px |
| `tb:` | 440px |
| `dk:` | 1025px |
| `dk-lg:` | 1600px |

Rewrite **only the selected** `class` / `cn()` styles. Do not edit other code.

**Skip this rule when there are fewer than 10 classes.** A short `class` is already readable — do not wrap it in `cn()` or split it onto multiple lines. Apply this rewrite only when the selected string has 10 or more Tailwind classes.

## Speed

- Do not run `tsc`, lint, tests, or any verification.
- Do not change class values, tokens, breakpoints, or DOM. Reorder and wrap only.
- Values stay in `rem`. Do not introduce `px`.

## How to rewrite

1. Wrap with `cn(...)`. `cn` is exported from `src/lib/cn.ts`. From a section file at `src/pages/<Page>/_components/<Section>/`:

```astro
import { cn } from '../../../../lib/cn';
```

From any other file, use the relative path to `src/lib/cn.ts`. In `.astro`, the attribute is `class`, not `className`.

2. **Never a single class on a `cn()` argument.** `"relative"`, `"w-full"`, `"gap-10"`, `"dk:px-20"`, `"text-[1.5rem]"`, `"tb:bottom-[0.125rem]"` alone are forbidden. Merge the orphan into the previous or next argument (same category if possible, else the neighboring line). This rule beats splitting by property when a split would leave one class alone.

3. **Exception — `leading-*`.** A `leading-[…]` or `leading-*` argument may be a single class. It must be the line **after** the `text-[…]` size line, so line-height applies on top of the font size. Do not merge it into the font line or the size line. See `stt-split-text-token`.

4. Walk categories in order (below). Same-category classes without breakpoints may share a line.
5. **A property and all of its variants stay together on one line.** Never split `py-[1rem]` from `tb:py-[…]` / `dk:py-[…]` / `dk-lg:py-[…]`. That whole group is one argument: `text-[0.9375rem] tb:text-[1.125rem] dk:text-[1.375rem] dk-lg:text-[1.5rem]`.
6. **A group that already has its variants gets its own line.** Do not leave it beside `gap`, `px`, or another property. This is required when the group has 3 or 4 classes (base + `tb` + `dk`, or + `dk-lg`). A 2-class pair (`px-8 tb:px-14`) also gets its own line. A class with no variant (`gap-10`, `pb-[7.5rem]`) must not sit alone — merge it with the neighboring short class, never onto a 3- or 4-variant line.
7. One `w-*` and one `h-*` may share the sizing line. Do not split `"dk:w-full"` and `"dk:h-[23.5rem]"` into two arguments.
8. Keep every original class.

```astro
<!-- never — orphan lines -->
cn(
  'relative',
  'hidden dk:flex dk:flex-col dk:items-start',
  'w-full',
  'dk:px-20',
  'dk:py-[7.5rem]',
)

<!-- every argument has at least 2 classes -->
cn(
  'relative w-full',
  'hidden dk:flex dk:flex-col dk:items-start',
  'dk:px-20 dk:py-[7.5rem]',
)
```

## Category order

### 1. Visual (prefer first)

`bg-*` · `rounded-*` · `border-*` / `divide-*` / `ring-*` · `shadow-*` / `opacity-*` / `blur-*` · `filter` / `backdrop-*` · `transition-*` / `duration-*` / `ease-*` / `animate-*` · `translate-*` / `rotate-*` / `scale-*` / `origin-*`

### 2. Layout

`relative` / `absolute` / `fixed` / `sticky` · `inset-*` · `top-*` / `right-*` / `bottom-*` / `left-*` · `z-*` · `overflow-*` / `truncate`

Inner: `position` → `inset` → `top` → `right` → `bottom` → `left` → `z-*` → `overflow-*`

Do not put `hidden` / `block` / `inline` / `contents` here — those are display and belong on the flex/grid line.

### 3. Flexbox & grid / display (one line)

`hidden` / `block` / `inline` / `contents` · `flex` / `inline-flex` / `grid` · `flex-col` / `flex-row` / `flex-wrap` · `grid-cols-*` · `items-*` · `justify-*` · `content-*` / `place-*` · `self-*` · `order-*` · `flex-1` / `grow` / `shrink` / `basis-*`

`hidden`, `block`, and responsive display toggles (`dk:flex`, `dk:hidden`, `dk:block`, `dk-lg:flex`, …) live on **this** line with flex/grid — never alone, and never only on the layout line with `relative` without merging if that would orphan `relative`.

```astro
<!-- hidden stuck on layout; orphans -->
'relative hidden w-full',
'dk:flex dk:flex-col dk:items-start',

<!-- display toggles sit with flex -->
'relative w-full',
'hidden dk:flex dk:flex-col dk:items-start',
```

### 4. Spacing

`gap-*` / `space-*` · `px-*` · `py-*` · other `p-*` / `m-*`. One property per line once it has its breakpoint variants. A 3- or 4-variant group (`py-[1rem] tb:py-[1.5rem] dk:py-[2rem]`) is always its own line.

### 5. Sizing

`w-*` / `min-w-*` / `max-w-*` · `h-*` / `min-h-*` / `max-h-*` · `size-*` · `aspect-*`

### 6. Typography

- **Font:** family then weight. Merge color here when color would otherwise sit alone.
- **Size + variants:** `text-[0.9375rem] tb:text-[1.125rem] dk:text-[1.375rem] dk-lg:text-[1.5rem]`
- **Leading:** own line, immediately after the size line. This is the only singleton allowed.
- **Clamp / break:** merge so no other singleton lines.

### 7. Leftover

`cursor-*` / `pointer-events-*` / `select-*` · unknown — attach to an existing line; never alone.

## Examples

### Layout / flex / sizing

```astro
class={cn(
  'absolute top-0 right-0 left-[35.93%] tb:left-[36%]',
  'dk:relative dk:inset-auto dk:left-auto',
  'dk:flex dk:items-center dk:justify-center',
  'dk:w-full dk:h-[23.5rem]',
)}
```

### Typography + flex

```astro
class={cn(
  'flex-1 line-clamp-2 break-words cursor-default',
  'font-body font-semibold text-gray-900',
  'text-[0.9375rem] tb:text-[1.125rem] dk:text-[1.375rem]',
  'leading-[130%]',
)}
```

### Mixed section

```astro
class={cn(
  'rounded-[1.625rem] tb:rounded-[2rem]',
  'flex flex-col items-center justify-end self-stretch flex-1 dk:flex-row',
  'gap-6 dk:gap-20 px-0',
  'py-[1rem] tb:py-[1.5rem] dk:py-[2rem]',
)}
```

### Show / hide by breakpoint

```astro
class={cn(
  'relative w-full',
  'hidden dk:flex dk:flex-col dk:items-start',
  'dk:px-20 dk:py-[7.5rem]',
)}

class={cn(
  'relative w-full',
  'flex flex-col items-start dk:hidden',
  'gap-10 pb-[7.5rem]',
  'px-8 tb:px-14',
  'pt-12 tb:pt-14',
)}
```
