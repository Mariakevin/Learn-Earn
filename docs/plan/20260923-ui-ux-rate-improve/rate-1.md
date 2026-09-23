# Rate Findings Report - rate-1

Date: 2026-09-23
Scope: full page (index.html + styles.css; app.js read-only for behavior context)
Method: frontend-philosophy (5 Pillars) + rubric axes below; sole scorer; quality over quantity

## Overall score

**7.7 / 10**

## Per-axis table

| Axis                                  |   Weight |   Score | One-line rationale                                                                                                                                       |
| ------------------------------------- | -------: | ------: | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visual hierarchy                      |     0.15 |     7.5 | Clear hero -> KPI -> section cadence with gold-line headers; tier group titles recede under item names and long tier walls flatten importance            |
| Spacing rhythm / alignment            |     0.12 |     8.0 | Documented 4-8-12-16-24-32-48-64 scale is followed; section margin + header padding read as one system                                                   |
| Typography quality                    |     0.12 |     7.5 | Strong mono/sans role split and tabular numerals; sibling h3 sizes drift (0.9375 / 1 / 1.0625rem); several labels at 9-10px                              |
| Consistency / design-system coherence |     0.14 |     7.9 | Token system + palette doctrine are real and followed; hover language mixes interactive controls with static cards; heading scale uneven across sections |
| Interaction affordance & states       |     0.12 |     7.0 | Timeline, checklist, calculator, steppers are stateful and keyboard-ready; gold hover on non-clickable cards fakes affordance                            |
| Responsiveness / layout robustness    |     0.12 |     7.5 | Sound mobile-first grids and breakpoints; tiers 2-col pairs 3 vs 11 activity cards into severe height mismatch                                           |
| Dark-mode parity                      |     0.08 |     8.5 | Both themes authored deliberately (not inverted); accent remaps, check-icon swap, no pure black/white text                                               |
| A11y                                  |     0.10 |     8.5 | 44px targets, focus-visible ring, skip-link, role=status/progressbar, RM kill-switch, forced-colors note on week dots                                    |
| Overall craft                         |     0.05 |     7.5 | Intentional ledger/receipt motifs and disciplined motion budget; systemic affordance and micro-type rough edges keep it short of excellent               |
| **Total**                             | **1.00** | **7.7** | Weighted sum (rounded to one decimal)                                                                                                                    |

Philosophy cross-check (5 Pillars): color committed (gold/green semantics, no rainbow) PASS; motion is one staged load moment + dial draw within budget PASS; space shows section cadence plus boxed-vs-ledger variety PASS; depth via surface ladder, hero glow/noise, top-hi PASS; typography character is constrained by locked Inter+Plex pairing (leave-alone doctrine styles.css:20) - character carried by Plex Mono roles and scale, typeface swap out of scope.

## Threshold verdict

**score > 9.0? NO (7.7)**

Baseline does not clear the bar. Loop should improve the ranked findings below, then re-rate.

## STRONG (do not regress)

- Token system + written palette doctrine (styles.css:5-21, styles.css:23-81)
- IBM Plex Mono data roles with `tabular-nums slashed-zero` (styles.css:160-176)
- Single ease `--ease-out` + uniform 140ms state transitions (styles.css:50)
- Full `prefers-reduced-motion` kill-switch incl. view-transitions (styles.css:2160-2180)
- Global focus-visible gold ring (styles.css:132-135) and 44px skip-link (styles.css:138-158)
- One load moment inside 800ms: hero rise-in + KPI stagger + dial-draw (styles.css:357, styles.css:380, styles.css:462-479, styles.css:542)
- Semantic color discipline: gold = progress, green = money (styles.css:10-11, styles.css:553-578)
- Timeline weeks as real buttons with aria-label / aria-current + view-transition swap (app.js:331-367, styles.css:2145-2157)
- Distinctive receipt-ledger artifacts (styles.css:1949-1985) and unboxed rules ledger (styles.css:1818-1839)
- 44px stat steppers and calc label rows (styles.css:587-589, styles.css:1241-1247); checklist custom checkbox focus + strike states (styles.css:1424-1450)
- 70ch measure on section descriptions (styles.css:639-643); two-tier lift policy respected (only styles.css:786, styles.css:1946)

## Findings (ranked by user-perceptible impact)

### R1 - Gold hover on static cards fakes clickability

- Axis(s): interaction affordance; consistency
- Severity: major
- Evidence: styles.css:671-673 (.loop-step:hover), styles.css:745-748 (.chain-card:hover), styles.css:784-787 (.top3-card:hover + lift), styles.css:861-865 (.tier-card:hover), styles.css:939-941 (.activity-card:hover), styles.css:1536-1539 (.platform-card:hover), styles.css:1701-1703 (.career-card:hover), styles.css:1982-1985 (.artifact-card:hover); all targets are non-interactive divs (e.g. index.html:294, index.html:356, index.html:425, index.html:478, index.html:485, index.html:1328, index.html:1500, index.html:1809)
- User feels: the same gold border (and on top3, a lift) that marks real controls (stat-btn styles.css:608-611, timeline-week styles.css:1117-1120) now marks dead space; pointer moves to click, nothing happens, trust in affordances drops
- Fix direction: reserve gold border/hover/lift for interactive elements only; static cards keep no hover, or at most a non-affordance cue that does not reuse the control language (no gold border, no translateY)

### R2 - Tiers 2-column grid pairs cards with 3 vs 11 activities

