# Motion Research Findings - plan 20260922-animations-effects-transitions

Task: motion-research (wave 2, read-only). Stack: vanilla zero-build index.html / styles.css / app.js.
Baseline: --ease-out cubic-bezier(0.2,0.8,0.2,1); dial-draw single load moment <=800ms; rise-in KPI stagger; view-transition week-detail 180ms; hover 150-300ms; global prefers-reduced-motion kill-switch (styles.css:2217-2236) + JS mirror (app.js:390-397). Lift policy: only .top3-card and .pws-link keep translateY(-1px).

Note: line anchors target styles.css/app.js (stable during wave 1). index.html anchors re-validate post-remove-dates.

---

## F1. Keep composite-only entrance animations (rise-in + dial-draw)

- title: Composite-only entrance inventory stays the rule for all new motion
- summary: rise-in animates opacity+translateY; dial-draw animates stroke-dashoffset on a dedicated SVG path. Both stay off the layout step for DOM elements. Any NEW load/entrance motion must also use only transform/opacity (SVG stroke-dashoffset OK for draw effects).
- sources:
  - https://web.dev/articles/animations-guide
  - https://web.dev/articles/animations-overview
  - https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- verdict: DO
- fit: Zero-cost guardrail; matches existing keyframes; no libraries. Enforce at implement time when adding any motion.
- target: styles.css:433 (.hero-dial), styles.css:456-467 (.dial-progress + @keyframes dial-draw), styles.css:605-615 (@keyframes rise-in), styles.css:538-555 (.kpi-cell stagger), styles.css:618 (.hero-copy)
- reduced-motion: Covered by global kill-switch (animation-duration 0.01ms jumps to final state). No per-rule change.
- risk: Low. Do not "optimize" dial-draw (leave_alone). Do not animate top/left/margin/height on entrance.

## F2. Do not add will-change to hover/animated elements

- title: will-change discipline - absence is correct; do not sprinkle it
- summary: styles.css currently has zero will-change. MDN/spec call it a last resort: premature use causes layer explosions and memory burn. Correct pattern is only on a handful of always-changing persistent elements, or toggled via JS and removed after change. This page has no continuous animators needing it.
- sources:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change
  - https://drafts.csswg.org/css-will-change-1/
  - https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- verdict: SKIP
- skip-why: already done (correctly absent); adding it would be premature optimization with memory cost and zero measurable gain on this lightweight page.
- fit: N/A - SKIP. Would only add risk.
- target: styles.css (no will-change anywhere - keep it that way)
- reduced-motion: N/A (property is a perf hint, not motion).
- risk: If someone adds `will-change: transform` to all cards, layer count explodes - reject in review.

## F3. Keep the single easing token; no bounce/linear/second curve

- title: Ease-out cubic-bezier(0.2,0.8,0.2,1) validated as the only curve
- summary: web.dev recommends ease-out for UI (fast start = responsive, soft landing); 200-500ms for ease-outs; bounces 800-1200ms only for playful products. Existing --ease-out is a strong ease-out. NN/g: ease-out for entrances, ease-in for exits, duration 100-400ms typical. This token already fits every band in the baseline.
- sources:
  - https://web.dev/articles/the-basics-of-easing
  - https://web.dev/articles/choosing-the-right-easing
  - https://www.nngroup.com/articles/animation-duration/
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/easing-function
- verdict: DO
- fit: Zero-change confirmation: apply var(--ease-out) to any new transition/animation; do not introduce linear, bounce, elastic, or a second token.
- target: styles.css:50 (--ease-out); all transitions currently using var(--ease-out)
- reduced-motion: N/A for the token itself; durations still collapse under kill-switch.
- risk: Low. Review gate: reject any new cubic-bezier that is not (0.2,0.8,0.2,1).

## F4. No entrance stagger on sections/tables beyond hero+KPI

