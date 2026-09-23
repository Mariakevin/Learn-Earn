# Motion Research Findings - plan 20260922-animations-effects-best-practices

Task: motion-research-2 (wave 1, read-only). Stack: vanilla zero-build index.html / styles.css / app.js.
Baseline file: docs/plan/20260922-animations-effects-transitions/findings.md (F1-F18; 8 DO shipped in 4874c9c, 10 SKIP).
Labeling rule: prior 8 DOs = DONE-BASELINE (verified present in working tree); prior 10 SKIPs = SKIP-BASELINE (original skip rationale reused, not relitigated). Only NEW findings carry actionable DO/SKIP verdicts.

Verification of DONE-BASELINE in tree at 4874c9c:

- F1: rise-in + dial-draw composite-only present (styles.css dial/KPI/hero-copy keyframes).
- F3: --ease-out cubic-bezier(0.2, 0.8, 0.2, 1) sole token (styles.css tokens).
- F6: ::view-transition-group(week-detail) { animation-duration: 180ms } present (styles.css tail).
- F10: .timeline-week:hover, .timeline-week:focus-visible { background: var(--gold-soft) } present.
- F11: ::-moz-range-thumb transition + :hover gold-dim present.
- F12: @media (forced-colors: active) week-dot outline + aria-current label weight present (styles.css ~1225).
- F15: .timeline-week:active { background: var(--gold-soft) } present (no transform).
- F17: load inventory unchanged (dial-draw 0.1s+0.7s; KPI delays 0.05-0.23s + 0.45s; ends <=0.82s budget edge) - process gate holds.

---

## Baseline: prior 8 DOs (DONE-BASELINE - not re-opened)

### B-F1 DONE-BASELINE

- title: Composite-only entrance inventory (rise-in + dial-draw)
- summary: Shipped rule: entrances animate opacity/transform (and SVG stroke-dashoffset for dial only); no layout props on DOM entrances.
- sources: https://web.dev/articles/animations-guide ; https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- baseline: DONE-BASELINE (prior DO; verified in tree)
- fit: Zero-cost guardrail; vanilla CSS keyframes already match; no libraries.
- target: styles.css rise-in keyframes, .kpi-cell stagger, .dial-progress dial-draw, .hero-copy
- reduced-motion: Global kill-switch collapses animation-duration to 0.01ms -> final state.
- risk: Do not animate top/left/margin/height on any new entrance; do not "optimize" dial-draw.

### B-F3 DONE-BASELINE

- title: Single ease token cubic-bezier(0.2,0.8,0.2,1) validated
- summary: Shipped as sole --ease-out; web.dev/NN/g ease-out guidance matches; no second curve introduced.
- sources: https://web.dev/articles/the-basics-of-easing ; https://www.nngroup.com/articles/animation-duration/ ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function
- baseline: DONE-BASELINE (prior DO; token present)
- fit: Apply var(--ease-out) to all new transitions; reject any new cubic-bezier.
- target: styles.css --ease-out token
- reduced-motion: Durations collapse under kill-switch; token itself inert under RM.
- risk: Review gate: no linear/bounce/elastic/second token.

### B-F6 DONE-BASELINE

- title: ::view-transition-group(week-detail) 180ms sync
- summary: Shipped alongside old/new 180ms rules so group duration stays in sync (MDN guidance).
- sources: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using ; https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- baseline: DONE-BASELINE (prior DO; selector present at styles.css tail)
- fit: Vanilla CSS one-liner; no new view-transition-names.
- target: styles.css ::view-transition-group(week-detail)
- reduced-motion: ::view-transition-* { animation: none !important } in kill-switch covers it.
- risk: Keep as-is; do not add more named VT elements.

### B-F10 DONE-BASELINE

