---
name: stt-split-text-token
description: >-
  Split a selected text token (heading-sm-sb, h1, body-1, …) into Astro
  font / text-[rem] tb: dk: dk-lg: / leading lines. Breakpoints: base below 440,
  tb 440, dk 1025, dk-lg 1600. Trigger on stt, split-text-token, or
  desmembrar/expand a text token class.
---

# Split text token (stt)

## Breakpoints

| Prefix           | Width   | CSS                        |
| ---------------- | ------- | -------------------------- |
| base (no prefix) | < 440px | `:root` default            |
| `tb:`            | 440px   | `@media (width >= 440px)`  |
| `dk:`            | 1025px  | `@media (width >= 1025px)` |
| `dk-lg:`         | 1600px  | `@media (width >= 1600px)` |

Rewrite **only the selected** `class` / `cn()` styles. Do not edit other code.

## Speed

- Do not run `tsc`, lint, tests, or any verification.
- Do not change layout, spacing, or DOM. Replace the token; keep every other class.

## Tokens

Any project text class: `heading-sm-sb`, `h1`, `body-1`, `display-lg`, and the same kind of utility.

Look the class up in this project's styles (`src/styles/text_tokens.css`, `src/styles/figma_var.css`, or whichever file defines it). Do not guess sizes or font families. The name does not matter; split whatever the definition contains.

## Expand into these `cn()` lines (in this order)

1. **Font line** — family utility, then weight (`"font-semibold"`). The family utility is the one this project already uses for that `font-family`. Do not substitute a family from another project.
2. **Size line** — rem at every tier that changes: `"text-[Nrem] tb:text-[Nrem] dk:text-[Nrem] dk-lg:text-[Nrem]"`.
3. **Leading line** — its own argument, after the size line: `"leading-[130%]"`. Use the CSS `line-height` as-is (`%`, `1`, `110%`, …). This lone line is the exception to `ots-order-tailwindcss-styles`.
4. **Color** — only if a `text-*` color is already on the element. Do not invent one. Merge it onto the font line when that keeps it off its own line.

Then keep the rest of the original classes (layout, clamp, cursor, …).

Wrap with `cn(...)`. `cn` is exported from `src/lib/cn.ts`. From a section file at `src/pages/<Page>/_components/<Section>/`, import it with:

```astro
import {cn} from '../../../../lib/cn';
```

From any other file, use the relative path to `src/lib/cn.ts`. In `.astro`, the attribute is `class`, not `className`.

## Maps

**Weight:** `400` → `font-normal`; `500` → `font-medium`; `600` → `font-semibold`; `700` → `font-bold`; `800` → `font-extrabold`.

**Size:** follow `font-size` through the variables it uses (`--text-*` → `--num-*` or a literal). Convert each px value with root 16 (`15px` → `0.9375rem`). Emit base, then `tb`, then `dk`, then `dk-lg`. Omit a later prefix when it equals the previous tier.

Delete the token class after expanding.

## Example

```astro
<!-- before -->
<h3 class="heading-sm-sb line-clamp-2 flex-1 cursor-default break-words text-gray-900">
  <!-- after: family, weight, sizes, and leading come from this project's token.
     15 / 18 / 22 / 22 px → rem. leading stays on the next line. -->
  <h3
    class={cn(
      'flex-1 line-clamp-2 break-words cursor-default',
      'font-body font-semibold text-gray-900',
      'text-[0.9375rem] tb:text-[1.125rem] dk:text-[1.375rem]',
      'leading-[130%]',
    )}
  >
  </h3>
</h3>
```

`font-body` above is only a stand-in. Use the utility that matches the token's `font-family` in this repo.
