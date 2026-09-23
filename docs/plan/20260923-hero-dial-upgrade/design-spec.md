# DESIGN-SPEC

## 1. Header

| Field            | Value                                                                     |
| ---------------- | ------------------------------------------------------------------------- |
| plan_id          | 20260923-hero-dial-upgrade                                                |
| task_id          | hero-design-spec                                                          |
| date             | 2026-09-23                                                                |
| contract         | DESIGN-SPEC                                                               |
| mode             | read-only on source (index.html, styles.css, app.js)                      |
| base_commit      | f694185                                                                   |
| design_direction | Option 2 Hero rework with dial-as-thesis emphasis (locked; user: proceed) |

**Goal.** Strengthen display hierarchy in the hero copy column, make the loop-dial read as the single numeric thesis (larger `143`, calmer structure, clearer track/progress), improve copy|dial composition and vertical rhythm, and keep motion frozen to the existing dial-draw load moment - presentation only, vanilla only, both themes AA.

**Non-goals.**

- No copy, date, or content rewrites (exact strings frozen; see §3).
- No color-scheme (dark/light) logic changes; no wholesale brand palette change.
- No app.js edits (FROZEN: 18 `getElementById` hooks + `STATE_KEY` at app.js:8).
- No new frameworks, libraries, CDNs, bundlers; existing SVG/CSS only.
- No new animations, no new lifts, no `will-change`, no second ease curve.
- No git commit or push (repo ahead 2; push = ask only).
- Gold accent in the h1 treatment restricted to "Earn" only (via existing `.h1-accent`).

**Locked pillars.** type hierarchy · dial-thesis · composition · motion.

---

## 2. Current-state inventory (this working tree)

Line numbers revalidated 2026-09-23 against `/home/Marayn/Desktop/Earn`. Prior rate-improve envelope anchors (styles.css:50/786/1946/2160) are **baseline** and revalidated as 51/779/1914/2102.

### 2.1 Markup - index.html hero

| Element                                          | Anchor             | Notes                                                                             |
| ------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------- |
| `.hero` section                                  | index.html:55      | `aria-labelledby="hero-title"`                                                    |
| `.hero-grid` / `.hero-copy`                      | index.html:56-57   | single-column stack base                                                          |
| `.hero-eyebrow`                                  | index.html:58      | exact string `LIE Loop Strategy`                                                  |
| `h1#hero-title` + `.h1-accent`                   | index.html:59-61   | exact: `<span class="h1-accent">Earn</span> While You Learn`                      |
| `.hero-subtitle`                                 | index.html:62-64   | exact: `GATE CSE 2027 - ₹30K-1L+/month while preparing for the exam`              |
| `.hero-meta` / Goal chip                         | index.html:65-70   | exact: `Goal` / `₹30K-1L+/mo`                                                     |
| `.hero-dial` > `svg.loop-dial`                   | index.html:72-126  | `viewBox="0 0 240 240"`, `aria-label="LIE Loop dial: 143 days to GATE, Feb 2027"` |
| `.dial-track` / `.dial-progress` / `.dial-inner` | index.html:79-81   | r=100 / r=100 / r=66                                                              |
| `.dial-node` x3                                  | index.html:82-84   | STUDY top, BUILD right, MONETIZE left                                             |
| `.dial-node-label` STUDY / BUILD / MONETIZE      | index.html:85-93   | y=40 / y=157 / y=178                                                              |
| `.dial-center-value` `143`                       | index.html:94-101  | y=112                                                                             |
| `.dial-center-label` `DAYS TO GATE`              | index.html:102-109 | y=130                                                                             |
| `.dial-center-sub` `FEB 2027`                    | index.html:110-117 | y=148                                                                             |
| `.dial-center-sub` `GATE CSE`                    | index.html:118-125 | y=164                                                                             |

### 2.2 CSS - styles.css .hero block

