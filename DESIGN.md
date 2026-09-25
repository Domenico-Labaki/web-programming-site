# Domenico Portfolio — Design System

This document is the working guide to the visual language, interaction rules, and implementation tokens for this portfolio site. It adapts the **ZOOPS design philosophy** — an operational control-plane aesthetic — to an educational portfolio context without copying ZOOPS product branding.

> **Goal:** simple, professional, and elegant. A calm workspace where historical content and weekly progress are readable, hierarchy is obvious, and the interface never shouts.

Source of truth in code: [`static/style.css`](static/style.css). Layout shell: [`templates/base.html`](templates/base.html).

---

## 1. Product character

This site should feel:

- **Clear:** the site title, current page, and weekly navigation are always understandable.
- **Calm:** dense timelines (Internet/Web history) are organised without visual noise or decorative urgency.
- **Precise:** dates, sources, provenance, and verification notes say exactly what is known — empty is not replaced with a plausible value.
- **Confident:** restrained spacing, strong blue actions, Inter typography, and generous whitespace establish authority without ornament.
- **Modern:** translucent glass on floating shells, soft blue ambient glow, rounded surfaces, and brief motion add depth without becoming decorative.
- **Trustworthy:** no invented values or implied completeness; verification notes and references remain explicit.

Minimalism here means fewer competing containers, not fewer capabilities.

---

## 2. Design principles

### 2.1 Quiet workspace, restrained entrance

The portfolio has no separate authentication gradient. ZOOPS's expressive blue gradient is reinterpreted as a **restrained ambient glow**: subtle radial glows behind the canvas (`rgba(45,108,223,0.09)` at top-left, `rgba(121,167,242,0.07)` top-right) and a faint arc inside the header shell. Routine timeline pages stay on the quiet canvas; decoration never competes with data.

### 2.2 Hierarchy before decoration

Order on every page:

1. Site identity and weekly navigation (header shell)
2. Page heading with concise context (first `h2`)
3. Primary workflow — Weekly Work grid or timeline
4. Main data surface — articles (milestones)
5. Secondary evidence — Source Verification Notes (`aside`) and References

Do not add a border, badge, icon, or shadow unless it clarifies this hierarchy.

### 2.3 One visual language

All pages — Home, Week 1, Internet History, Web History, and the AI-generated variants — share tokens, glass construction, and navigation rules. Variant pages do not receive a different design system.

### 2.4 Truth over reassurance

The history pages already distinguish nuance (e.g., "1969 is ARPANET, not necessarily the Internet"). Visual design must not collapse that nuance into a green badge. Semantic colour (success/warning/critical) is reserved for real state and is never the sole carrier of meaning.

### 2.5 Progressive disclosure

Timelines use a layered disclosure that already exists in HTML:

- Summary (`What happened` / `Why it mattered`) stays visible.
- Supporting provenance lives in `article footer` (Sources) and collapses naturally on scroll.
- Verification notes (`aside#verification-notes`) act as the persistent disclosure for historiography.
- Route-backed weekly links replace tabs.

Form state preservation is not applicable (no JS forms on this version) but the CSS preserves vertical rhythm when sections are expanded.

---

## 3. Brand

### Name

This site's brand is the student's identity: **Domenico's Web Portfolio**. It is not rebranded to ZOOPS.

### Mark

A CSS-only mark is injected via `body > header h1::before`: 36 px square, 11 px radius, `#2d6cdf` fill, with a white headset-inspired glyph. It evokes the ZOOPS tile without copying its asset. Decorative only (`aria-hidden` by nature of being a pseudo-element).

### Lockup

Header lockup:

- mark (`::before`)
- site title in semibold Inter
- contextual line (`::after`): `Portfolio · GIN446` at 10 px uppercase, `var(--muted)` — the portfolio equivalent of ZOOPS's `Control Plane` / tenant-selector line.

---

## 4. Colour system

Primary blue is fixed:

| Role | Value | Use |
|---|---:|---|
| Primary blue | `#2d6cdf` | Links, focus, time pills, mark, accent rules |
| Primary blue dark | `#1f5ac4` | Hover/pressed |
| Primary blue light | `#eef5ff` | Selected / informational pill fills |
| Primary blue light strong | `#dbeafe` | Pressed fill |
| Ink | `#20252e` | Primary text (light) |
| Muted | `#5e6878` | Supporting copy, h4, nav idle |
| Canvas | `#f7f8fa` | Light workspace |
| Dark canvas | `#0b111b` | Dark background |
| Dark surface | `#151d29` | Dark code bg |