- title: Timeline :focus-visible background parity with hover
- summary: Shipped: .timeline-week:focus-visible paints gold-soft same as hover (WCAG 2.4.7 discoverability parity).
- sources: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html ; https://web.dev/learn/css/transitions
- baseline: DONE-BASELINE (prior DO; selector present)
- fit: Vanilla CSS; keyboard timeline buttons already an a11y concern.
- target: styles.css .timeline-week:hover, .timeline-week:focus-visible block
- reduced-motion: 140ms transition collapses; final bg still lands.
- risk: Keep global :focus-visible gold outline intact alongside bg cue.

### B-F11 DONE-BASELINE

- title: Firefox slider thumb hover/transition parity
- summary: Shipped: ::-moz-range-thumb now has background transition + :hover gold-dim matching webkit thumb.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://web.dev/learn/css/transitions
- baseline: DONE-BASELINE (prior DO; moz thumb rules present)
- fit: Vanilla pseudo-element; 140ms color-only; no transform.
- target: styles.css ::-moz-range-thumb block
- reduced-motion: Duration collapses under kill-switch.
- risk: Do not scale/pop the thumb.

### B-F12 DONE-BASELINE

- title: Forced-colors non-color cue for active timeline week
- summary: Shipped: @media (forced-colors: active) adds CanvasText outline on .week-dot.active + font-weight 700 on aria-current week label (box-shadow/background alone would be neutralized).
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors ; https://developer.mozilla.org/en-US/docs/Web/CSS/system-color
- baseline: DONE-BASELINE (prior DO; media block present ~styles.css:1225)
- fit: Small vanilla media block; never-color-alone doctrine.
- target: styles.css @media (forced-colors: active) block
- reduced-motion: Not motion; do not animate this state.
- risk: Do not fight system palette; keep block scoped to forced-colors.

### B-F15 DONE-BASELINE

- title: :active press on timeline weeks (color only, no lift)
- summary: Shipped: .timeline-week:active gold-soft background mirrors .stat-btn:active; explicit no-transform keeps lifts_policy.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://www.nngroup.com/articles/animation-purpose-ux/
- baseline: DONE-BASELINE (prior DO; :active present, no transform)
- fit: Vanilla one-liner; consistent press confirmation ~100ms band.
- target: styles.css .timeline-week:active
- reduced-motion: 140ms collapses; state remains visible.
- risk: Only .top3-card and .pws-link may translateY(-1px); this must stay color-only.

### B-F17 DONE-BASELINE

- title: Load-sequence budget gate <=800ms
- summary: Shipped as process gate: no new load-time keyframes outside locked inventory (dial-draw brushes budget edge at ~0.82s end).
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html ; https://www.xfive.co/blog/intro-animations-perceived-performance
- baseline: DONE-BASELINE (prior DO; inventory locked, no regression found)
- fit: Acceptance hook; re-check any proposed load animation against <=800ms + one-moment.
- target: styles.css dial-draw / KPI stagger / hero-copy selectors (locked inventory)
- reduced-motion: Budget only matters without RM (kill-switch jumps to final).
- risk: Dial-draw is leave_alone; do not lengthen delays to "soften".

---

## Baseline: prior 10 SKIPs (SKIP-BASELINE - original rationale reused, not relitigated)

### S-F2 SKIP-BASELINE

- title: No will-change sprinkling
- skip-why (original): already correct (absent); premature optimization, layer/memory cost, zero measurable gain on this lightweight page.
- re-check note (axis 8): web.dev + CSSWG still say will-change is a last-resort hint; no new evidence contradicts absence. Verdict unchanged.
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change ; https://drafts.csswg.org/css-will-change-1/ ; https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- baseline: SKIP-BASELINE
- target: styles.css - keep zero will-change
- reduced-motion: N/A (perf hint, not motion).
- risk: Reject `will-change: transform` on all cards (layer explosion).

### S-F4 SKIP-BASELINE

- title: No entrance stagger beyond hero+KPI
- skip-why (original): already done (policy exists); more stagger violates one-moment rule; NN/g scroll/text animation delays frustrate task users.
- sources: https://www.nngroup.com/articles/scroll-animations/ ; https://www.nngroup.com/articles/animation-purpose-ux/
- baseline: SKIP-BASELINE
- target: do not add animation to .section / tables / .career-card / .tier-card
- reduced-motion: Existing rise-in already killed by switch.
- risk: No scroll-in section reveals.