| Selector                     | Anchor             | Current intent                                                                                                  |
| ---------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------- |
| `.hero`                      | styles.css:221-227 | `background: var(--ink)`; padding `48px 16px`                                                                   |
| `.hero::before` glow         | styles.css:229-242 | radial gold 14% - leave alone                                                                                   |
| `.hero::after` noise         | styles.css:244-252 | opacity 0.03 - leave alone                                                                                      |
| `.hero-grid`                 | styles.css:254-263 | `1fr` column, gap `32px`, center align                                                                          |
| `.hero-eyebrow` (+ `[` `]`)  | styles.css:265-290 | gold chip, mono 0.6875rem, ls 0.14em, brackets via ::before/::after                                             |
| `.hero h1`                   | styles.css:292-299 | `clamp(2rem, 4.5vw, 3rem)` / 600 / lh 1.1 / ls -0.02em / `--text-1`                                             |
| `.h1-accent`                 | styles.css:301-305 | `color: var(--gold)` + gold-line underline - **only gold in h1**                                                |
| `.hero-subtitle`             | styles.css:307-312 | `clamp(1rem, 2vw, 1.125rem)` / `--text-2` / mb 24px                                                             |
| `.hero-meta`                 | styles.css:314-323 | bordered chip, `--surface-1`, max-width 520px                                                                   |
| `.meta-item` / `:last-child` | styles.css:325-336 | column stack, pad `12px 16px`, hairline right border                                                            |
| `.meta-label`                | styles.css:338-344 | 0.6875rem / 600 / `--text-3`                                                                                    |
| `.meta-value`                | styles.css:346-351 | mono 0.9375rem / 500 / `--text-1`                                                                               |
| `.hero-dial`                 | styles.css:354-358 | flex center; `animation: rise-in 0.55s var(--ease-out) 0.14s both`                                              |
| `.loop-dial`                 | styles.css:360-363 | `width: min(240px, 70vw)`                                                                                       |
| `.dial-track`                | styles.css:365-369 | stroke `--hairline-strong`, width 5                                                                             |
| `.dial-progress`             | styles.css:371-381 | stroke `--gold`, width 5, dash 628.32/578.05, rotate -90, `animation: dial-draw 0.7s var(--ease-out) 0.1s both` |
| `@keyframes dial-draw`       | styles.css:383-391 | dashoffset 628.32 -> 578.05                                                                                     |
| `.dial-inner`                | styles.css:393-398 | stroke `--hairline-strong`, width 1.5, dash `2 6`                                                               |
| `.dial-node`                 | styles.css:400-402 | fill `--gold`                                                                                                   |
| `.dial-node-label`           | styles.css:404-410 | fill `--text-2`, 11px, ls 0.08em                                                                                |
| `.dial-center-value`         | styles.css:412-417 | fill `--text-1`, 36px / 600 mono                                                                                |
| `.dial-center-label`         | styles.css:419-425 | fill `--text-2`, 11px / 500 / ls 0.14em                                                                         |
| `.dial-center-sub`           | styles.css:427-433 | fill `--gold`, 11px / 600 / ls 0.1em                                                                            |
| `.hero-grid > .hero-copy`    | styles.css:541-543 | `rise-in 0.5s var(--ease-out) 0.02s both` (existing composite entrance - do not add more)                       |

### 2.3 Responsive anchors

| Rule                                                           | Anchor               |
| -------------------------------------------------------------- | -------------------- |
| `@media (width >= 768px) .hero` padding `64px 24px 48px`       | styles.css:2006-2008 |
| `@media (width >= 960px) .hero-grid` `7fr 5fr` gap 48          | styles.css:2021-2024 |
| `@media (width >= 960px) .hero-dial` flex-end                  | styles.css:2026-2028 |
| `@media (width >= 960px) .loop-dial` width 240px               | styles.css:2030-2032 |
| `@media (width <= 480px) .meta-item` full-width rows           | styles.css:2075-2085 |
| `@media (width <= 639px)` phase-band only (no hero rule today) | styles.css:2069-2073 |

### 2.4 Motion / constraint canaries (baseline)

| Canary                                      | Anchor                                                       | Value now                                                                                                    |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| ease token `cubic-bezier(0.2, 0.8, 0.2, 1)` | styles.css:51                                                | count **1**                                                                                                  |
| lift `translateY(-1px)`                     | styles.css:779 (`.top3-card`), styles.css:1914 (`.pws-link`) | count **2**                                                                                                  |
| RM kill-switch                              | styles.css:2102-2114 (`animation: none !important` at 2120)  | present; universal `*` rule                                                                                  |
| JS RM mirror                                | app.js:390-397                                               | `matchMedia("(prefers-reduced-motion: reduce)")`                                                             |
| `will-change` / `animation-timeline`        | styles.css                                                   | **0** matches                                                                                                |
| `getElementById` hooks                      | app.js                                                       | **18**                                                                                                       |
| `STATE_KEY`                                 | app.js:8                                                     | `"gate-earn-dashboard-v1"`                                                                                   |
| load budget                                 | styles.css:357, 380, 462, 542                                | composite rise-in + dial-draw ends <= ~0.8s; dial-draw is THE orchestrated moment (0.1s delay + 0.7s = 0.8s) |
| 44px / focus / skip                         | styles.css:133-158, 184-185                                  | intact - do not regress                                                                                      |

---

## 3. Target design (per element)

Frozen copy (do not alter character-for-character): `Earn While You Learn` · `GATE CSE 2027 - ₹30K-1L+/month while preparing for the exam` · `143` · `DAYS TO GATE` · `FEB 2027` · `GATE CSE` · `STUDY` / `BUILD` / `MONETIZE` · `LIE Loop Strategy` · `Goal` · `₹30K-1L+/mo`.

Token rule: prefer existing `:root` tokens (`--gold`, `--text-1/2/3`, `--surface-*`, `--ink`, `--hairline`, `--hairline-strong`, `--gold-line`, `--gold-soft`, `--ease-out`, `--radius-*`). If a new value is truly required, define it once in `:root` (styles.css:25-54) matching the existing palette; no ad-hoc hex outside tokens. No new typeface - IBM Plex Mono + existing sans stack stay (styles.css:21).

### Pillar A - Type hierarchy

