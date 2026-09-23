# UI/UX Research Findings - plan 20260923-ui-ux-best-practices

Task: ui-ux-research (read-only). Stack: vanilla zero-build index.html / styles.css / app.js.
Baselines: docs/plan/20260922-animations-effects-transitions/findings.md (F1-F18; 8 DO shipped 4874c9c) + docs/plan/20260922-animations-effects-best-practices/findings.md (N1-N5; 2 NEW DO shipped 91cfca2).
Labeling: prior shipped DOs = DONE-BASELINE (anchors re-verified in THIS working tree); prior SKIPs = SKIP-BASELINE (original rationale reused). Only NEW findings carry U-IDs + actionable DO/SKIP.
Baseline re-check (axis: motion intersection): MDN animation-timeline / scroll() still "Limited availability - not Baseline" (2026-09); web-platform-dx still blocked by Firefox. F8 SKIP-BASELINE unchanged - no motion skip re-opened.

---

## Baseline restated (F1-F18 / N1-N5 - not renumbered, not re-litigated)

### F1 DONE-BASELINE

- title: Composite-only entrance inventory (rise-in + dial-draw)
- summary: Entrances animate opacity/transform (+ SVG stroke-dashoffset for dial only); no layout props on DOM entrances.
- sources: https://web.dev/articles/animations-guide ; https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count
- baseline: DONE-BASELINE (prior DO)
- fit: Zero-cost guardrail; vanilla keyframes already match.
- target: styles.css:609-619 (@keyframes rise-in), styles.css:460-471 (.dial-progress + dial-draw), styles.css:542-559 (.kpi-cell + delays), styles.css:621-623 (.hero-copy)
- reduced-motion: kill-switch collapses animation-duration -> final state.
- risk: Do not animate layout props on new entrances; leave dial-draw alone.

### F2 SKIP-BASELINE

- title: No will-change sprinkling
- skip-why (original): already correct (absent); premature optimization, layer/memory cost, zero measurable gain on this lightweight page.
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/will-change ; https://drafts.csswg.org/css-will-change-1/
- baseline: SKIP-BASELINE
- target: styles.css - keep zero will-change (re-verified: absent in working tree).
- reduced-motion: N/A (perf hint).
- risk: Reject `will-change: transform` on cards.

### F3 DONE-BASELINE

- title: Single ease token cubic-bezier(0.2,0.8,0.2,1)
- summary: Sole --ease-out; no second curve.
- sources: https://web.dev/articles/the-basics-of-easing ; https://www.nngroup.com/articles/animation-duration/
- baseline: DONE-BASELINE (prior DO)
- fit: Apply var(--ease-out) to any new transition.
- target: styles.css:50 (--ease-out)
- reduced-motion: Durations collapse under kill-switch.
- risk: Reject any new cubic-bezier.

### F4 SKIP-BASELINE

- title: No entrance stagger beyond hero+KPI
- skip-why (original): one-moment policy; NN/g scroll/text animation delays frustrate task users; already done.
- sources: https://www.nngroup.com/articles/scroll-animations/ ; https://www.nngroup.com/articles/animation-purpose-ux/
- baseline: SKIP-BASELINE
- target: styles.css:542-559 (existing KPI stagger only); no animation on .section/tables/cards.
- reduced-motion: rise-in killed by switch.
- risk: No scroll-in reveals.

### F5 SKIP-BASELINE