- title: Stagger stays hero+KPI only - no scroll-in section reveals, no table stagger
- summary: Prior digest (2026-09-22) already decided: entrance stagger OK on hero, NOT on data tables. NN/g: scroll-triggered text animations delay users and frustrate task-focused users; play once only, secondary content only. frontend-philosophy: one orchestrated moment. Current stagger ends ~0.78s after load (delays 0.02-0.23s + ~0.55s durations) - that IS the load moment; adding more moments fragments it.
- sources:
  - https://www.nngroup.com/articles/scroll-animations/
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.nngroup.com/articles/animation-purpose-ux/
- verdict: SKIP
- skip-why: already done (policy exists); reintroducing section/table stagger violates one-moment rule and prior digest.
- fit: N/A - SKIP.
- target: styles.css:538-555 (existing KPI stagger - leave); do not add animation to .section / tables / .career-card / .tier-card
- reduced-motion: Existing rise-in already killed by switch; any future entrance would inherit same.
- risk: Implementer must not "delight" Career Targets or ledger tables with rise-in.

## F5. Do not extend view-transitions beyond week-detail

- title: Keep one view-transition-name (week-detail); no theme/KPI/card VTs
- summary: Google same-document VT guidance: do not specify too many transitions; only primary content the user is tracking. Multiple named elements risks duplicate-name errors (only one element per name allowed pre/post). Theme toggle and steppers are direct state flips - instant is correct (NN/g: user-initiated feedback should feel immediate ~100ms).
- sources:
  - https://github.com/GoogleChrome/modern-web-guidance-src/blob/main/guides/user-experience/same-document-transitions/guide.md
  - https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
  - https://www.nngroup.com/articles/animation-duration/