| #   | Element                       | Anchor                            | Change                                                                                                                                                                                                                                                                                                                                                      | Tokens                                     | Before -> after intent                                                                         |
| --- | ----------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| A1  | `.hero h1`                    | styles.css:292-299                | Raise display scale + weight contrast: `font-size: clamp(2.25rem, 5.2vw, 3.5rem)`; `font-weight: 700`; `line-height: 1.05`; `letter-spacing: -0.03em`; keep `color: var(--text-1)`; `margin-bottom: 16px` (or 12px if tightening rhythm with eyebrow)                                                                                                       | `--text-1`                                 | Flat 600/3rem headline -> clear display command; weight+scale separation from subtitle         |
| A2  | `.h1-accent`                  | styles.css:301-305                | Keep gold **only** here on "Earn". Optional strengthen: keep `border-bottom: 2px solid var(--gold-line)`; ensure `padding-bottom` remains em-based so underline tracks larger h1                                                                                                                                                                            | `--gold`, `--gold-line`                    | Gold already correct-scope; larger h1 inherits accent without spreading gold to other h1 words |
| A3  | `.hero-eyebrow` (+ brackets)  | styles.css:265-290; index.html:58 | Refine to a real section mark: keep mono/uppercase/brackets (they encode "section stamp"); reduce competitive weight - `padding: 5px 9px`; `margin-bottom: 14px`; keep `border: 1px solid var(--gold-line)`; background stays `var(--gold-soft)` (quiet fill) or drop to `transparent` only if chip still reads at AA both themes; do **not** increase size | `--gold`, `--gold-soft`, `--gold-line`     | Decorative gold pill competing with h1 -> quieter editorial section mark above a dominant h1   |
| A4  | `.hero-subtitle`              | styles.css:307-312                | Quieter/tighter: `font-size: clamp(0.9375rem, 1.8vw, 1.0625rem)`; `line-height: 1.45`; `color: var(--text-2)`; `margin-bottom: 20px`; keep `max-width: 36em`                                                                                                                                                                                                | `--text-2`                                 | Near-h1 presence -> supporting deck; tighter gap into meta                                     |
| A5  | `.hero-meta` + `.meta-item`   | styles.css:314-336                | Quieter chip: `.meta-item` padding `10px 14px`; `.hero-meta` `max-width: min(520px, 100%)`; keep hairline border + `--surface-1`                                                                                                                                                                                                                            | `--surface-1`, `--hairline`, `--radius-md` | Wide heavy Goal bar -> compact factual chip                                                    |
| A6  | `.meta-label` / `.meta-value` | styles.css:338-351                | No color change (AA: `--text-3`/`--text-1` on `--surface-1` already pass both themes). Optional: `.meta-value` stays 0.9375rem/500 mono - do not enlarge                                                                                                                                                                                                    | `--text-3`, `--text-1`                     | Label/value roles unchanged; chip softens via padding only                                     |

### Pillar B - Dial as thesis

| #   | Element                                     | Anchor                                 | Change                                                                                                                                                                                                                                                                                               | Tokens                 | Before -> after intent                                                              |
| --- | ------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------- |
| B1  | `.dial-track`                               | styles.css:365-369                     | Recede track: `stroke: var(--hairline)` (from `--hairline-strong`); `stroke-width: 6` (from 5) for a calmer wider bed                                                                                                                                                                                | `--hairline`           | Track and progress fight at equal weight -> track is background architecture        |
| B2  | `.dial-progress`                            | styles.css:371-381                     | Advance progress: keep `--gold`; `stroke-width: 6`; keep `stroke-linecap: butt`, dasharray/dashoffset, rotate, and `animation: dial-draw 0.7s var(--ease-out) 0.1s both` **unchanged**                                                                                                               | `--gold`, `--ease-out` | Thin gold arc -> decisive progress ribbon over quieter track                        |
| B3  | `@keyframes dial-draw`                      | styles.css:383-391                     | **No change** to keyframes, duration, delay, or easing                                                                                                                                                                                                                                               | `--ease-out`           | Still THE single orchestrated load moment, ends at 0.8s                             |
| B4  | `.dial-inner`                               | styles.css:393-398                     | Calmer: `stroke: var(--hairline)`; `stroke-width: 1`; `stroke-dasharray: 2 8` (slightly more air than `2 6`)                                                                                                                                                                                         | `--hairline`           | Busy dotted ring -> quiet secondary structure                                       |
| B5  | `.dial-node`                                | styles.css:400-402                     | Keep `fill: var(--gold)`; optional `r` via CSS not required - leave SVG r=5                                                                                                                                                                                                                          | `--gold`               | Node dots stay achievement gold (progress doctrine, styles.css:11)                  |
| B6  | `.dial-node-label`                          | styles.css:404-410; index.html:85-93   | Spacing hierarchy: `font-size: 10px` (quieter than center stack); `letter-spacing: 0.1em`; keep `fill: var(--text-2)`. SVG attrs OK: STUDY y 40 -> 38; BUILD keep x=190 y=157; MONETIZE x=63 y=178 -> 176 - equalize optical distance from nodes (index.html:85-93). `aria-label` on svg must remain | `--text-2`             | Labels compete with center value -> perimeter stamps sit back; radial rhythm tidier |
| B7  | `.dial-center-value` (`143`)                | styles.css:412-417; index.html:94-101  | Numeric hero: `font-size: 46px` (from 36); `font-weight: 700`; keep mono + `fill: var(--text-1)`. Adjust SVG `y` 112 -> 108 (and re-center block - see B8) so larger glyphs stay optically centered                                                                                                  | `--text-1`             | Modest 36px figure -> the dial's (and hero's) numeric headline                      |
| B8  | `.dial-center-label` (`DAYS TO GATE`)       | styles.css:419-425; index.html:102-109 | Tighter treatment: keep `font-size: 11px` but `letter-spacing: 0.12em` (from 0.14em); tighten pair gap - SVG `y` 130 -> 126 when value moves to y=108; fill stays `--text-2`                                                                                                                         | `--text-2`             | Floating caption -> snug unit-label under the numeral                               |
| B9  | `.dial-center-sub` (`FEB 2027`, `GATE CSE`) | styles.css:427-433; index.html:110-125 | Keep gold + 11px; if center block shifts, move y 148 -> 144 and 164 -> 160; `letter-spacing` keep 0.1em                                                                                                                                                                                              | `--gold`               | Meta dates remain gold achievement stack, subordinate to 143                        |
| B10 | `svg.loop-dial` aria/structure              | index.html:73-126                      | Keep all elements, classes, `viewBox`, `role="img"`, `aria-label` verbatim. Attribute `y` tweaks allowed solely for hierarchy above                                                                                                                                                                  | -                      | Structure preserved; presentation-only shifts                                       |