### S-F5 SKIP-BASELINE

- title: No extra view-transition-names beyond week-detail
- skip-why (original): violates one-moment; week-detail covers the one real view swap; duplicate-name risk; theme/steppers should stay instant.
- sources: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using ; https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/user-experience/same-document-transitions/guide.md
- baseline: SKIP-BASELINE
- target: styles.css #timelineDetailContent view-transition-name: week-detail only
- reduced-motion: JS skips VT when reduced; CSS VT animation none.
- risk: Adding names pauses live animations during snapshots.

### S-F7 SKIP-BASELINE

- title: No skipTransition-on-interaction wiring
- skip-why (original): N/A - same-document 180ms VT; skipTransition/pageswap pattern targets cross-document INP; dead weight here.
- sources: https://shopify.dev/docs/storefronts/themes/best-practices/performance/cancel-view-transitions-on-interaction ; https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- baseline: SKIP-BASELINE
- target: app.js startViewTransition feature-detect + reduced check (leave as-is)
- reduced-motion: Already short-circuits VT in JS.
- risk: No global pointerdown listeners "just in case".

### S-F8 SKIP-BASELINE

- title: No CSS scroll-driven animations (animation-timeline)
- skip-why (original): not Baseline; prior no-scroll-scrub digest; NN/g scroll-triggered motion delays content; one-moment violation.
- baseline re-check note (axis 7, 2026-09-22): MDN animation-timeline/scroll()/view() still "Limited availability - not Baseline"; caniuse still partial (Safari 26.x rolling); no authoritative Baseline flip. Original skip rationale unchanged; no re-open.
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline ; https://caniuse.com/mdn-css_properties_animation-timeline_scroll ; https://www.nngroup.com/articles/scroll-animations/
- baseline: SKIP-BASELINE
- target: none - no animation-timeline anywhere
- reduced-motion: Would need no-preference wrapping anyway.
- risk: Reject scroll timelines / IO reveal libraries in review.

### S-F9 SKIP-BASELINE

- title: html smooth scroll + RM auto already correct
- skip-why (original): already done - scroll-behavior smooth + RM override + scroll-padding/margin present.
- sources: https://web.dev/articles/prefers-reduced-motion ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- baseline: SKIP-BASELINE
- target: styles.css html scroll-behavior + RM override
- reduced-motion: Explicit auto override present - required and present.
- risk: Do not remove RM scroll-behavior override.

### S-F13 SKIP-BASELINE

- title: No KPI count-up / number roll
- skip-why (original): violates one-moment at high press frequency; instant textContent is correct; NN/g direct-manipulation feedback <=100ms.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://www.nngroup.com/articles/animation-usability/
- baseline: SKIP-BASELINE
- target: app.js steppers / updateStats - leave synchronous
- reduced-motion: Count-up would need matchMedia per update - another reason to skip.
- risk: Reject rAF tweens on .kpi-number.

### S-F14 SKIP-BASELINE

- title: No Save-Data motion stripping
- skip-why (original): N/A for CSS-only 3-file page; would duplicate reduced-motion machinery.
- sources: https://web.dev/articles/optimizing-content-efficiency-save-data ; https://www.justmarkup.com/articles/2019-02-19-adapting-to-user-preferences/
- baseline: SKIP-BASELINE
- target: none
- reduced-motion: RM kill-switch remains the only motion preference path.
- risk: No navigator.connection branching for this plan.

### S-F16 SKIP-BASELINE

- title: Keep width-based progress transition (no scaleX conversion)
- skip-why (original): intentional measured exception on 3px bar; conversion risk (subpixel AA, transform-origin) > gain.
- sources: https://web.dev/articles/animations-and-performance ; https://web.dev/articles/animations-guide
- baseline: SKIP-BASELINE
- target: styles.css .progress-fill width 0.55s; app.js setProgress style.width
- reduced-motion: 0.55s collapses; aria-valuenow still updates.
- risk: Do not "fix" width per generic articles without profiling.