- verdict: SKIP
- skip-why: violates one-moment / already done (week-detail covers the one real view swap).
- fit: N/A - SKIP.
- target: styles.css:2208-2210 (#timelineDetailContent view-transition-name: week-detail) - only this name
- reduced-motion: Existing app.js:390-397 skips VT when reduced; CSS kill-switch sets VT animation none.
- risk: Adding view-transition-name to animated elements pauses their live animations during snapshots - avoid.

## F6. Harden week-detail VT duration via ::view-transition-group

- title: Also set animation-duration on ::view-transition-group(week-detail)
- summary: MDN recommends targeting ::view-transition-group() so group/image-pair inherit duration and stay in sync with old/new; otherwise group keeps UA default (~0.25s) while old/new run 180ms - possible visual mismatch. One-line CSS addition, no JS.
- sources:
  - https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
  - https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
- verdict: DO
- fit: Vanilla CSS only; strengthens existing 180ms week swap; no new named elements; no library.
- target: styles.css:2212-2215 - add selector ::view-transition-group(week-detail) alongside old/new, animation-duration: 180ms
- reduced-motion: Covered by existing ::view-transition-* { animation: none !important } block at styles.css:2231-2235. Keep that block.
- risk: Very low. Confirm @supports not needed (unsupported browsers ignore the whole VT feature; app.js already feature-detects).

## F7. No skipTransition-on-interaction wiring

- title: Cancel-VT-on-pointerdown pattern is for cross-document INP - N/A here
- summary: Shopify guidance blocks input during cross-document VT snapshots and delays INP; remedy is skipTransition on pageswap/pagereveal. This app is same-document, 180ms, feature-detected - interaction is never blocked long enough to matter. Adding listeners is dead weight.
- sources:
  - https://shopify.dev/docs/storefronts/themes/best-practices/performance/cancel-view-transitions-on-interaction
  - https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- verdict: SKIP
- skip-why: N/A (same-document 180ms VT; no MPA pageswap/pagereveal); needs no code.
- fit: N/A - SKIP.
- target: app.js:393-397 (leave feature-detect + reduced check as-is)
- reduced-motion: Already short-circuits VT in JS.
- risk: Do not add global pointerdown listeners "just in case".

## F8. No CSS scroll-driven animations

- title: Skip animation-timeline scroll()/view() - not Baseline + prior no-scroll-scrub + UX risk
- summary: animation-timeline/scroll()/view() is not Baseline (MDN "Limited availability"; Firefox only recently; caniuse shows partial). Design would re-introduce scroll-scrub-adjacent reveals. NN/g: scroll-triggered animations delay content consumption. Prior digest: no scroll-scrub libraries, CSS+small JS only - the CSS-only analog is still scroll-triggered motion soup.
- sources:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline
  - https://caniuse.com/mdn-css_properties_animation-timeline_scroll
  - https://developer.chrome.com/docs/css-ui/scroll-driven-animations
  - https://www.nngroup.com/articles/scroll-animations/
- verdict: SKIP
- skip-why: N/A for this codebase (browser support gaps; violates one-moment; prior digest no scroll-scrub; would delay section content).
- fit: N/A - SKIP.
- target: none - do not add animation-timeline anywhere
- reduced-motion: Would need explicit no-preference wrapping anyway (WebKit guide wraps in prefers-reduced-motion: no-preference).
- risk: Reject any PR adding scroll timelines or IntersectionObserver reveal libraries.

## F9. html smooth scroll + reduced-motion auto: already correct

- title: Smooth anchor scrolling already implemented with kill-switch override
- summary: html { scroll-behavior: smooth; scroll-padding-top: 72px } with @media prefers-reduced-motion forcing scroll-behavior: auto - matches web.dev/MDN guidance exactly. scroll-margin-top: 72px on .section reinforces sticky offset.
- sources:
  - https://web.dev/articles/prefers-reduced-motion
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- verdict: SKIP
- skip-why: already done.
- fit: N/A - SKIP (no change needed).
- target: styles.css:92-95 (html), styles.css:696 (.section scroll-margin-top), styles.css:2219-2221 (RM override)
- reduced-motion: Explicit auto override present - required and present.
- risk: None. Do not remove the RM scroll-behavior override.

## F10. Keyboard focus parity on timeline week buttons

- title: .timeline-week:focus-visible should paint the same gold-soft bg as :hover
- summary: Pointer hover gets background gold-soft (styles.css:1193-1195) but keyboard focus only changes .week-label color (1227-1230) + global outline. WCAG 2.4.7 + UI consistency: focus should look as discoverable as hover. One selector addition, color/background only (compositor-friendly-ish; bg is paint but on 44px button only on focus).
- sources:
  - https://web.dev/articles/animations-guide
  - https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
  - https://web.dev/learn/css/transitions
- verdict: DO
- fit: Vanilla CSS; keyboard timeline buttons already an a11y_bar item; no lift; 140ms transition exists.
- target: styles.css:1193-1195 - extend to `.timeline-week:hover, .timeline-week:focus-visible { background: var(--gold-soft); }` (keep label rule at 1227-1230)
- reduced-motion: transition-duration already forced to 0.01ms by kill-switch; focus state still lands on final bg.
- risk: Low. Keep global :focus-visible outline (styles.css:132-135) intact - do not remove outline to "avoid double ring"; outline+bg together are fine.

## F11. Firefox slider thumb hover/focus parity

- title: ::-moz-range-thumb lacks the hover transition webkit thumb already has
- summary: Webkit thumb transitions background 140ms and has :hover gold-dim; moz thumb has no transition and no :hover. Direct-manipulation control in a dense tool (calc) - NN/g: feedback ~100-150ms feel-immediate. Add matching transition + hover on moz thumb; optional shared focus-visible treatment already covered by global outline on the input.
- sources:
  - https://www.nngroup.com/articles/animation-duration/
  - https://web.dev/learn/css/transitions
  - https://web.dev/articles/animations-guide
- verdict: DO
- fit: Vanilla CSS pseudo-element; 140ms color-only; no transform/lift; sliders stay labeled per a11y_bar.
- target: styles.css:1367-1374 (::-moz-range-thumb) - add `transition: background 140ms var(--ease-out);` + `::-moz-range-thumb:hover { background: var(--gold-dim); }` to mirror styles.css:1354-1359
- reduced-motion: 140ms collapses to 0.01ms under kill-switch; color lands final.
- risk: Very low. Do not scale/pop the thumb (micro-anim soup; would need RM design).

## F12. Forced-colors: non-color cue for active timeline week

- title: Active week indicator relies on box-shadow + gold, both neutralized in forced-colors
- summary: .week-dot.active uses box-shadow ring (styles.css:1217) - forced-colors forces box-shadow:none - and border/background colors are overridden by system colors, so active vs completed vs idle can collapse to color-alone (violates never-color-alone + MDN forced-colors guidance). Add a structural cue (e.g. outline/outline-offset or increased border-width + font-weight on label) under @media (forced-colors: active).
- sources:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
  - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color
  - https://firefox-source-docs.mozilla.org/accessible/HCMMediaQueries.html
- verdict: DO
- fit: Small vanilla media block; a11y_bar "never color-alone coding" is explicit in context_envelope; not motion per se but in-axis (forced-colors axis of the research contract).
- target: styles.css:1214-1218 (.week-dot.active) + optionally .timeline-week aria-current state - add `@media (forced-colors: active)` rule using outline or border-width change; verify Week label weight
- reduced-motion: N/A (not animation); do not animate this state change.
- risk: Low-medium: must not fight system palette; use outline (outline-color not fully author-forced the same way - verify) or border-width; keep 44px targets; re-check AA in default themes unaffected (rule scoped to forced-colors only).

## F13. No count-up / number roll on KPI steppers

- title: Instant text updates on +/- steppers are correct; skip count-up tweens
- summary: stat-btn click updates textContent synchronously (app.js:177-191). NN/g: direct manipulation feedback <=100ms should feel physical, not narrated; count-up would delay readable value and add a second animated moment on every press (high frequency). dense-tool micro-motion budget is for affordances, not re-rendering numbers.
- sources:
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.nngroup.com/articles/animation-usability/
  - https://www.nngroup.com/articles/animation-purpose-ux/
- verdict: SKIP
- skip-why: violates one-moment (repeated press animation soup); already done (instant is the right behavior); frequency concern from NN/g.
- fit: N/A - SKIP.
- target: app.js:156-172 updateStats / app.js:177-191 steppers - leave synchronous
- reduced-motion: Would require matchMedia branch per update if implemented - another reason to skip.
- risk: Implementer temptation during "polish" - reject count-up/rAF tweens on .kpi-number.

## F14. No Save-Data motion stripping

- title: Save-Data handling is unnecessary for a CSS-only 3-file page
- summary: Save-Data guidance targets heavy assets (images, fonts, A/B payloads). This page: no frameworks, no image payloads beyond favicon/manifest, styles.css ~2236 lines - stripping motion would not save meaningful bytes and adds navigator.connection JS branching that must mirror RM.
- sources:
  - https://web.dev/articles/optimizing-content-efficiency-save-data
  - https://www.justmarkup.com/articles/2019-02-19-adapting-to-user-preferences/
- verdict: SKIP
- skip-why: N/A (no heavy assets; motion CSS is negligible); would duplicate reduced-motion machinery.
- fit: N/A - SKIP.
- target: none
- reduced-motion: Existing RM kill-switch remains the only required motion preference path.
- risk: Do not add save-data class toggling on <html> for this plan.

## F15. Press feedback pattern: add :active to timeline weeks (no lift)

- title: Extend stat-btn :active gold-soft press state to .timeline-week - color only
- summary: .stat-btn has :active { background: var(--gold-soft) } (styles.css:689-691); .timeline-week has hover but no :active. Press state = direct manipulation confirmation (NN/g ~100ms). Color/background only - does NOT add translateY - stays inside lifts_policy.
- sources:
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.nngroup.com/articles/animation-purpose-ux/
  - https://web.dev/articles/animations-guide
- verdict: DO
- fit: Vanilla one-liner; consistent with existing .stat-btn pattern; explicit no-transform.
- target: styles.css:1193-1195 area - add `.timeline-week:active { background: var(--gold-soft); }` (or surface-3 if gold-soft too weak in light theme - verify contrast)
- reduced-motion: 140ms transition collapses under kill-switch; state remains visible.
- risk: Low. MUST NOT add transform - only .top3-card/.pws-link may lift. Gold-usage doctrine: gold-soft bg on interaction is already used elsewhere (stat-btn:active) - consistent.

## F16. Keep width-based progress transition (do not convert to scaleX)

- title: .progress-fill width 0.55s stays - layout animation exception already accepted
- summary: Animating width triggers layout, which web.dev says to avoid; however this is a 3px full-width bar, paint cost trivial, and width keeps simple overflow/rounding semantics. Converting to transform: scaleX needs transform-origin, risks subpixel AA on gold fill, gains nothing measurable. Existing transition 0.55s var(--ease-out) at styles.css:633.
- sources:
  - https://web.dev/articles/animations-and-performance
  - https://web.dev/articles/animations-guide
- verdict: SKIP
- skip-why: already done (intentional, measured exception); conversion risk > gain on 3px bar.
- fit: N/A - SKIP.
- target: styles.css:629-634 (.progress-fill) - leave; also setProgress writes style.width (app.js:150-154)
- reduced-motion: 0.55s collapses to 0.01ms; aria-valuenow still updates.
- risk: Do not "fix" width per generic perf articles without profiling this page.

## F17. Load budget gate: any new entrance must end <=800ms

- title: Enforce <=800ms total load choreography - no new load-time keyframes
- summary: Baseline budget 800ms (context_envelope). Current critical path: dial-draw 0.12s delay + 0.7s = 0.82s end; KPI delays up to 0.23s + 0.45s = 0.68s; hero-copy 0.02+0.5 = 0.52s. Dial draw already brushes the budget edge - adding ANY new load animation (preloader bits, hero glow pulse, logo reveal) breaches one-moment + budget. Implement gate: no new animation/transition triggered on page load outside existing selectors.
- sources:
  - https://www.nngroup.com/articles/animation-duration/
  - https://web.dev/articles/animations-and-performance
  - https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
- verdict: DO
- fit: Process guardrail + acceptance hook; no code unless a regression is found. Prior digest already: no full-page preloader.
- target: styles.css:433,456,538-555,618 (existing load animations - inventory locked); motion-implement acceptance re-checks <=800ms
- reduced-motion: Load sequence jumps to final state - budget is a no-RM concern only.
- risk: Do not lengthen dial-draw or add delays to "soften" it; dial-draw is leave_alone.

## F18. Checklist micro-feedback: keep color-only 140ms - no scale/pop/bounce

- title: Check toggle already has correct dense-tool micro-motion; skip flourish animations
- summary: .check-custom transitions background/border-color 140ms; checkmark ::after appears; .check-text color 140ms + line-through. That matches NN/g simple feedback (~100-150ms) and frontend-philosophy restraint. Adding spring scale on ::after or confetti on checklist-complete reintroduces micro-anim soup and a new high-frequency animated moment.
- sources:
  - https://www.nngroup.com/articles/animation-duration/
  - https://www.nngroup.com/articles/animation-purpose-ux/
  - https://web.dev/articles/the-basics-of-easing
- verdict: SKIP
- skip-why: already done (correct level); violates one-moment if celebrated per-check; bounce needs long durations (800ms+) per web.dev - wrong for dense tool.
- fit: N/A - SKIP.
- target: styles.css:1471-1473, 1478-1509 (.check-custom / checked states) - leave
- reduced-motion: 140ms collapses; final checked style is static and legible.
- risk: Reject "satisfying check animations" scope creep.

---

## Summary table

| ID | Verdict | Title |
|----|---------|-------|
| F1 | DO | Composite-only entrance inventory stays the rule |
| F2 | SKIP | No will-change sprinkling |
| F3 | DO | Single ease token validated; no second curve |
| F4 | SKIP | No stagger beyond hero+KPI |
| F5 | SKIP | No extra view-transition-names |
| F6 | DO | ::view-transition-group(week-detail) 180ms |
| F7 | SKIP | No skipTransition wiring (N/A same-doc) |
| F8 | SKIP | No scroll-driven animations |
| F9 | SKIP | Smooth scroll + RM already done |
| F10 | DO | Timeline :focus-visible bg parity |
| F11 | DO | moz slider thumb hover parity |
| F12 | DO | Forced-colors active week non-color cue |
| F13 | SKIP | No KPI count-up |
| F14 | SKIP | No Save-Data motion strip |
| F15 | DO | :active press on timeline (no lift) |
| F16 | SKIP | Keep width progress transition |
| F17 | DO | Load budget <=800ms gate |
| F18 | SKIP | No checklist bounce/pop |

Counts: DO = 8, SKIP = 10, total = 18.

## Contract checks

- Every finding has DO/SKIP + fit rationale + reduced-motion note + source URL(s): yes.
- No GSAP / bundler / Tailwind / React recommendation: yes (all findings CSS+small JS or process gates).
- No scattered hover-lift reintroduction: yes (F15 explicitly color-only; F2/F13/F18 reject transform flourishes; lifts_policy untouched).
- All DOs implementable within index.html / styles.css / app.js: yes (F6, F10, F11, F12, F15 are styles.css edits; F1/F3/F17 are enforce-at-implement gates; F12 may add markup attributes only if aria-current already present - prefer pure CSS).

## Top 3 to implement now

1. F6 - ::view-transition-group(week-detail) duration sync (styles.css:2212)
2. F10 - .timeline-week:focus-visible background parity (styles.css:1193)
3. F12 - forced-colors active/complete week non-color cue (styles.css:1214)