**Center stack y-plan (SVG user units, after):** value y=108 (46px) · label y=126 · FEB 2027 y=144 · GATE CSE y=160. All still inside r=66 inner circle optical field; if implementer sees collision with inner dash ring, prefer CSS size trim (44px) over moving nodes.

### Pillar C - Composition

| #   | Element            | Anchor                                   | Change                                                                                                                                                            | Tokens / values                                    | Before -> after intent                                                      |
| --- | ------------------ | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------- |
| C1  | `.hero` padding    | styles.css:221-227; styles.css:2006-2008 | Base `padding: 56px 16px 48px` (from 48px top - more air above eyebrow); >=768px keep `64px 24px 48px` unless rhythm needs `72px 24px 56px`                       | spacing scale 4/8/12/16/24/32/48/64 (styles.css:1) | Tight top -> vertical rhythm that frames both columns                       |
| C2  | `.hero-grid`       | styles.css:254-263                       | Base gap `36px` (from 32px); keep `align-items: center`                                                                                                           | spacing                                            | Cramped stack -> readable separation copy vs dial                           |
| C3  | `.hero-grid` @960  | styles.css:2021-2024                     | Balance columns: `grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr)`; keep `gap: 48px` (or 40px if copy runs short)                                  | -                                                  | 7fr/5fr copy-heavy -> dial holds stronger thesis weight without crowding h1 |
| C4  | `.hero-dial` @960  | styles.css:2026-2028                     | Keep `justify-content: flex-end`                                                                                                                                  | -                                                  | Dial anchors to trailing edge of its column                                 |
| C5  | `.loop-dial` width | styles.css:360-363; styles.css:2030-2032 | Keep base `min(240px, 70vw)`; keep `240px` at >=960. Do **not** shrink below 220px effective at 375px                                                             | -                                                  | Mobile legibility floor for 143 + labels                                    |
| C6  | Copy column rhythm | styles.css:265-351                       | Stack order unchanged; tighten only as specified in A3-A5 so eyebrow -> h1 -> subtitle -> meta reads as one left column with deliberate micro-gaps (14 / 16 / 20) | spacing 4-pt scale                                 | Loose unrelated blocks -> one vertical thesis opposite the dial             |

### Pillar D - Motion (frozen policy)

| #   | Item                         | Spec                                                                                                                                                                                                            |
| --- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | dial-draw                    | Remains THE single orchestrated load moment: `0.7s var(--ease-out) 0.1s` (styles.css:380). Total end 0.8s = budget ceiling. No duration/delay/keyframe edits.                                                   |
| D2  | Existing composite entrances | `.hero-dial` rise-in (styles.css:357), `.hero-copy` rise-in (styles.css:541-543), KPI rise-ins (styles.css:462-479) stay as-is. Spec adds **zero** new `animation`/`transition` declarations in the hero block. |
| D3  | Ease                         | Single ease only - `var(--ease-out)` / styles.css:51. `rg -c cubic-bezier styles.css` must remain **1**.                                                                                                        |
| D4  | Lifts                        | Exactly 2: styles.css:779, styles.css:1914. Hero gains **no** `translateY(-1px)`.                                                                                                                               |
| D5  | RM                           | styles.css:2102 kill-switch continues to cover all motion (`animation: none !important`). No hero motion outside it.                                                                                            |
| D6  | Forbidden                    | No `will-change`, no `animation-timeline`, no hover-lift on hero cards, no JS motion drivers (app.js FROZEN).                                                                                                   |

---

## 4. Concrete implementation notes

**Scope files:** `styles.css` primarily; `index.html` only for optional SVG `y` attribute tweaks (B6-B9) - never text content.

1. **CSS property edits (by selector)**
   - `.hero` - padding-block top (C1).
   - `.hero-grid` - `gap` (C2); inside `@media (width >= 960px)` replace `grid-template-columns: 7fr 5fr` with `minmax(...)` pair (C3).
   - `.hero-eyebrow` - `padding`, `margin-bottom`; optional `background` (A3).
   - `.hero h1` - `font-size`, `font-weight`, `line-height`, `letter-spacing` (A1).
   - `.h1-accent` - verify only; no gold removal (A2).
   - `.hero-subtitle` - `font-size`, `line-height`, `margin-bottom` (A4).
   - `.meta-item` - `padding` (A5); `.hero-meta` max-width (A5).
   - `.dial-track` - `stroke`, `stroke-width` (B1).
   - `.dial-progress` - `stroke-width` only (B2); animation line untouched.
   - `.dial-inner` - `stroke`, `stroke-width`, `stroke-dasharray` (B4).
   - `.dial-node-label` - `font-size`, `letter-spacing` (B6).
   - `.dial-center-value` - `font-size`, `font-weight` (B7).
   - `.dial-center-label` - `letter-spacing` (B8).
   - `.dial-center-sub` - no required change (B9 optional y only).