### S-F18 SKIP-BASELINE

- title: No checklist bounce/pop/scale
- skip-why (original): already correct color-only 140ms micro-feedback; bounce needs 800ms+ (wrong for dense tool); per-check celebration violates one-moment.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://web.dev/articles/the-basics-of-easing
- baseline: SKIP-BASELINE
- target: styles.css .check-custom / checked states - leave
- reduced-motion: 140ms collapses; final checked style static.
- risk: Reject "satisfying check animations" scope creep.

---

## NEW findings (only these carry actionable DO/SKIP)

### N1. Kill-switch must also neutralize animation-delay and transition-delay

- title: RM kill-switch gap - KPI animation-delay still stalls reduced-motion users
- summary: styles.css kill-switch (~2243) sets animation-duration/iteration-count/transition-duration/scroll-behavior/VT-none but does NOT override animation-delay or transition-delay. KPI cells use animation-delay 0.05-0.23s with `both` fill (styles.css ~542-554): under RM, cells stay at rise-in `from` (opacity 0) for up to 230ms before jumping - a residual entrance stall the kill-switch was meant to remove. web.dev canonical RM snippet sets animation-delay/transition-delay to -1ms (or 0) !important alongside durations. This is a real coverage gap on the RM axis, not a relitigation of F9/F17.
- sources:
  - https://web.dev/articles/prefers-reduced-motion
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
  - https://web.dev/learn/css/transitions
- verdict: DO
- baseline: NEW
- fit: Two-line addition inside existing kill-switch media block; pure vanilla CSS; no new selectors, no libraries; completes the stated "covers ALL new motion" contract for delays already in the baseline inventory.
- target: styles.css:2248-2254 (the `*, *::before, *::after` block inside @media (prefers-reduced-motion: reduce)) - add `animation-delay: 0s !important;` and `transition-delay: 0s !important;` (or -1ms to match web.dev)
- reduced-motion: This IS the reduced-motion fix; verify KPI cells render immediately at final opacity under Emulate prefers-reduced-motion.
- risk: Low. Use 0s or -1ms consistently; do not touch VT `animation: none` block; do not remove existing duration overrides. Confirm no transition-delay exists elsewhere that needs the delay=0 behavior (none found in grep - only animation-delays on KPI).

### N2. theme-toggle :active press parity (color only)

- title: Primary nav control lacks :active press feedback (hover exists, press does not)
- summary: .theme-toggle has :hover gold border/color (styles.css ~280) but no :active state; .stat-btn and .timeline-week (F15 baseline) both ship gold-soft :active. UXPin/button-state guidance and NN/g ~100ms direct-manipulation feedback say press confirmation should feel immediate; WCAG C15 pairs hover+focus+active highlighting. Keyboard focus already covered by global :focus-visible ring; gap is pointer/touch press. Color/background only - explicitly NO translateY (lifts_policy: only .top3-card/.pws-link).
- sources:
  - https://www.uxpin.com/studio/blog/button-states
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.w3.org/WAI/WCAG21/Techniques/css/C15
  - https://web.dev/learn/css/transitions
- verdict: DO
- baseline: NEW (not covered by F10 focus parity or F15 timeline-only press)
- fit: One vanilla CSS rule mirroring existing .stat-btn:active pattern; 140ms transition already on the element; no transform, no new token, no JS.
- target: styles.css ~280 area - add `.theme-toggle:active { background: var(--gold-soft); }` (verify contrast in light theme; gold-soft is the established interaction fill used by .stat-btn:active and .timeline-week:active)
- reduced-motion: Existing 140ms border/color/background transition collapses to 0.01ms under kill-switch; pressed state still visible.
- risk: Low. MUST NOT add transform/scale (lifts_policy). Scope: theme-toggle only as the nav's primary button; do not mass-add :active to non-interactive cards (.chain-card/.tier-card etc. are display-only - press state there is noise).

