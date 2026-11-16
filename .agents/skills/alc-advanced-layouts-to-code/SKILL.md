---
name: alc-advanced-layouts-to-code
description: >-
  Figma Ignore auto layout → CSS absolute in Astro. Read each frame’s sizing
  (Fill, Hug, fixed, min/max, unlock aspect) before coding. Sizes in rem.
  Breakpoints: base below 440, tb 440, dk 1025, dk-lg 1600. Unlock + Fill → flex
  stretch, never aspect-* or h-full.
---

# Advanced layouts to code (Ignore auto layout)

## Breakpoints

| Prefix | Width |
| --- | --- |
| base (no prefix) | < 440px |
| `tb:` | 440px |
| `dk:` | 1025px |
| `dk-lg:` | 1600px |

In `.astro`, the attribute is `class`, not `className`. Sizes ship as `rem` (`px / 16`).

## PRIORITY — read frame constraints before any size

**Before** writing `w-*`, `h-*`, `aspect-*`, `min-h-*`, or `flex-*` on a frame, open that node in Figma (Dev Mode / `get_metadata` + inspect sizing) and record **per axis**:

| Check in Figma | What to code |
| --- | --- |
| **Width / Height** mode: Hug, Fill, Fixed | Hug → intrinsic / omit fixed size; Fill → parent stretch (`flex-1`, `items-stretch`); Fixed → `w-[…]` / `h-[…]` in rem |
| **Aspect ratio** locked vs **unlock** | Locked → `aspect-[W/H]` only when Figma locks it; **Unlock → never `aspect-[W/H]` on that frame** |
| **Min / max** width or height | `min-h-*`, `max-w-*`, etc. from those values (rem) |
| **Constraints** panel (Scale, pin, stretch) | See [Constraint → CSS](#constraint--css) below |

Do not derive container size from:

- `get_design_context` class strings (`aspect-[705/416]`, `h-[416px]`, `size-full`)
- Snapshot **W × H** in `get_metadata` (artboard dimensions at one breakpoint — not a ratio contract)
- Raw image intrinsic ratio

Codegen output is a **hint for structure and absolute children**, not for parent frame sizing. If you skip Figma constraints and copy MCP dimensions, Unlock + Fill breaks.

```astro
<!-- copied snapshot W÷H from metadata/codegen -->
<div class="relative aspect-[705.905/416.849] flex-1"></div>

<!-- unlock aspect, W Fill, H Fill, min-h 416.849px → 26.053rem -->
<div class="relative min-h-[26.053rem] min-w-0 flex-1"></div>
<!-- Parent row: items-stretch -->
```

**Workflow (every frame you size):** Figma constraints → rem values → CSS. MCP last, for absolute child offsets only.

---

A Figma child with **Ignore auto layout** is **out of flow**. Parent stays Auto Layout; that child is `absolute` against the parent’s padding box. Parent must be `relative` (or already positioned).

Do not put the ignored node in `flex`/`gap` with in-flow siblings. MCP `hypot()`, `cqw`, and extra rotate shells are codegen — keep **one** absolute node.

## Constraint → CSS

Read the **Constraints** panel (H and V separately). `%` is **of the parent size** on that axis. Negative `%` or length = hangs outside (overlap).

| Figma (axis) | CSS |
| --- | --- |
| **Left** pin + fixed size | `left-[Nrem]`, `w-*` (or `h-*` on Y with `top`) |
| **Right** pin + fixed size | `right-[Nrem]`, `w-*` |
| **Left and right** (stretch) | `left-*` + `right-*`, **no** fixed `w-*` |
| **Scale** | `left-[N%]` **and** `right-[N%]`. Width is implied: `100% − left − right`. Do not replace with a fixed `w-[…]`. |
| **Center** | `left-1/2 -translate-x-1/2` (Y: `top-1/2 -translate-y-1/2`) |
| **Top** / **Bottom** pin | `top-[Nrem]` / `bottom-[Nrem]` |
| **Scale** on Y | `top-[N%]` **and** `bottom-[N%]` |

Convert every Figma px pin with root 16. Keep **%** for Scale. Mix freely: **Scale X** + **Bottom** pin + **aspect** instead of height.

```astro
<!-- Scale X + bottom pin 3px → 0.1875rem. Width tracks parent. -->
class="absolute left-[-48%] right-[82%] bottom-[0.1875rem] aspect-[349/243]"

<!-- kills Scale; won’t track parent width -->
class="absolute bottom-[0.1875rem] left-[-15.75rem] w-[21.8125rem]"
```

`left: -48.27%` + `right: 81.62%` on a 524px parent is about 349px (21.8125rem) wide. Keep the **%** so it still holds if the parent changes.

## Image ratio & dimensions (not the raw file)

MCP often emits `aspect-[1125/750]` (or similar) from the **uploaded bitmap’s intrinsic size**. That is not the ratio to code unless the frame in Figma has no crop, mask, or fixed resize.

Use the **design frame** — what the user actually sees:

| Figma situation | Code from |
| --- | --- |
| **Mask** / clip / “Mask group” | `mask-size` (width × height of the visible area), or the masked frame’s W×H |
| **Unlock aspect ratio** + fixed W and H | Independent `w-[…]` + `h-[…]` from the **frame**, in rem. Do not use `aspect-*` — that re-locks the axes |
| **Unlock aspect ratio** + **Fill** on an axis | That axis comes from the parent layout (stretch/fill). Never invent `aspect-[W/H]` from the artboard snapshot |
| **Locked aspect ratio** + one dimension | Frame aspect or the constrained axis from layout |
| Fill inside a rounded clip with no mask | The **image layer / clip frame** size in the tree |

```astro
<!-- raw download ratio (e.g. 1125×750 photo) -->
<div class="aspect-[1125/750] overflow-hidden rounded-[1rem]">
  <img src="/assets/seals/community.png" class="size-full object-cover" />
</div>

<!-- design mask-size 266×126.834 (large seal variant) -->
<div class="aspect-[266/126.834] w-full overflow-hidden rounded-[1rem]">
  <img src="/assets/seals/community.png" class="size-full object-cover" />
</div>

<!-- unlock aspect ratio — fixed frame 266×127, both axes Hug/fixed -->
<div class="h-[7.9275rem] w-[16.625rem] overflow-hidden rounded-[1rem]">
  <img src="..." class="size-full object-cover" />
</div>
```

`object-cover` fills the **design box**; the box size comes from Figma, not from file dimensions or MCP asset metadata. One image node is one wrapper; put radius, rotate, and ratio on that wrapper (`di-download-raw-images`, `ffs-figma-faithful-structure`).

## Fill height/width ≠ `h-full` / `w-full` (flex)

Figma **Fill** on the cross axis of an Auto Layout parent means: grow with the sibling row/column. In CSS that is **flex stretch**, not percentage size.

| Figma | CSS |
| --- | --- |
| Parent Auto Layout (row/col) | `flex` + `items-stretch` (don’t use `items-start` / `items-end` if a child must Fill) |
| Child **Fill** height in a row | Keep `height: auto` (omit `h-*`). Stretch gives the used height. Optional: `self-stretch` |
| Child **Fill** width in a col | Keep `width: auto` / `w-auto`, or `flex-1` / `self-stretch` — not blind `w-full` |
| Child fixed on the other axis | e.g. Fill height + fixed width → `w-[32.75rem] shrink-0` + **no** `h-full`, **no** `aspect-*` |

```astro
<!-- Parent row — stretch so Fill children match the tallest sibling -->
<div class="flex items-stretch gap-20">
  <div class="flex flex-1 flex-col">{/* in-flow copy */}</div>

  <!-- Unlock + Fill height: width fixed, height from stretch -->
  <div class="relative w-[32.75rem] shrink-0">
    <!-- absolute children with Scale/pin % -->
  </div>
</div>

<!-- aspect re-locks unlocked axes; snapshot H is not a ratio contract -->
<div class="relative aspect-[524/465] w-[32.75rem]"></div>

<!-- h-full is height:100%. A flex parent sized by content is height:auto, so % fails.
     Absolute children add no intrinsic height and the box collapses to 0. -->
<div class="relative h-full w-[32.75rem]"></div>
```

**Why not `h-full`:** `height: 100%` only resolves if the parent has a **specified** height. A flex row whose height comes from content does not. `align-items: stretch` only applies when the item’s cross size is `auto`. Setting `h-full` leaves stretch and breaks Fill.

## Checks

- **First:** Figma frame sizing (Hug / Fill / Fixed, unlock aspect, min/max) — not MCP `aspect-*` or snapshot W×H.
- In-flow siblings: Auto Layout (`flex` + `gap`). Ignored sibling: `absolute` + constraints, not `order` / `gap`.
- `%` on `left` / `right` together → Scale (or stretch in %). Do not replace that with a fixed width.
- Pins ship as `rem`. Do not leave `bottom-[3px]` in the class. Do not turn a pin into `%` unless Figma is Scale on that axis.
- Image `aspect-*` / `w` / `h` → from mask, clip frame, or unlocked W×H — never from the raw image file ratio.
- **Unlock aspect** → never encode W÷H as `aspect-*`. Fixed axes → independent `w` / `h` in rem; Fill axis → flex stretch + `auto` size, not `h-full` / `w-full`.
- Fill child in a flex row/col → parent `items-stretch`; child omit cross-axis size (or `self-stretch`). Don’t pair Fill with `items-start`.
- Same node, different constraints per breakpoint → follow `ffs-figma-faithful-structure` (two trees). Do not blend Scale and pin on one element.