2. **SVG attribute edits (index.html, optional)**  
   Only `y` on `.dial-node-label` / `.dial-center-value` / `.dial-center-label` / `.dial-center-sub` as in §3. Keep `x`, `text-anchor`, `cx/cy/r`, `viewBox`, classes, `role`, `aria-label` (index.html:77) identical. All visible strings unchanged.
3. **New tokens**  
   None expected. If implementer needs one (e.g. eyebrow transparent), define in `:root` (styles.css:25-54) as a named var derived from existing gold/surface values - do not paste raw hex mid-file.
4. **Do not touch**  
   glow `::before/::after` (styles.css:229-252), KPI strip, sections below hero, RM block, lifts, ease token, any app.js line, any date/copy string, `color-scheme` blocks (styles.css:27, 58).
5. **Prettier**  
   Multi-line CSS/SVG must pass `npx prettier --check index.html styles.css app.js` after edits.

---

## 5. Mobile / responsive notes (375px dial legibility)

- Base (mobile-first) is a single column: copy then dial (styles.css:254-263). Keep that stack; do not introduce side-by-side below 960px.
- `.loop-dial` base `min(240px, 70vw)` -> at **375px** width = **262.5 capped by 240px** -> renders **240px**. At **320px** = 224px. Floor: never set base width below `min(240px, 70vw)`.
- Center value at 46px SVG units on a 240px-wide box (viewBox 240) scales 1:1 -> **46px optical** - legible at 375px. If implementer scales dial down, clamp value CSS to `>= 40px` effective.
- Node labels at 10px SVG units -> ~10px rendered at 240px width; keep letter-spacing >= 0.08em so STUDY/BUILD/MONETIZE do not mush.
- `@media (width <= 480px)` (styles.css:2075-2085): Goal chip rows stack full-width - unchanged; still below dial in DOM after hero-dial? No - meta is in copy column above dial. Ensure A5 padding keeps chip readable; no font below 0.6875rem on labels.
- `@media (width <= 639px)` (styles.css:2069): no dedicated hero rule today - do not add hero rules here unless a legibility bug appears; prefer base styles.
- `>=768px` (styles.css:2006): padding already opens vertical rhythm - C1 only touches base `48px` top, not this rule, unless aligning to 72px as in C1 optional.
- `>=960px` (styles.css:2020): two-column; C3 `minmax(240px, ...)` second track guarantees dial column never collapses below 240px.
- Verify after implement: at 375px and 320px, no horizontal scroll; `143` not clipped by `.dial-inner`; labels not colliding with center stack.

---

## 6. Acceptance checklist (implementer + gate; grep-able)

Run from repo root. DENIED: `node --check`, `stylelint`, `python3`, `&&`-chained commands.

**Canaries (must match baseline exactly):**

```bash
rg -c 'getElementById' app.js
# expect: 18

rg -n 'STATE_KEY' app.js | head -1
# expect: app.js:8  const STATE_KEY = "gate-earn-dashboard-v1";

rg -c 'translateY\(-1px\)' styles.css
# expect: 2
rg -n 'translateY\(-1px\)' styles.css
# expect: styles.css:779 and styles.css:1914 only

rg -c 'cubic-bezier' styles.css
# expect: 1
rg -n 'cubic-bezier' styles.css
# expect: styles.css:51  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);

rg -n 'prefers-reduced-motion' styles.css
# expect: >=1 hit at styles.css:2102

rg 'will-change|animation-timeline' styles.css
# expect: no matches

rg -n 'dial-draw' styles.css
# expect: styles.css:380 (animation) and styles.css:383 (@keyframes)

rg -n 'animation: dial-draw' styles.css
# expect: 0.7s var(--ease-out) 0.1s  (ends <= 0.8s)

rg -n 'animation:' styles.css | rg 'hero|dial|kpi|hero-copy'
# expect: no NEW animation lines vs baseline; hero-dial:357, dial-progress:380, kpi-cell:462, hero-copy:542 only
```

**Scope / freeze:**

```bash
git diff --name-only
# expect: only index.html, styles.css, docs/plan/20260923-hero-dial-upgrade/*

git diff --stat app.js
# expect: empty (app.js FROZEN)

rg -n 'React|Tailwind|GSAP|anime\.js|htmx|cdn\.' index.html styles.css app.js
# expect: no matches (KEEP_VANILLA)

rg -n 'FEB 2027|GATE CSE|DAYS TO GATE|LIE Loop Strategy|₹30K-1L' index.html
# expect: all frozen strings still present, unmodified
```

**Suite (embed stdout in implement report):**

```bash
npx prettier --check index.html styles.css app.js
npx tsc --allowJs --checkJs false --noEmit app.js
npx eslint app.js
```

**Design acceptance:**

- [ ] `design-spec.md` labeled DESIGN-SPEC; four pillars covered (type, dial-thesis, composition, motion).
- [ ] A1: h1 display scale/weight increased; A2: gold only on Earn via `.h1-accent`.
- [ ] B1/B2: track recessed vs progress advanced; B4 inner calmer; B6 label hierarchy; B7 143 numeric hero; B8 tighter DAYS TO GATE.
- [ ] C3: copy|dial grid balance at >=960; C5: dial still >=240px effective at 375px.
- [ ] D: no new animations; dial-draw sole orchestrated moment <=800ms; ease count 1; lifts 2; RM present; will-change 0.
- [ ] WCAG AA both themes for every color-touched pair (tokens only); 44px targets + focus-visible + skip-link unregressed (styles.css:133-158).
- [ ] ASCII-only source edits except existing Rs (rupee) in frozen copy.
- [ ] No recommendation requires app.js edit or git push.