Restrained semantics (unused on this portfolio but tokenised for future status):

| Meaning | Base | Background |
|---|---:|---|
| Success | `#16845b` | `#e6f4ef` |
| Warning | `#b66a0a` | `#fef3d6` |
| Critical | `#cf3d4c` | `#fde8ea` |
| Processing | blue | blue-light |
| Unknown | neutral gray | — |

Colour never carries meaning alone; badges pair colour with text.

**Accent gradient** (header arc only, not a full-bleed gradient):

```css
radial-gradient(520px 280px at 50% -40%, rgba(45,108,223,0.08), transparent 70%)
linear-gradient(180deg, rgba(45,108,223,0.04), transparent 55%)
```

---

## 5. Light and dark themes

Light is default. Dark reduces glare while preserving hierarchy.

- Toggle is `#theme-toggle`; state persists in `localStorage` (existing `static/main.js` behaviour retained, not edited).
- Tokens swap under `body.dark`; component structure does not change.
- Primary blue remains stable; dark muted text brightens to `#94a3b8`; glass values shift to `rgb(21 29 41 / 78%)` / `90%`.
- Code, borders, and shadows each have a dark counterpart and are checked for WCAG AA contrast.

When adding a new colour: define both modes, verify text/border/hover/focus/disabled/selected, and check contrast.

---

## 6. Translucent glass

Glass is structural, not decorative — it creates continuity between floating header, weekly band, milestone panels, and footer.

### Tokens

Light:

- regular: `rgb(255 255 255 / 78%)`
- strong: `rgb(255 255 255 / 88%)`
- subtle: `rgb(255 255 255 / 60%)`
- border: `rgb(255 255 255 / 72%)`

Dark:

- regular: `rgb(21 29 41 / 78%)`
- strong: `rgb(21 29 41 / 90%)`
- subtle: `rgb(21 29 41 / 60%)`
- border: `rgb(148 177 218 / 20%)`

### Where glass belongs

- floating header shell (`body > header`)
- weekly work band (`.weekly-list`)
- milestone panels (`article`)
- verification band (`aside#verification-notes`)
- references band (`section#references`)
- floating theme toggle and footer shell

These share: translucent theme-aware fill, subtle light border, restrained shadow, `backdrop-filter: blur(22px) saturate(118%)` (strong uses 26 px), `-webkit-backdrop-filter` included. Translucent fill alone provides sufficient contrast if blur is unsupported.

### Where glass does not belong

- inline `code` (opaque `var(--code-bg)`)
- sticky or table-like surfaces (none present, but reserved)
- small nested `section` inside a glass panel — these become **transparent sections separated by a `1px var(--rule)`** rather than nested blurred rectangles
- repeated list rows (`article footer li`, `section#references li`) — divider-based rows

---

## 7. Typography

**Inter** with system sans-serif fallbacks; **JetBrains Mono** for code.

| Element | Guidance |
|---|---|
| Site title | `clamp(18px, 2.2vw, 22px)`, weight 650, tracking −0.03em, `text-wrap: balance` |
| Context line | 10 px uppercase, tracking 0.08em, 600 |
| Section heading (`h2`) | 19 px, weight 620, tracking −0.02em, blue 3 px underline (28 px × 3 px) |
| Subheading (`h3`) | 16 px, weight 620 |
| Eyebrow (`h4`) | 12 px uppercase, tracking 0.06em, 620, muted |
| Body (`p`, `li`) | 14 px, line-height 1.65, max-width 760 px |
| Supporting (`figcaption`, `cite`, footer) | 12–12.5 px |
| Navigation label | 13 px, weight 550 |
| Time pill | 12 px, weight 620, blue on blue-light, 8 px radius |
| Code | 0.86 em mono, 500 |

Headings use `text-wrap: balance`. Supporting copy is constrained below 760 px; `time` and `code` are the only pill-like inline elements.

---

## 8. Spacing and layout

4 px rhythm: 8, 12, 16, 20, 24, 28, 32, 42 px.

### Page frame