- Axis(s): visual hierarchy; responsiveness/layout robustness
- Severity: major
- Evidence: styles.css:2100-2103 (.tiers-grid becomes `repeat(2, 1fr)` at 960px); activity counts - tier-1: 3 (index.html:478-564), tier-2: 5 (index.html:567-693), tier-3: 7 (index.html:696-810), tier-4: 11 (index.html:813-987)
- User feels: desktop view shows short Tier 01 stretched empty beside long Tier 02 (and Tier 03 beside longer Tier 04); ragged holes, weak scan path, tiers stop reading as a ranked ladder
- Fix direction: keep .tiers-grid single-column at all breakpoints (full-width stacked ledgers match the content asymmetry); do not add masonry or new chrome

### R3 - Tier titles render below their item names (hierarchy inversion)

- Axis(s): visual hierarchy; typography
- Severity: major
- Evidence: styles.css:918-923 (.tier-card > h3 is 1.0625rem / 600 but `color: var(--text-2)`); styles.css:950-953 (.activity-name 0.9375rem / 600 inherits body `--text-1` from styles.css:108-109)
- User feels: group heading is dimmer than the rows it contains; eyes land on activity names first, so tier grouping is hard to skim on long stacks
- Fix direction: promote .tier-card > h3 to `var(--text-1)` (keep size); optionally soften .activity-name to 500 weight or `--text-2` so container > item reads correctly - palette untouched

### R4 - Micro-labels under a readable floor (9-10px)

- Axis(s): typography quality; overall craft
- Severity: minor
- Evidence: styles.css:1973 (artifact OUTPUT badge 0.5625rem = 9px); styles.css:1018 (.phase-band 0.625rem = 10px) dropping to styles.css:2124 (0.5625rem at <=639px); styles.css:2141 (.week-label 0.625rem at <=480px); styles.css:419-424 (dial-center-label 9px) and styles.css:427-432 (dial-center-sub 10px)
- User feels: squinting at phase names on mobile, the OUTPUT tag, and dial subtext; information is present but effectively unreadable at arm's length
- Fix direction: floor mono UI labels at 0.6875rem (11px); reclaim room via tracking/padding/ellipsis (phase-band already ellipsizes styles.css:1025-1026) instead of shrinking below 11px; dial sizes scale inside viewBox - raise px there too

### R5 - Sibling section h3 sizes drift without reason

- Axis(s): consistency/design-system coherence; typography quality
- Severity: minor
- Evidence: styles.css:1493-1495 (.week-box h3 0.9375rem), styles.css:1782-1784 (.s9-block h3 0.9375rem), styles.css:1604-1606 (.strategy-box h3 1rem), styles.css:1712-1714 (.career-header h3 1rem), styles.css:1549-1551 (.platform-header h3 1.0625rem), styles.css:1631-1633 (.subsection-block > h3 1.0625rem)
- User feels: same-level headings change size section to section; page reads as assembled rather than systematized
- Fix direction: collapse section-block h3 to one step (recommend 1rem everywhere under h2); allow only h2 clamp (styles.css:631-637) and intentional mono h3 variants (week-box) to differ - document the rule in the existing header comment block (styles.css:1-3)

### R6 - 72px scroll/sticky offsets left over from removed sticky header

- Axis(s): spacing rhythm; overall craft
- Severity: minor
- Evidence: styles.css:94 (html `scroll-padding-top: 72px`); research note: sticky header removed in aa8dbd0; styles.css:2111-2114 (.calc-total sticky `top: 72px` at >=960px) while fixed theme toggle occupies styles.css:180-185 (top 12px, 44px tall)
- User feels: in-page jumps (skip-link targets, any #anchor) land with a phantom empty band; sticky calculator total floats below a gap that looks like missing UI
- Fix direction: set scroll-padding-top to ~16-24px (still clears nothing sticky); sticky .calc-total top to 64-68px only if it must clear the fixed toggle (12+44=56px) - prefer ~60px so the gap is toggle clearance, not header ghost; no new header

### R7 - content-visibility can mis-size long sections on first pass

- Axis(s): responsiveness/layout robustness
- Severity: minor
- Evidence: styles.css:621-622 (.section { content-visibility: auto; contain-intrinsic-size: auto 600px; }) across variable-height sections (tiers ~500 lines of markup index.html:468-989 vs short rules section index.html:1633-1702)
- User feels: first scroll through cold sections can jitter the scrollbar when rendered height differs sharply from the 600px placeholder; `auto` keyword fixes later passes but first impression stutters
- Fix direction: keep content-visibility but give heavy sections a closer intrinsic size where it is stable (or per-section overrides for #tiers); verify first-scroll on mid-tier hardware before ship - no framework, CSS only

## Appendix - constraints reminder (for implementer)

- READ-ONLY baseline: only rate-1.md written this round; index.html / styles.css / app.js untouched; no git commit/stage/push
- KEEP_VANILLA; app.js FROZEN (STATE_KEY gate-earn-dashboard-v1 app.js:8)
- Motion budget locked: single ease styles.css:50; lifts only .top3-card:786 + .pws-link:1946; RM kill-switch styles.css:2160; one load moment <=800ms; no will-change / animation-timeline; no "add more animation" fixes
- A11y floor: 44px targets, focus-visible styles.css:132-135, WCAG AA both themes, keyboard, skip-link styles.css:138
- Copy / dates / color-scheme logic / app.js / brand replacement OUT; palette micro-refinement only if AA holds in BOTH themes
- Inter+Plex pairing, dark-default architecture, gold tints, surface ladder, light accent remaps: leave alone (styles.css:20-21)
- Quality over quantity; designer scores only; re-rate threshold remains > 9.0
- ASCII in this file except Rs