---

## 7. Risk notes

| Risk                    | Why                                                                                                       | Mitigation in this spec                                                                                                                                                                                                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **AA contrast**         | Quieter subtitle/meta, larger 143, possible eyebrow background change can flip dark or light theme ratios | All fills stay on existing AA-proven pairs (`--text-1/2/3` on `--ink`/`--surface-1`; `--gold` on `--ink`; light remaps styles.css:57-73). Spec forbids new hex; any new token must be derived from palette. Eyebrow `transparent` background only if `--gold` on `--ink` still AA (it is today). Gate re-checks touched pairs with file:line cites. |
| **Motion budget**       | Larger type / grid edits tempt a second entrance or duration nudge                                        | D1-D6 freeze dial-draw params; acceptance greps assert animation set unchanged and cubic-bezier count=1; TDD-red: prove no new `animation:` lines in hero before edit.                                                                                                                                                                              |
| **Hierarchy inversion** | If 143 grows too far or h1 shrinks, either copy or dial fails to lead; two heroes compete                 | Pair A1 (h1 up to max 3.5rem/700) with B7 (46px mono number - smaller than h1 cap, larger than everything else in dial). Subtitle/meta only get quieter (A4-A6). Dial wins the _numeric_ thesis; h1 wins _verbal_ thesis - complementary, not competing.                                                                                            |
| **Mobile dial crush**   | C3 column mins or bigger center value can clip at 375/320                                                 | C5 floor `min(240px, 70vw)`; `minmax(240px, ...)` at 960 only; center-stack y-plan checked against inner ring; legibility checklist §5.                                                                                                                                                                                                             |
| **SVG y drift**         | Moving text y for hierarchy can collide nodes/labels or break aria                                        | Allowlist y-only edits (B6-B9); `aria-label` and all text nodes frozen; if collision, reduce CSS font-size first, not layout.                                                                                                                                                                                                                       |
| **Scope creep**         | Glow, KPI, footer-reintroduction, copy "improvements", push                                               | Non-goals + git diff canary + out-of-scope list in plan.yaml:54-61; stage paths explicit; push ask-only.                                                                                                                                                                                                                                            |
| **Stale anchors**       | Prior plan lines (50/786/1946/2160) differ from this tree                                                 | This inventory revalidated: 51/779/1914/2102 - evidence_rule requires these current lines at gate time.                                                                                                                                                                                                                                             |

---

_End DESIGN-SPEC. Next: hero-implement (wave 2) consumes this file; append IMPLEMENT NOTES only after TDD-red/green + suite stdout._

---

## IMPLEMENT NOTES (wave 2 hero-implement)

| Field         | Value                                                     |
| ------------- | --------------------------------------------------------- |
| plan_id       | 20260923-hero-dial-upgrade                                |
| task_id       | hero-implement                                            |
| date          | 2026-09-23                                                |
| contract      | IMPLEMENT-DIFF-REPORT                                     |
| skill loaded  | frontend-philosophy (+ frontend-design, tdd) before edits |
| files touched | styles.css, index.html (source); design-spec.md (report)  |
| app.js        | FROZEN - zero edits (git diff --stat app.js empty)        |
| commit / push | none (no commit, no push; repo remains ahead 2)           |

### Files touched

- `styles.css` - 49 lines changed (pillar A/B/C CSS targets)
- `index.html` - 12 lines changed (SVG y-only B6-B9 tweaks)
- `docs/plan/20260923-hero-dial-upgrade/design-spec.md` - this report appended
- `app.js` - NOT touched

### TDD-red (absence greps before edit)

Each target value was proven absent (rg exit 1 / no match) prior to edit:

```bash
rg -n 'clamp\(2\.25rem, 5\.2vw, 3\.5rem\)|padding: 5px 9px|clamp\(0\.9375rem, 1\.8vw, 1\.0625rem\)|min\(520px, 100%\)|stroke-width: 6|stroke-dasharray: 2 8|font-size: 46px|padding: 56px 16px 48px|gap: 36px|minmax\(0, 1\.15fr\)|minmax\(240px, 0\.85fr\)' styles.css
# RED: no output (all target values absent)

rg -n 'y="38"|y="176"|y="108"|y="126"|y="144"|y="160"' index.html
# RED: no output (target y absent)

rg -n 'font-size: 10px' styles.css
# RED: no output
```

Baseline BEFORE values present (red context, pre-edit):