- title: No extra view-transition-names beyond week-detail
- skip-why (original): one-name policy; duplicate-name risk; theme/steppers stay instant.
- sources: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- baseline: SKIP-BASELINE
- target: styles.css:2233-2235 (#timelineDetailContent week-detail only).
- reduced-motion: app.js:390-397 skips VT when reduced; CSS VT none.
- risk: Do not name more elements.

### F6 DONE-BASELINE

- title: ::view-transition-group(week-detail) 180ms sync
- summary: Group duration synced with old/new (MDN).
- sources: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using
- baseline: DONE-BASELINE (prior DO)
- fit: Vanilla one-liner already present.
- target: styles.css:2242-2244 (::view-transition-group(week-detail) animation-duration: 180ms)
- reduced-motion: ::view-transition-* animation:none in kill-switch (styles.css:2262-2266).
- risk: Keep as-is.

### F7 SKIP-BASELINE

- title: No skipTransition-on-interaction wiring
- skip-why (original): N/A - same-document 180ms VT; cross-document pattern is dead weight here.
- sources: https://shopify.dev/docs/storefronts/themes/best-practices/performance/cancel-view-transitions-on-interaction
- baseline: SKIP-BASELINE
- target: app.js:390-397 (feature-detect + reduced check - leave).
- reduced-motion: JS short-circuits VT.
- risk: No global pointerdown listeners.

### F8 SKIP-BASELINE

- title: No CSS scroll-driven animations (animation-timeline)
- skip-why (original): not Baseline; prior no-scroll-scrub digest; NN/g scroll-triggered motion delays content; one-moment violation.
- baseline re-check (this plan, 2026-09-23): MDN still "Limited availability - not Baseline"; web-platform-dx explorer: Firefox still unsupported, Baseline blocked; caniuse still partial. Rationale unchanged; no re-open.
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timeline ; https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/ ; https://www.nngroup.com/articles/scroll-animations/
- baseline: SKIP-BASELINE
- target: none - no animation-timeline anywhere.
- reduced-motion: Would need no-preference wrap anyway.
- risk: Reject scroll timelines / IO reveal libraries.

### F9 SKIP-BASELINE

- title: html smooth scroll + RM auto already correct
- skip-why (original): scroll-behavior smooth + RM override + scroll-padding/margin present.
- sources: https://web.dev/articles/prefers-reduced-motion ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- baseline: SKIP-BASELINE
- target: styles.css:92-95 (html smooth + scroll-padding-top 72px), styles.css:700 (.section scroll-margin-top), styles.css:2248-2250 (RM auto).
- reduced-motion: Explicit auto override present.
- risk: Do not remove RM scroll override.

### F10 DONE-BASELINE

- title: Timeline :focus-visible background parity with hover
- summary: .timeline-week:focus-visible paints gold-soft same as hover.
- sources: https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
- baseline: DONE-BASELINE (prior DO)
- fit: Vanilla CSS; keyboard timeline discoverability.
- target: styles.css:1197-1200 (.timeline-week:hover, .timeline-week:focus-visible background gold-soft)
- reduced-motion: 140ms collapses; final bg lands.
- risk: Keep global outline styles.css:132-135 intact.

### F11 DONE-BASELINE

- title: Firefox slider thumb hover/transition parity
- summary: ::-moz-range-thumb transition + :hover gold-dim matches webkit.
- sources: https://www.nngroup.com/articles/animation-duration/
- baseline: DONE-BASELINE (prior DO)
- fit: Vanilla pseudo-element; color-only 140ms.
- target: styles.css:1387-1399 (::-moz-range-thumb transition + :hover)
- reduced-motion: Duration collapses.
- risk: Do not scale/pop thumb.

### F12 DONE-BASELINE

- title: Forced-colors non-color cue for active timeline week
- summary: forced-colors outline on week-dot.active + aria-current label weight.
- sources: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
- baseline: DONE-BASELINE (prior DO)
- fit: Vanilla media block; never-color-alone.
- target: styles.css:1229-1238 (@media (forced-colors: active))
- reduced-motion: Not motion.
- risk: Keep scoped to forced-colors only.

### F13 SKIP-BASELINE

- title: No KPI count-up / number roll
- skip-why (original): violates one-moment at high press frequency; instant textContent correct (NN/g ~100ms).
- sources: https://www.nngroup.com/articles/animation-duration/
- baseline: SKIP-BASELINE
- target: app.js:177-191 (steppers) / app.js:156-172 (updateStats) - leave synchronous.
- reduced-motion: Count-up would need matchMedia per update.
- risk: Reject rAF tweens on .kpi-number.

### F14 SKIP-BASELINE

- title: No Save-Data motion stripping
- skip-why (original): N/A for 3-file CSS page; would duplicate RM machinery.
- sources: https://web.dev/articles/optimizing-content-efficiency-save-data
- baseline: SKIP-BASELINE
- target: none.
- reduced-motion: RM kill-switch remains only motion preference path.
- risk: No navigator.connection branching.

### F15 DONE-BASELINE

- title: :active press on timeline weeks (color only)
- summary: gold-soft press mirrors .stat-btn:active; no transform.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://www.w3.org/WAI/WCAG21/Techniques/css/C15
- baseline: DONE-BASELINE (prior DO)
- fit: Vanilla; direct-manipulation feedback ~100ms.
- target: styles.css:1202-1204 (.timeline-week:active background gold-soft)
- reduced-motion: 140ms collapses.
- risk: Lifts policy: only .top3-card/.pws-link may translateY.

### F16 SKIP-BASELINE

- title: Keep width-based progress transition (no scaleX)
- skip-why (original): intentional measured exception on 3px bar; conversion risk > gain.
- sources: https://web.dev/articles/animations-and-performance
- baseline: SKIP-BASELINE
- target: styles.css:633-637 (.progress-fill width 0.55s); app.js:150-154 (style.width).
- reduced-motion: 0.55s collapses; aria-valuenow still updates.
- risk: Do not "fix" width without profiling.

### F17 DONE-BASELINE

- title: Load-sequence budget gate <=800ms
- summary: Process gate: no new load-time keyframes outside locked inventory.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
- baseline: DONE-BASELINE (prior DO; inventory re-verified, no regression)
- fit: Acceptance hook at implement time.
- target: styles.css:437 (.hero-dial), styles.css:460 (dial-draw 0.1s+0.7s), styles.css:542-559 (KPI delays), styles.css:622 (hero-copy) - locked.
- reduced-motion: Budget only matters without RM.
- risk: Dial-draw leave_alone; no new load @keyframes.

### F18 SKIP-BASELINE

- title: No checklist bounce/pop/scale
- skip-why (original): color-only 140ms micro-feedback already correct; bounce needs 800ms+; per-check celebration violates one-moment.
- sources: https://www.nngroup.com/articles/animation-duration/ ; https://web.dev/articles/the-basics-of-easing
- baseline: SKIP-BASELINE
- target: styles.css:1488-1534 (.check-custom / checked states) - leave.
- reduced-motion: 140ms collapses; final checked style static.
- risk: Reject satisfying-check animation scope creep.

### N1 DONE-BASELINE

- title: RM kill-switch neutralizes animation-delay + transition-delay
- summary: Shipped: delay overrides added inside prefers-reduced-motion block (prior NEW DO, 91cfca2).
- sources: https://web.dev/articles/prefers-reduced-motion ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- baseline: DONE-BASELINE (prior NEW DO; re-verified)
- fit: Two !important lines in existing media block.
- target: styles.css:2256 (animation-delay: 0s !important), styles.css:2259 (transition-delay: 0s !important)
- reduced-motion: This IS the RM fix; KPI cells land immediately.
- risk: Do not remove duration overrides or VT block.

### N2 DONE-BASELINE

- title: theme-toggle :active press parity (color only)
- summary: Shipped: .theme-toggle:active gold-soft mirrors stat-btn/timeline press (prior NEW DO, 91cfca2).
- sources: https://www.uxpin.com/studio/blog/button-states ; https://www.w3.org/WAI/WCAG21/Techniques/css/C15
- baseline: DONE-BASELINE (prior NEW DO; re-verified)
- fit: One vanilla CSS rule; no transform.
- target: styles.css:285-287 (.theme-toggle:active background gold-soft)
- reduced-motion: 140ms border/color/bg transition collapses.
- risk: No scale/translateY (lifts policy).

### N3 SKIP-BASELINE

- title: No scale/press-scale micro-interaction flourishes
- skip-why (original): reintroduces scattered transform anti-pattern; violates one-moment; color-only doctrine already correct.
- sources: https://www.nngroup.com/articles/animation-purpose-ux/ ; https://web.dev/articles/animations-guide
- baseline: SKIP-BASELINE
- target: none - no transform: scale on buttons/cards.
- reduced-motion: Skip is policy, not RM.
- risk: Reject scale(0.97) press recipes.

### N4 SKIP-BASELINE

- title: No element-scoped VT / view-transition-class / match-element adoption
- skip-why (original): violates F5 one-name policy; element-scoped API Experimental; multi-name complexity unjustified.
- sources: https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition ; https://developer.chrome.com/blog/view-transitions-in-2025
- baseline: SKIP-BASELINE
- target: none - document.startViewTransition + week-detail only.
- reduced-motion: Existing app.js + CSS VT guards correct.
- risk: Do not adopt match-element to "future-proof".

### N5 SKIP-BASELINE

- title: No hero glow pulse / animated noise / preloader beyond locked load inventory
- skip-why (original): violates one-moment + F17 budget; hurts Speed Index; static glow intentional.
- sources: https://www.xfive.co/blog/intro-animations-perceived-performance ; https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html
- baseline: SKIP-BASELINE
- target: styles.css:309-332 (.hero::before/::after static), styles.css:434-471 (dial leave_alone).
- reduced-motion: Irrelevant to skip.
- risk: Reject glow pulse / preloader polish.

---

## NEW findings (only these carry actionable DO/SKIP)

### U1. Add role=status to discrete dynamic status text (WCAG 4.1.3)

- title: Checklist/PWS/KPI status updates lack programmatic status role (Nielsen #1 + WCAG AA 4.1.3)
- summary: #checklistLabel, #pwsLabel, and .kpi-number values update after clicks without moving focus and without role/aria-live. Visually the user sees "3/8 completed" or the new count; assistive tech hears nothing (F103 failure pattern). progressbar aria-valuenow exists but ARIA25 treats live-region announcement as the sufficient technique for progress status. Discrete click targets only - avoid putting role=status on #calcTotal alone as the primary fix because slider input fires continuously (W3C chattiness advisory); calcTotal may be a follow-up if SR testing shows need.
- sources:
  - https://www.w3.org/WAI/WCAG22/Understanding/status-messages
  - https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA22
  - https://www.w3.org/WAI/WCAG22/Techniques/failures/F103
  - https://www.nngroup.com/articles/ten-usability-heuristics/
- verdict: DO
- baseline: NEW
- fit: HTML-only attributes on elements that already exist at first paint (role set before JS updates - satisfies ARIA22 step 1). No app.js edit (app.js stays frozen). No library. aria-atomic="true" per ARIA22 note so full "3/8 completed" string announces.
- target: index.html:1280 (#checklistLabel - add role="status" aria-atomic="true"); index.html:1740 (#pwsLabel - same); index.html:152,193,234,255 (.kpi-number spans - same). Optional follow-up (not required for this DO): index.html:1177 (#calcTotal) only after chattiness review during slider drag.
- reduced-motion: No motion; RM kill-switch unaffected. No collision with F17/N1.
- risk: Low. Do not use role="alert"/assertive (announces interruptively; F103 advisory warns against assertive for non-urgent). Do not add JS listeners. Confirm SR: press +/- once, expect polite announcement of new value.

### U2. Cap full-width prose at ~70ch measure (line length)

- title: Long measure on section-desc / timeline detail / PortSwigger prose hurts scanability
- summary: .section-desc max-width is 52em (~780px at 15px body => ~95-110 characters, over the 80-char WCAG 1.4.8 aspirational cap and above Baymard 50-75 optimal). .timeline-detail p and .pws-info p have no max-width and stretch to full container (~1152-1168px content width => ~130-160 characters) - clear long-line re-entry risk. No copy rewrite: CSS-only measure constraint. ch preferred over px/em so the cap tracks font-size/zoom (web.dev sizing).
- sources:
  - https://baymard.com/blog/line-length-readability
  - https://web.dev/learn/css/sizing
  - https://www.w3.org/TR/WCAG22/#visual-presentation (SC 1.4.8, AAA reference for 80-char)
  - https://css-tricks.com/setting-line-length-in-css-and-fitting-text-to-a-container/
- verdict: DO
- baseline: NEW (prior plans did not address measure; hero-subtitle 36em and card-scoped prose already fine)
- fit: Vanilla CSS max-width only; does not alter brand colors/type sizes/copy; works at all breakpoints (max-width no-ops when viewport narrower than 70ch).
- target: styles.css:719-723 (.section-desc - change max-width: 52em to max-width: 70ch); styles.css:1266-1269 (.timeline-detail p - add max-width: 70ch); styles.css:1952-1961 (.pws-info p - add max-width: 70ch)
- reduced-motion: No motion. No RM/collision issue.
- risk: Low. Do not apply max-width to layout wrappers/cards that must stay full-bleed (UI/UX Atlas measure caution). Visually verify timeline detail and PWS paragraphs at 1200px; keep hero-subtitle 36em as-is. Not a copy change.

### U3. Fix week-split heading skip h2 -> h4

- title: Setup section jumps h2 to h4 (Week boxes) - heading outline skips h3
- summary: Section heading is h2 (Immediate Setup Checklist) and week-split boxes use h4 (Week 1 / Week 2 / End of Week 2) with no intervening h3 - WAI headings guidance says avoid skipping ranks; WebAIM treats skipped levels as illogical structure that confuses SR heading navigation. Every other h4 in the document sits under an h3 (chains-title, subsection-block). HTML tag + CSS selector only - not a copy rewrite, not a visual redesign (selectors keep identical font rules).
- sources:
  - https://www.w3.org/WAI/tutorials/page-structure/headings/
  - https://webaim.org/techniques/headings/
  - https://www.w3.org/WAI/WCAG22/Techniques/html/H69
- verdict: DO
- baseline: NEW (not covered by prior motion plans)
- fit: Two-file vanilla fix: promote tags to h3, rename matching selectors. No JS (app.js already emits h3 for week detail under section h2 - consistent after fix). No framework.
- target: index.html:1284, index.html:1291, index.html:1298 (h4 -> h3); styles.css:1572 (.week-box h4 -> .week-box h3), styles.css:1591 (.week-box-target h4 -> .week-box-target h3)
- reduced-motion: No motion.
- risk: Low. Grep for any other h2->h4 skip after edit (none found in final tree audit). Do not change visible text. Do not restyle beyond selector rename.

### U4. Raise skip-link hit height to 44px min

- title: Skip link focused height ~37px misses project 44px target doctrine
- summary: .skip-link is padding 8px 12px with ~14px type => roughly 36-38px tall when focused - passes WCAG 2.5.8 AA (24px) but below the project a11y_bar 44px minimum and below SC 2.5.5 AAA / Apple HIG 44pt guidance used as this repo's mobile-first bar. It is a real pointer-clickable control when visible. One CSS box-sizing change; gold focus appearance unchanged.
- sources:
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
  - https://www.smashingmagazine.com/2024/07/getting-bottom-minimum-wcag-conformant-interactive-element-size/
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced
- verdict: DO
- baseline: NEW (nav/theme/stat/timeline/calc/checklist/pws already >=44 - re-verified)
- fit: Vanilla CSS min-height + inline-flex on existing .skip-link; no markup change; transition already color/position only.
- target: styles.css:138-155 (.skip-link - add min-height: 44px; display: inline-flex; align-items: center; keep existing :focus top reveal at styles.css:153-155)
- reduced-motion: existing `transition: top 140ms var(--ease-out)` collapses under kill-switch (styles.css:150, 2258); final position unchanged. No collision with F17 (not a load animation).
- risk: Very low. Do not change colors (gold on gold-ink). Do not remove :focus (not :focus-visible - correct for skip links).

### U5. No size change for .calc-check (20px) or slider thumbs - label/input already the target

- title: WCAG 2.5.8 already met for calc checkbox + slider via label-as-single-target / full input box
- summary: .calc-check is author-sized 20x20 (styles.css:1334-1340) which would normally risk SC 2.5.8, but it sits inside associated .calc-label (min-height 44px, full row width styles.css:1320-1327); testing guidance treats controls inside their label as one target - effective target >=44. Slider is native range with input height 44px (styles.css:1348-1356) - track+thumb share the 44px box; thumb 20px is visual only. .check-custom is 24px inside 48px .check-label (styles.css:1471-1490). Enlarging painted checkbox/thumb would add density churn for zero conformance gain.
- sources:
  - https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
  - https://vispero.com/resources/how-to-test-2-5-8-target-size-minimum/
  - https://www.smashingmagazine.com/2024/07/getting-bottom-minimum-wcag-conformant-interactive-element-size/
- verdict: SKIP
- baseline: NEW
- skip-why: already correct (2.5.8 satisfied via label/single-input target treatment; effective pointers targets >=44 via labels/rows); change would be cosmetic density risk.
- fit: N/A - SKIP. No code.
- target: none - leave styles.css:1334-1340 (.calc-check 20px), styles.css:1364-1399 (thumbs), styles.css:1488-1490 (.check-custom 24px)
- reduced-motion: N/A.
- risk: If a future audit measures the checkbox in isolation ignoring the label, re-open only after confirming label activation still counts as the target.

### U6. Keep display-only card hover emphasis (default cursor - not a false click affordance)

- title: Hover gold border on non-interactive cards is emphasis, not click bait - do not strip
- summary: .chain-card/.tier-card/.activity-card/.career-card/.artifact-card/.platform-card/.loop-step change border/background on :hover but none set cursor:pointer and none are links/buttons - default arrow cursor correctly signals non-interactive. Removing hovers would scrub established surface/emphasis language (color doctrine + prior UI polish); adding pointer would create the actual false affordance. Nielsen affordance issue only fires when cursor implies activation.
- sources:
  - https://www.nngroup.com/articles/ten-usability-heuristics/
  - https://www.nngroup.com/articles/visual-hierarchy-ux-definition/
- verdict: SKIP
- baseline: NEW
- skip-why: already correct (no pointer cursor; hover is non-interactive emphasis); removal edges into brand/visual redesign (out of scope).
- fit: N/A - SKIP.
- target: none - leave styles.css:825-828, 941-945, 1019-1021, 1615-1618, 1780-1782, 2060-2063 hovers; do not add cursor:pointer to cards.
- reduced-motion: N/A (hover is not new motion; 140ms border/bg already in baseline).
- risk: Reject both directions: cursor:pointer on cards OR mass hover removal PRs.

### U7. No contrast-pair rework - spot audit passes AA under shipped guardrails

- title: Core text/surface/gold/income pairs already meet WCAG 2.2 AA contrast
- summary: Dark text-3 (#939bab) on surface-1 (#12141b) ~6.6:1; gold (#f5b942) on surface-1 ~10:1; light text/gold/income pairs (#854d0e, #047857, #4b5563 on white) >=4.5:1. Palette doctrine already encodes ship gate 4.5:1 body / 3:1 UI (styles.css:5-21 CP-1..CP-12 from prior color research). No NEW pair violates AA in this audit; full APCA/re-pair pass is color-plan territory + brand identity leave-alone.
- sources:
  - https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum
  - https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced
- verdict: SKIP
- baseline: NEW
- skip-why: already correct (spot-checked pairs pass AA; guardrails document the ship gate); brand redesign/color-scheme logic out of scope.
- fit: N/A - SKIP.
- target: none - leave styles.css:23-81 tokens; do not introduce new semantic colors here.
- reduced-motion: N/A.
- risk: If a future light-theme change alters --text-3/--gold, re-run contrast before merge.

### U8. Focus order already correct - no roving tabindex / focus trap work

- title: DOM order matches visual order; skip link first; timeline restores focus after rebuild
- summary: skip-link is first body control (index.html:43); header -> main -> footer order matches visuals; renderTimeline deliberately restores focus to active week after innerHTML rebuild (app.js:331-366) - an uncommonly good focus-management practice; global :focus-visible ring styles.css:132-135; scroll-padding-top 72px >= sticky nav 56px satisfies SC 2.4.11 Focus Not Obscured AA (C43). No keyboard trap found (native buttons/checkboxes/ranges only). Nothing to add without JS freeze exception.
- sources:
  - https://www.w3.org/WAI/WCAG22/Understanding/focus-order
  - https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum
  - https://www.w3.org/WAI/WCAG22/Techniques/css/C43
- verdict: SKIP
- baseline: NEW
- skip-why: already correct (order, skip link, focus restore, scroll-padding in place); any "focus management improvement" would need app.js changes = freeze exception without cause.
- fit: N/A - SKIP.
- target: none - preserve app.js:331-366 restoreFocus; styles.css:94 scroll-padding-top: 72px; index.html:43 skip-link.
- reduced-motion: focus restore does not animate.
- risk: Do not "optimize" renderTimeline focus logic; do not lower scroll-padding below nav height 56px.

### U9. No arrow-key/roving-tabindex pattern on timeline weeks

- title: Timeline buttons stay plain tab stops - APG tablist arrows not required here
- summary: 13 native buttons in a horizontal scroller (app.js:338-359) each receive Tab - verbose but predictable and matches button semantics. Roving tabindex + arrow keys is an APG composite-widget pattern for tablists/toolbars, not a WCAG AA failure for a row of buttons. Implementing it needs JS focus wiring inside frozen app.js for marginal gain; restoreFocus (U8) already fixes post-render focus loss.
- sources:
  - https://www.w3.org/WAI/ARIA/apg/patterns/keyboard-interface/
  - https://www.w3.org/WAI/WCAG22/Understanding/keyboard
- verdict: SKIP
- baseline: NEW
- skip-why: already correct for plain buttons (WCAG 2.1.1 met); arrow-key roving needs JS freeze exception; dense 13-stop tab path is acceptable for this control.
- fit: N/A - SKIP.
- target: none - leave app.js renderTimeline as-is; keep styles.css:1176-1195 button styles.
- reduced-motion: N/A.
- risk: High-risk if someone adds keydown handlers to app.js - reject without freeze waiver.

---

## Summary table

| ID  | Baseline label | Verdict      | Title                                            |
| --- | -------------- | ------------ | ------------------------------------------------ |
| F1  | DONE-BASELINE  | (shipped DO) | Composite-only entrances                         |
| F2  | SKIP-BASELINE  | (orig skip)  | No will-change                                   |
| F3  | DONE-BASELINE  | (shipped DO) | Single ease token                                |
| F4  | SKIP-BASELINE  | (orig skip)  | No stagger beyond hero+KPI                       |
| F5  | SKIP-BASELINE  | (orig skip)  | No extra VT names                                |
| F6  | DONE-BASELINE  | (shipped DO) | VT group 180ms                                   |
| F7  | SKIP-BASELINE  | (orig skip)  | No skipTransition wiring                         |
| F8  | SKIP-BASELINE  | (orig skip)  | No scroll-driven (re-checked: still not Baseline)|
| F9  | SKIP-BASELINE  | (orig skip)  | Smooth scroll RM already correct                 |
| F10 | DONE-BASELINE  | (shipped DO) | Timeline focus-visible parity                    |
| F11 | DONE-BASELINE  | (shipped DO) | moz thumb hover parity                           |
| F12 | DONE-BASELINE  | (shipped DO) | Forced-colors active week cue                    |
| F13 | SKIP-BASELINE  | (orig skip)  | No KPI count-up                                  |
| F14 | SKIP-BASELINE  | (orig skip)  | No Save-Data strip                               |
| F15 | DONE-BASELINE  | (shipped DO) | Timeline :active press                           |
| F16 | SKIP-BASELINE  | (orig skip)  | Keep width progress                              |
| F17 | DONE-BASELINE  | (shipped DO) | Load budget gate                                 |
| F18 | SKIP-BASELINE  | (orig skip)  | No checklist bounce                              |
| N1  | DONE-BASELINE  | (shipped DO) | RM kill-switch delay overrides                   |
| N2  | DONE-BASELINE  | (shipped DO) | theme-toggle :active parity                      |
| N3  | SKIP-BASELINE  | (orig skip)  | No scale/press-scale flourishes                  |
| N4  | SKIP-BASELINE  | (orig skip)  | No element-scoped/class VT                       |
| N5  | SKIP-BASELINE  | (orig skip)  | No hero glow pulse / preloader                   |
| U1  | NEW            | DO           | role=status on discrete status text              |
| U2  | NEW            | DO           | 70ch measure on full-width prose                 |
| U3  | NEW            | DO           | week-box h4 -> h3 heading fix                    |
| U4  | NEW            | DO           | skip-link min-height 44px                        |
| U5  | NEW            | SKIP         | calc-check/thumb already label-targeted          |
| U6  | NEW            | SKIP         | keep non-interactive card hover emphasis         |
| U7  | NEW            | SKIP         | contrast pairs already AA                        |
| U8  | NEW            | SKIP         | focus order/restore/scroll-padding already OK    |
| U9  | NEW            | SKIP         | no roving tabindex on timeline                   |

Counts: 10 DONE-BASELINE / 13 SKIP-BASELINE / 4 NEW-DO / 5 NEW-SKIP / total 32.

## Contract checks

- Every entry has baseline status + absolute source URL(s) + fit or skip-why + re-validated file:line + RM note: yes.
- Label vocabulary exactly DONE-BASELINE | SKIP-BASELINE | NEW (DO|SKIP only on NEW): yes.
- Only NEW U1-U9 actionable; F/N never renumbered: yes.
- already-ships claims cite file:line in this working tree: yes.
- No React/Tailwind/GSAP/anime.js/htmx/bundler recommendation: yes (U1 HTML attrs; U2-U4 styles.css/index.html only).
- No scattered hover-lift / second ease / unscoped motion recommendation: yes (U6 keeps existing hovers; no new transforms; ease token untouched).
- JS-touching findings: none (U1-U4 pure HTML/CSS; U8/U9 explicitly decline JS).
- DOs implementable in index.html/styles.css/app.js only: yes (U1 index.html; U2-U4 styles.css + index.html).
- app.js freeze respected: yes - no DO touches app.js.
- RM/motion-baseline collision noted: yes (U1 no motion; U2-U3 no motion; U4 reuses existing 140ms under kill-switch; F8 re-checked no re-open).
- Out-of-scope avoided: no date changes, no color-scheme logic, no copy rewrites (U3 changes tags not words), no brand redesign.
- Verification commands: not run (denied by task); ASCII only.

## Top 4 to implement (NEW DOs only)

1. U1 - role="status" aria-atomic="true" on #checklistLabel, #pwsLabel, .kpi-number (index.html)
2. U2 - max-width: 70ch on .section-desc, .timeline-detail p, .pws-info p (styles.css)
3. U3 - week-box h4 -> h3 (index.html + styles.css selectors)
4. U4 - .skip-link min-height: 44px (styles.css:138)