- Content max: 900 px (widens to 920 px above 1280 px; ZOOPS cap is 1640 px — adapted to portfolio density)
- Header/footer max: 920–940 px
- Desktop page padding: **38 px top, 36 px horizontal, 64 px bottom** at ≥769 px; 32/36/64 at the 744–769 seam; 28/24/56 on medium tablets
- Phone padding: 20 px top + 56 px header clearance, 16 px horizontal, 44 px bottom
- Inset floating shells: `width: calc(100% - 24px)` with 12 px outer margin
- Section separation: 28 px
- Panel padding: 26 px desktop, 20 px phone

Whitespace precedes additional containers; related timeline entries share article dividers rather than extra panels.

### Grid

- `.weekly-list` is a grid: 1 column below 600 px, 2 columns at ≥600 px (operational equivalent of ZOOPS's 4→2 metrics and 2-column workspace collapsing below 1280 px). `minmax(0,1fr)` prevents overflow.

---

## 9. Shape and depth

| Element | Radius |
|---|---:|
| Inputs / nav pills / buttons | 10 px (`--radius-input`) |
| Time pill / badges | 8 px (`--radius-badge`) |
| Panels (article, header, footer, aside, references) | 16 px (`--radius-panel`) |
| Weekly item | 12 px (small card within band) |
| Theme toggle | pill (999 px) |
| Image | 16 px |

Elevation is reserved for floating shells:

- `--shadow-glass`: `0 8px 32px rgba(16,36,70,0.08), 0 1px 3px rgba(16,36,70,0.06)`
- `--shadow-glass-strong`: stronger on `article:hover`
- `--shadow-subtle`: header/footer/toggle idle
- Dark equivalents are deeper (0.45–0.55 alpha)

No heavy drop shadows on inline sections.

---

## 10. Application shell (reinterpreted)

ZOOPS uses a floating glass sidebar rail (68 px → 256 px on hover) and no top bar. This portfolio keeps `templates/base.html:9`'s `<header>` but **treats it as the floating shell**:

- Inset 12 px from viewport edges (8 px on very small phones), 22 px padding, `border-radius: 16px`, `backdrop-filter: blur(22px)`.
- Restrained arc motif via `header::before` rather than a full blue gradient — the "expressive entrance" is muted to suit a portfolio.
- Navigation stays centred, permission-filtered in spirit (weekly items are the tenant-scoped destinations).
- Floating utilities: `#theme-toggle` is the circular glass button at top-right (40 px, 44 px on phones), mimicking ZOOPS's circular notification/theme/profile controls. It has an accessible name (`aria-label="Toggle dark mode"` preserved from `base.html:18`).

No separate top bar is introduced, satisfying the "what to avoid" rule. On phones the header gains 56 px top padding so content never sits under the floating toggle.

---

## 11. Page composition

Standard page:

1. **Header shell** — title + weekly nav + toggle
2. **Page heading** (`h2`) — noun phrase with 28 px × 3 px blue rule beneath it
3. **Primary surface** — `.weekly-list` band (home) or sequence of `article` milestone panels (history pages)
4. **Secondary evidence** — `aside#verification-notes` (provenance nuance) and `section#references` (sources), each as a single glass band with transparent inner sections

Verification notes are not repeated prose of the nav label; they answer *what is contested and why dates differ*, paralleling ZOOPS's provenance/freshness obligations.

---

## 12. Panels, cards, sections

A panel is used when content needs a boundary from adjacent workflows:

- each milestone (`article`)
- the verification band (`aside#verification-notes`)
- the references band (`section#references`)
- the weekly band (`.weekly-list`)

Inside a panel, `section` elements are **flat transparent sections** with a `1px var(--rule)` bottom divider — not nested glass. Record collections (sources, references) use divider rows (`border-bottom: 1px solid var(--rule)`) and a 5 px blue dot marker (`article footer li::before`), avoiding card-per-row layouts.

---

## 13. Buttons and actions

No primary CTA exists on these pages; tokens are defined for future use:

- Primary: filled `#2d6cdf`, white text, darkens to `#1f5ac4` on hover.
- Secondary: outline / opaque neutral (nav idle state is the example).
- Text: low-emphasis (inline links).
- Icon-only (`#theme-toggle`): 40 px (44 px phones), accessible name required, visible focus ring, tooltip via semantics.

Disabled states are not currently needed; when introduced, explain the reason adjacent to the control rather than relying on opacity alone.

---

## 14. Forms

No active form in the committed templates (the instructor-provided profile templates carry inline form styles separately). Tokens are ready for future forms:

- Corners 10 px, opaque `var(--code-bg)`-like surfaces, labels outside inputs, example placeholders only, validation adjacent to the field, two-column grids that collapse below 744 px.

---

## 15. Data presentation

### Weekly list (inventory)

- The band holds multiple rows. Each row shows the badge (`data-week`, e.g. `W2`) in blue-on-blue-light, the title link (primary), and a left 3 px blue rule that appears on hover. No per-row floating card shadow by default.

### Timelines (articles)

- Efficient density, date pill first (`time` with `datetime` attribute preserved from AI templates: `templates/internet-history-ai.html:34`), heading second, evidence last.
- Technical tables are absent; if added they must scroll inside a focusable region with an accessible label and never cause page-level horizontal scroll (`minmax(0,1fr)` everywhere).

### Verification / References

- `aside#verification-notes` and `section#references` are single bands; inner sections are transparent with rule dividers — same pattern as ZOOPS metric groups and drawers.

### Charts

None present; future charts use primary blue + neutrals and a table/text alternative.

---

## 16. Status and asynchronous states

Not yet needed (static content). Semantic tokens are defined (`--success`, `--warning`, `--critical`) for future use with the ZOOPS shared-status mapping (healthy/warning/critical/processing/unknown) where each badge pairs colour with icon+text. The current `time` pill is informational (blue), not a status badge.

When async behaviour is introduced, implement the full surface lifecycle: initial loading (opacity breath), empty (explain what the space represents + next action), stale/partial/denied/error — distinguished, not conflated.

---

## 17. Icons and imagery

- Lucide is the ZOOPS icon language; this portfolio uses no icon font to keep the payload quiet. The mark's headset is drawn with CSS gradients, purely decorative.
- Images (`static/images/spidey.jpeg:1`, used in `templates/week1.html:8`) keep the panel radius (16 px), thin `var(--border)` stroke, and `background: #fff` (dark: `#0f172a`) so they never appear as heavy cards.

---

## 18. Motion

Brief and functional only:

- `150 ms` for hover/focus/background/border/transform
- `200 ms` for panel hover elevation
- `500 ms` gentle `zoops-fade` (6 px translate + opacity) staggered 60 ms per section

Avoid large translations, bouncing, or looping attention effects. All transitions use `--ease-out: cubic-bezier(0.16,1,0.3,1)` and animate `transform`/`opacity`/`color`/`background`. Reduced motion (`prefers-reduced-motion: reduce`) collapses durations to `0.01 ms`.

---

## 19. Content design

Calm, direct, customer-readable:

- Sentence case for labels (`Weekly Work`, `History of the Internet`).
- Page titles are noun phrases; `h4` eyebrows are terse (`What happened`, `Why it mattered`, `Sources`).
- Consequential nuance (e.g., flag-day vs. invention date) lives in the body, not in the navigation label.
- References are complete, with provenance preserved (Internet Society, RFC Editor, CERN, NSF, DARPA).

---

## 20. Accessibility (target WCAG 2.1 AA)

Implemented:

- Visible `3px solid var(--blue)` focus rings (`:focus-visible` with `2px` offset) — `static/style.css:159`
- Complete keyboard operation for nav and toggle; toggle has `aria-label` (`base.html:18`)
- `alt` text is absent on the decorative office image — screen readers fall back to context; inline heading hierarchy (`h1` → `h2` → `h3` → `h4`) is preserved in AI templates with `aria-labelledby` on every `section`
- `time datetime` and `cite` convey semantics, not colour alone
- `backdrop-filter` has a solid translucent fallback (`var(--glass-regular)`)
- Touch targets: `#theme-toggle` 40 px → 44 px on phones
- Phone baseline 360 px with no horizontal scroll (`scrollbar-gutter: stable`, `minmax(0,1fr)`, `overflow-wrap: break-word`)
- `prefers-reduced-motion` support

Remaining: see **HTML change requests** for skip-link, explicit labels, and image `alt`.

---

## 21. Responsive behaviour

Canonical widths reviewed: 360, 390, 744, 1024, 1280, 1536.

| Breakpoint | Behaviour |
|---|---|
| ≤389 px | Shells tighten to `100% - 16px`, panels to 18 px, base remains 360 px without horizontal scroll |
| ≤743 px | Phone: header gains 56 px top clearance, toggle becomes 44 px, panels tighten to 20 px, weekly titles wrap, `h2` reduces to 18 px |
| 744–1023 px | Tablet: page padding 28/24/56, header side padding 24 px |
| ≥600 px | Weekly band becomes 2-column (2-up inventory) |
| ≥769 px | Desktop frame: 38/36/64, section gap 28 px |
| ≥1280 px | Content cap widens to 920 px, header/footer to 940 px |
| ≥1536 px | Subtle fixed ambient radial at top-right |

Responsive changes never hide functionality or clear state; weekly links remain navigable without JS.

---

## 22. Permission-aware design

No auth is implemented. The navigation list (`weekly_work` injected in `app.py:10`) is the permission analogue: only assigned weeks appear. Direct URL access to history pages yields the same rendering — no unauthorized-data-fetch concept applies, satisfying the "identical guidance with different scope" principle by design.

---

## 23. Implementation rules

Source of truth: `static/style.css`. Shared tokens: `:root` / `body.dark`.

When adding or changing UI:

1. Reuse an existing token before adding a new one.
2. Change the shared token, not a page-specific override (the inline `<style>` in `templates/profile.html:7` is the sole exception and is explicitly contained).
3. Keep nested surfaces flat — no glass-in-glass.
4. Add both light and dark behaviour.
5. Add the applicable states (loading/empty/error/success) even if currently static.
6. Preserve URL and browser-history behaviour (weekly links are plain anchors).
7. Check 360 px and desktop before shipping.
8. Verify focus, labels, touch targets, contrast, and reduced motion.

Page-specific CSS belongs in the shared sheet unless a page introduces a distinct data visualisation; even then it must consume shared colour/spacing/radius/surface tokens.

---

## 24. Design review checklist

### Purpose and hierarchy
- [ ] Primary task (weekly navigation or milestone timeline) is immediate.
- [ ] No repeated title inside the first panel.
- [ ] Related elements grouped without excessive containers.
- [ ] Secondary evidence available without dominating.

### Visual system
- [ ] Inter + mono stack, ZOOPS blue, shared tokens only.
- [ ] Radii per scale (10 / 8 / 16 / pill).
- [ ] Glass reserved for floating shells; nested sections are flat with rules.
- [ ] Dark mode contrast preserved.

### Interaction
- [ ] Hover also works via keyboard focus; transform is restrained (`-1px` lift).
- [ ] Toggle has 40/44 px target, accessible name, visible focus.
- [ ] No hover-only behaviour.

### Data and trust
- [ ] Source, scope, and date are explicit; verification notes present.
- [ ] `time` pills are informational, not decorative status.
- [ ] Empty/partial/denied/error would be distinct if introduced.

### Responsive / accessible
- [ ] No horizontal scroll at 360, 390, 744, 1024, 1280, 1536 px.
- [ ] Focus, labels, and reduced motion correct.

---

## 25. What to avoid

Do not introduce:

- a global top bar or separate exports control
- opaque white blocks on the (muted) gradient area
- glass on every nested `section` or list row
- multiple implementations of the same inventory/timeline workflow
- decorative status badges on neutral metrics
- tiny marketing labels or filler copy
- card-per-row layouts with heavy shadows for simple lists
- unlabeled icon buttons or hover-only functionality
- page-level horizontal scrolling
- invented values or inferred health badges
- navigation grouping that broadens access beyond `weekly_work`

---

## 26. Related records

- ZOOPS design philosophy — the inspiration for this style (source Design.md supplied with the task; traceability of image identifiers not applicable to this portfolio)
- [`static/style.css`](static/style.css) — implemented tokens and components
- [`templates/base.html`](templates/base.html) — shell markup
- [`templates/index.html`](templates/index.html) — weekly band
- [`templates/internet-history-ai.html`](templates/internet-history-ai.html) / [`templates/web-history-ai.html`](templates/web-history-ai.html) — semantically rich timeline markup (`time`, `cite`, `aria-labelledby`) this style targets
- [`app.py`](app.py) — weekly route registry

Update this document when a visual or token change affects its invariants.