```text
styles.css:226  padding: 48px 16px;                 (hero)
styles.css:261  gap: 32px;                          (hero-grid)
styles.css:269  padding: 6px 10px;                  (eyebrow)
styles.css:279  margin-bottom: 16px;                (eyebrow)
styles.css:293  font-size: clamp(2rem, 4.5vw, 3rem); (h1)
styles.css:294  font-weight: 600;                   (h1)
styles.css:295  line-height: 1.1;                   (h1)
styles.css:296  letter-spacing: -0.02em;            (h1)
styles.css:308  font-size: clamp(1rem, 2vw, 1.125rem); (subtitle)
styles.css:310  margin-bottom: 24px;                (subtitle; no line-height)
styles.css:322  max-width: 520px;                   (hero-meta)
styles.css:330  padding: 12px 16px;                 (meta-item)
styles.css:367  stroke: var(--hairline-strong);     (dial-track)
styles.css:368  stroke-width: 5;                    (dial-track)
styles.css:374  stroke-width: 5;                    (dial-progress)
styles.css:395  stroke: var(--hairline-strong);     (dial-inner)
styles.css:396  stroke-width: 1.5;                  (dial-inner)
styles.css:397  stroke-dasharray: 2 6;              (dial-inner)
styles.css:407  font-size: 11px;                    (node-label)
styles.css:409  letter-spacing: 0.08em;             (node-label)
styles.css:415  font-size: 36px;                    (center-value)
styles.css:416  font-weight: 600;                   (center-value)
styles.css:424  letter-spacing: 0.14em;             (center-label)
styles.css:2022 grid-template-columns: 7fr 5fr;     (@960 hero-grid)
index.html:85   y="40"  STUDY
index.html:91   y="178" MONETIZE
index.html:97   y="112" center value
index.html:105  y="130" DAYS TO GATE
index.html:113  y="148" FEB 2027
index.html:121  y="164" GATE CSE
```

### file:line before -> after

| Pillar | Target                      | Before (file:line / value)                                     | After (file:line / value)                                                  |
| ------ | --------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| A1     | `.hero h1`                  | styles.css:293-298 clamp(2rem,4.5vw,3rem)/600/1.1/-0.02em mb16 | styles.css:293-298 clamp(2.25rem,5.2vw,3.5rem)/700/1.05/-0.03em mb16       |
| A2     | `.h1-accent`                | styles.css:301-305 gold+underline only on Earn                 | styles.css:301-305 UNCHANGED (verified gold-only)                          |
| A3     | `.hero-eyebrow`             | styles.css:269 pad 6px 10px; :279 mb 16px                      | styles.css:269 pad 5px 9px; :279 mb 14px                                   |
| A4     | `.hero-subtitle`            | styles.css:308-310 clamp(1rem,2vw,1.125rem) mb24               | styles.css:308-311 clamp(0.9375rem,1.8vw,1.0625rem) lh1.45 mb20            |
| A5     | `.meta-item` / `.hero-meta` | styles.css:330 pad 12px 16px; :322 max-width 520px             | styles.css:331 pad 10px 14px; :323 max-width min(520px,100%)               |
| B1     | `.dial-track`               | styles.css:367-368 hairline-strong w5                          | styles.css:368-369 hairline w6                                             |
| B2     | `.dial-progress`            | styles.css:374 w5; animation line untouched                    | styles.css:375 w6; :381 dial-draw 0.7s var(--ease-out) 0.1s both UNCHANGED |
| B3     | `@keyframes dial-draw`      | styles.css:383-391                                             | styles.css:384-392 UNCHANGED                                               |
| B4     | `.dial-inner`               | styles.css:395-397 hairline-strong w1.5 dash 2 6               | styles.css:396-398 hairline w1 dash 2 8                                    |
| B6     | `.dial-node-label` CSS      | styles.css:407/409 11px / 0.08em                               | styles.css:408/410 10px / 0.1em                                            |
| B6     | SVG y STUDY / MONETIZE      | index.html:85 y40; :91 y178                                    | index.html:85 y38; :91 y176                                                |
| B7     | `.dial-center-value` CSS    | styles.css:415-416 36px / 600                                  | styles.css:416-417 46px / 700                                              |
| B7     | SVG y center value          | index.html:97 y112                                             | index.html:97 y108                                                         |
| B8     | `.dial-center-label` CSS    | styles.css:424 ls 0.14em                                       | styles.css:425 ls 0.12em                                                   |
| B8     | SVG y DAYS TO GATE          | index.html:105 y130                                            | index.html:105 y126                                                        |
| B9     | SVG y FEB 2027 / GATE CSE   | index.html:113 y148; :121 y164                                 | index.html:113 y144; :121 y160                                             |
| C1     | `.hero` padding             | styles.css:226 48px 16px                                       | styles.css:226 56px 16px 48px                                              |
| C2     | `.hero-grid` gap            | styles.css:261 32px                                            | styles.css:261 36px                                                        |
| C3     | `.hero-grid` @960           | styles.css:2022 7fr 5fr                                        | styles.css:2023 minmax(0,1.15fr) minmax(240px,0.85fr)                      |
| D      | all motion targets          | baseline                                                       | UNCHANGED (see canaries)                                                   |

BUILD node y=157 unchanged (index.html:88). viewBox, role, aria-label, classes, text content all unchanged.

### TDD-green (presence greps after edit)