### N3. No scale/press-scale micro-interaction flourishes on buttons or cards

- title: Common "scale(0.97) on active" / "scale(1.05) on hover" micro-interaction recipes are out of bounds here
- summary: 2025-2026 micro-interaction articles push button press scale ~0.97, hover growth, spring toggles, skeleton pulses (Medium/Rune/UXPin roundups). Applying transform scale to stat-btn/theme-toggle/timeline or scale+lift to cards would (a) reintroduce scattered transform hovers beyond the two allowed lifts, (b) add a second motion language beside the single ease token + color-only press doctrine, (c) increase composite churn on 44px controls for zero a11y gain. Color/background press feedback (N2/F15) already satisfies trigger-feedback pairing.
- sources:
  - https://www.uxpin.com/studio/blog/button-states
  - https://www.nngroup.com/articles/animation-purpose-ux/
  - https://web.dev/articles/animations-guide
  - https://www.frontendtools.tech/blog/micro-interactions-ui-ux-guide
- verdict: SKIP
- baseline: NEW
- skip-why: reintroduces scattered hover-lift / transform anti-pattern (lifts_policy violation); violates one-moment (high-frequency press flourishes); color-only doctrine already correct.
- fit: N/A - SKIP.
- target: none - do not add transform: scale to .stat-btn, .theme-toggle, .timeline-week, .check-custom, or any card hover
- reduced-motion: Kill-switch would collapse scale transitions anyway, but the skip is policy, not RM.
- risk: Reject "premium press feel" PRs that add scale(0.97)/translateY to anything except .top3-card/.pws-link.

### N4. No element-scoped VT / view-transition-class / match-element adoption

- title: 2025-26 View Transition API surface growth does not justify expanding beyond week-detail
- summary: Same-document VT is Baseline 2025 newly available; new surface includes Element.startViewTransition (element-scoped, MDN marks Experimental), view-transition-class (Baseline 2025), view-transition-name: match-element, view-transition types/:active-view-transition-type(). Element-scoped VT would let multiple concurrent transitions run but is experimental and adds a second transition architecture; match-element/types/class all encourage naming more elements - directly against F5 SKIP-BASELINE one-name policy. Current single week-detail group with 180ms old/new/group sync (F6) already covers the only real view swap; week clicks are instant-enough for NN/g ~100ms feedback.
- sources:
  - https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/view-transition-class
  - https://developer.chrome.com/blog/view-transitions-in-2025
  - https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- verdict: SKIP
- baseline: NEW
- skip-why: violates one-moment / F5 one-name policy; element-scoped API Experimental; needs no code for current UX; would reintroduce multi-name complexity.
- fit: N/A - SKIP.
- target: none - keep document.startViewTransition(week swap) + week-detail name only
- reduced-motion: Existing app.js reduced check + CSS VT animation:none already correct for any future VT work.
- risk: Do not adopt match-element to "future-proof" - it is an invitation to name every card.

### N5. No hero glow pulse / animated noise / preloader beyond locked load inventory

- title: Load-sequence axis: static hero decoration must stay static
- summary: Hero already has ::before radial gold glow and ::after noise overlay (static) plus dial-draw as the one orchestrated moment. Perceived-performance research (xfive Speed Index tests) shows intro/loading animations measurably worsen Speed Index; NN/g and WCAG pause-stop-hide caution long auto-running motion. Any new hero glow pulse, logo reveal, number ticker on load, or full-page preloader would (a) breach F17 <=800ms budget (dial-draw already ends ~0.82s), (b) fragment the single dial-draw moment, (c) add infinite/repeating motion needing extra RM handling. No new load-time keyframe is justified.
- sources:
  - https://www.xfive.co/blog/intro-animations-perceived-performance
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
  - https://web.dev/articles/animations-and-performance
