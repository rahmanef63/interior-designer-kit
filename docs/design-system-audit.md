# Design System Audit — Interior Studio

**Scope:** `apps/web/app/globals.css` (single source of truth) + inline styles in
components. The system is code/CSS-based (no Figma file).

## Summary

**Components reviewed:** 9 · **Issues found:** 12 · **Score: 58 / 100**

Solid, coherent dark visual language and a clean color-token start — but tokens
stop at color (no spacing/type/radius/motion scale), interactive/focus states are
missing, and 7 inline styles leak outside the system.

| Dimension | Score | Note |
|---|---|---|
| Naming consistency | 7/10 | Mostly kebab-case; a few cryptic/abbreviated names |
| Token coverage | 4/10 | Colors tokenized; spacing/type/radius/motion are magic numbers |
| Component completeness | 6/10 | Functional, but missing hover/focus/error states |
| Accessibility | 4/10 | No `:focus-visible` anywhere; inputs have no focus ring |
| System discipline | 6/10 | 7 inline styles + 6 hardcoded hex bypass the tokens |
| Documentation | 2/10 | Nothing documented before this file |

## Token inventory (what exists)

| Category | Tokens | Status |
|---|---|---|
| Color | `--bg --panel --panel-2 --text --muted --accent --line --ok --warn` (9) | Good start |
| Spacing | — | Absent (hardcoded: 4,6,7,8,10,12,14,16,18,20,24,32px…) |
| Typography | — | Absent (sizes: 10,12,13,14,15,16,26,40px; weights 500/600/700) |
| Radius | — | Absent (4,5,6,8,10,12,999px) |
| Shadow / elevation | — | None (flat design — acceptable) |
| Motion | — | None — no transitions exist, so state changes are abrupt |

## Naming consistency

| Issue | Where | Recommendation |
|---|---|---|
| Cryptic / abbreviated names | `.cur`, `.pic`, `.ok` | Rename to `.stage-now`, `.pic-list`, `.text-success` |
| Mixed paradigms | BEM-ish (`.col-head .order`) vs utility (`.muted`, `.lead`) vs state (`.status-active`) | Pick a convention per layer (utilities vs components) and note it |
| snake_case leak | `.gate-client_approval`, `.gate-payment` | Map stage ids to kebab modifiers, or keep but document the exception |
| Color-name as utility | `.ok` = green text | Rename to `.text-success` to avoid semantic collision |

## Token coverage

| Category | Defined | Hardcoded instances found |
|---|---|---|
| Colors | 9 | **6** — `#6cc070` ×3 (duplicates `--ok`!), `#1b1206` ×2 (text-on-accent), `#2f4a35` ×1 |
| Spacing | 0 | ~30+ literal px/rem values across rules |
| Typography | 0 | 8 distinct font-sizes, 3 weights, hardcoded |
| Radius | 0 | 7 distinct radii, hardcoded |

## Component completeness

| Component | States | Variants | Docs | Score |
|---|---|---|---|---|
| Button `.btn` | default, disabled (no hover/active/**focus**) | primary, ghost (no sizes) | ❌ | 5/10 |
| Card `.card` | default, hover (no **focus** on the `<a>`) | — | ❌ | 6/10 |
| Status pill `.status` | n/a | active, done, lead | ❌ | 7/10 |
| Stage tracker `.dot` | done, current, todo | — | ❌ | 7/10 |
| Form / Input `.form` | default (no **focus**, no error, no disabled) | — | ❌ | 4/10 |
| Panel `.panel` | static | — | ❌ | 7/10 |
| Table `.tbl` | row hover | — | ❌ | 7/10 |
| Nav `.topbar` | link hover | — | ❌ | 7/10 |
| Mode badge `.mode-badge` | static | — | ❌ | 8/10 |

## Accessibility

- **No `:focus-visible` rings anywhere** (WCAG 2.4.7). Buttons, links, cards, and
  inputs give keyboard users no visible focus — highest-priority fix.
- Inputs (`.form input/select`) have no `:focus` state at all.
- Contrast spot-check: `--muted` on `--bg`, `--accent`/`--warn` on `--bg`, and the
  dark text on `--accent` button appear to pass AA, but verify with a checker once
  tokens settle.
- No `prefers-reduced-motion` handling — moot today (no motion), required once
  transitions are added.

## Off-system inline styles (7 instances, 3 files)

| File:line | Inline style | Fix |
|---|---|---|
| `signin/page.tsx:38` | `color: var(--warn)` on error | `.msg-error` class |
| `signin/page.tsx:40` | `marginTop: 16` | spacing util / class |
| `signin/page.tsx:44` | full link-button styling | `.linkbtn` class |
| `AuthNav.tsx:22` | `inline-flex; gap; marginLeft` | `.nav-user` class |
| `AuthNav.tsx:23` | `fontSize: 13` | type token |
| `AuthNav.tsx:26` | full link-button styling | `.linkbtn` class (shared with signin) |
| `projects/[projectId]/page.tsx:89` | `whiteSpace: pre-wrap` | `.prose` / `.brief-body` class |

Note the two link-buttons (`signin` flow toggle, `AuthNav` Keluar) are duplicated
inline — strongest signal a shared `.linkbtn` is missing.

## Priority actions

1. **Add token scales** — `--space-*`, `--text-*`, `--radius-*` (+ `--ease`/`--dur`),
   then replace magic numbers. Biggest leverage for consistency.
2. **Fix hardcoded color** — `#6cc070` → `var(--ok)` (×3); add `--on-accent` for
   `#1b1206` (×2); tokenize `#2f4a35` as `--ok-border`.
3. **Add `:focus-visible` rings** on buttons/links/cards + `:focus` on inputs (a11y).
4. **Extract inline styles** into `.linkbtn` and `.msg-error`; remove all 7 instances.
5. **Complete the Button** — hover/active states + a transition; optional sm/md/lg.
6. **Document components** — expand this file into per-component docs (variants,
   states, a11y, do/don't).

## Migration note

All changes are additive (new tokens) or swaps (hex → token) — no breaking class
renames required for #1–#5. Naming cleanups (#1 in the naming table) are the only
breaking changes and can be staged later with find-and-replace.