```text
styles.css:226  padding: 56px 16px 48px;
styles.css:261  gap: 36px;
styles.css:269  padding: 5px 9px;
styles.css:279  margin-bottom: 14px;
styles.css:293  font-size: clamp(2.25rem, 5.2vw, 3.5rem);
styles.css:294  font-weight: 700;
styles.css:295  line-height: 1.05;
styles.css:296  letter-spacing: -0.03em;
styles.css:298  margin-bottom: 16px;
styles.css:308  font-size: clamp(0.9375rem, 1.8vw, 1.0625rem);
styles.css:309  line-height: 1.45;
styles.css:311  margin-bottom: 20px;
styles.css:323  max-width: min(520px, 100%);
styles.css:331  padding: 10px 14px;
styles.css:368  stroke: var(--hairline);
styles.css:369  stroke-width: 6;
styles.css:375  stroke-width: 6;
styles.css:381  animation: dial-draw 0.7s var(--ease-out) 0.1s both;
styles.css:396  stroke: var(--hairline);
styles.css:397  stroke-width: 1;
styles.css:398  stroke-dasharray: 2 8;
styles.css:408  font-size: 10px;
styles.css:410  letter-spacing: 0.1em;
styles.css:416  font-size: 46px;
styles.css:417  font-weight: 700;
styles.css:425  letter-spacing: 0.12em;
styles.css:2023 grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr);
index.html:85   y="38"
index.html:88   y="157" (BUILD kept)
index.html:91   y="176"
index.html:97   y="108"
index.html:105  y="126"
index.html:113  y="144"
index.html:121  y="160"
```

Old values absence (post-edit): clamp(2rem,4.5vw,3rem)=0, gap:32px=0 in hero, 7fr 5fr=0, font-size:36px=0, stroke-width:5=0, dash 2 6=0, padding 6px 10px=0, max-width:520px;=0, y40/y178/y112/y130/y148/y164=0.

A2 verify: `.h1-accent` styles.css:301-305 `color: var(--gold)` + underline; only gold span is `Earn` at index.html:60.

### Canary table

| Canary                                 | Expect                     | Result                                                                                   | Status |
| -------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------- | ------ |
| `rg -c getElementById app.js`          | 18                         | 18                                                                                       | PASS   |
| `rg -n STATE_KEY app.js`               | app.js:8 gate-earn-...     | app.js:8 `const STATE_KEY = "gate-earn-dashboard-v1";`                                   | PASS   |
| `rg -c 'translateY(-1px)' styles.css`  | 2                          | 2 (styles.css:780 top3-card, styles.css:1915 pws-link; +1 line shift)                    | PASS   |
| `rg -c cubic-bezier styles.css`        | 1                          | 1 (styles.css:51)                                                                        | PASS   |
| `rg -n prefers-reduced-motion`         | present                    | styles.css:2103 (present; baseline 2102 -> 2103 shift)                                   | PASS   |
| `rg 'will-change\|animation-timeline'` | no matches                 | no matches                                                                               | PASS   |
| `rg -n 'animation: dial-draw'`         | 0.7s var(--ease-out) 0.1s  | styles.css:381 `0.7s var(--ease-out) 0.1s both`                                          | PASS   |
| `rg -n dial-draw`                      | animation + keyframes only | styles.css:381 + :384                                                                    | PASS   |
| hero animation lines                   | no new                     | only dial-draw (dial-progress) in hero/dial filter; rise-in unchanged                    | PASS   |
| `git diff --name-only`                 | index.html + styles.css    | index.html, styles.css                                                                   | PASS   |
| `git diff --stat app.js`               | empty                      | empty                                                                                    | PASS   |
| frozen: 143                            | present                    | index.html:100                                                                           | PASS   |
| frozen: DAYS TO GATE                   | present                    | index.html:108                                                                           | PASS   |
| frozen: FEB 2027                       | present                    | index.html:116                                                                           | PASS   |
| frozen: GATE CSE                       | present                    | index.html:124                                                                           | PASS   |
| frozen: STUDY / BUILD / MONETIZE       | present                    | index.html:86 / 89 / 92                                                                  | PASS   |
| frozen: Earn                           | present                    | index.html:60 h1-accent                                                                  | PASS   |
| frozen: ₹30K-1L+/mo                    | present                    | index.html:68                                                                            | PASS   |
| frozen: LIE Loop Strategy              | present                    | index.html:58                                                                            | PASS   |
| KEEP_VANILLA libs                      | no frameworks              | no CDN/import matches introduced (pre-existing content word React in activity copy only) | PASS   |
| no commit / no push                    | none                       | none; ahead 2 unchanged                                                                  | PASS   |

Line-shift note: styles.css hero block gained net 0 lines (same line count per rule); lift markers moved 779->780 and 1914->1915 because `.hero-subtitle` gained a `line-height` line earlier in file. Count=2 invariant holds. RM 2102->2103 from same +1 shift. ease stays 51.

### FULL suite stdout

```text
$ npx prettier --check index.html styles.css app.js
Checking formatting...
All matched files use Prettier code style!

$ npx tsc --allowJs --checkJs false --noEmit app.js
(no output; exit 0)

$ npx eslint app.js
(no output; exit 0)
```

Suite status: all 3 green.

### Pillar summary

- A: h1 display scale/weight up (A1); gold only Earn (A2 verified); eyebrow quieter (A3); subtitle quieter/tighter (A4); meta chip compact (A5); label/value colors untouched (A6).
- B: track recessed + width 6 (B1); progress width 6, animation frozen (B2/B3); inner calmer (B4); node-label 10px/0.1em + y tweaks (B6); center value 46/700 + y108 (B7); DAYS TO GATE ls 0.12em + y126 (B8); subs y144/160 (B9); structure/aria intact (B10).
- C: hero pad 56/16/48 (C1); gap 36 (C2); @960 minmax pair (C3); dial flex-end kept (C4); loop-dial widths kept (C5); stack order kept (C6).
- D: zero new animations/transitions/lifts; dial-draw sole load moment <=800ms; ease count 1; lifts 2; RM present; will-change 0.

_End IMPLEMENT NOTES. Task hero-implement complete; ready for gate-ship (wave 3)._