- verdict: SKIP
- baseline: NEW (extends F17 gate to explicitly named hero decorations - F17 itself remains DONE-BASELINE process gate)
- skip-why: violates one-moment + F17 budget; hurts Speed Index; already correct (static glow is intentional leave-alone).
- fit: N/A - SKIP.
- target: styles.css .hero::before / .hero::after / .hero-dial - leave static; no new load @keyframes
- reduced-motion: Irrelevant to skip; if ever reconsidered, would need no-preference wrap + budget re-prove.
- risk: "Polish" temptation to pulse the glow or animate noise opacity - reject; dial-draw is leave_alone.

---

## Summary table

| ID  | Baseline label | Verdict      | Title                                             |
| --- | -------------- | ------------ | ------------------------------------------------- |
| F1  | DONE-BASELINE  | (shipped DO) | Composite-only entrances                          |
| F2  | SKIP-BASELINE  | (orig skip)  | No will-change sprinkling                         |
| F3  | DONE-BASELINE  | (shipped DO) | Single ease token                                 |
| F4  | SKIP-BASELINE  | (orig skip)  | No stagger beyond hero+KPI                        |
| F5  | SKIP-BASELINE  | (orig skip)  | No extra VT names                                 |
| F6  | DONE-BASELINE  | (shipped DO) | VT group 180ms                                    |
| F7  | SKIP-BASELINE  | (orig skip)  | No skipTransition wiring                          |
| F8  | SKIP-BASELINE  | (orig skip)  | No scroll-driven (re-checked: still not Baseline) |
| F9  | SKIP-BASELINE  | (orig skip)  | Smooth scroll RM already correct                  |
| F10 | DONE-BASELINE  | (shipped DO) | Timeline focus-visible parity                     |
| F11 | DONE-BASELINE  | (shipped DO) | moz thumb hover parity                            |
| F12 | DONE-BASELINE  | (shipped DO) | Forced-colors active week cue                     |
| F13 | SKIP-BASELINE  | (orig skip)  | No KPI count-up                                   |
| F14 | SKIP-BASELINE  | (orig skip)  | No Save-Data strip                                |
| F15 | DONE-BASELINE  | (shipped DO) | Timeline :active press                            |
| F16 | SKIP-BASELINE  | (orig skip)  | Keep width progress                               |
| F17 | DONE-BASELINE  | (shipped DO) | Load budget gate                                  |
| F18 | SKIP-BASELINE  | (orig skip)  | No checklist bounce                               |
| N1  | NEW            | DO           | RM kill-switch delay overrides                    |
| N2  | NEW            | DO           | theme-toggle :active parity                       |
| N3  | NEW            | SKIP         | No scale/press-scale flourishes                   |
| N4  | NEW            | SKIP         | No element-scoped/class VT adoption               |
| N5  | NEW            | SKIP         | No hero glow pulse / preloader                    |

Counts: DONE-BASELINE = 8, SKIP-BASELINE = 10, NEW DO = 2, NEW SKIP = 3. Total entries = 23 (18 baseline + 5 new).

## Contract checks

- Every entry has baseline status + source URL(s) + fit or skip-why + reduced-motion note + target: yes.
- Only NEW findings (N1-N5) carry actionable DO/SKIP: yes; baseline F-items labeled DONE/SKIP-BASELINE without re-litigating SKIP rationale: yes.
- No recommendation requires GSAP, bundler, Tailwind, or React: yes (N1/N2 are pure CSS; N3-N5 are process skips).
- No recommendation reintroduces scattered hover-lift: yes (N2 color-only; N3 explicitly rejects scale/extra lifts; lifts_policy untouched).
- DO list implementable within index.html / styles.css / app.js only: yes (N1, N2 = styles.css only).
- Task read-only: no source files modified (only this findings.md written): confirmed below.
- F8 Baseline re-check performed: MDN still "Limited availability" 2026-09-22; rationale unchanged.

## Top 2 to implement (NEW DOs only)

1. N1 - add animation-delay/transition-delay 0s !important to RM kill-switch (styles.css:2248-2254)
2. N2 - add .theme-toggle:active { background: var(--gold-soft); } (styles.css ~280)
