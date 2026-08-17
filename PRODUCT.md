# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Silas himself, using Atlas as his own daily personal task manager. This is a solo apprenticeship project (RoleModel Software) that doubles as a real tool he uses — not a multi-user or commercial product. The data model reflects this: a single `User`, no auth, no sharing, `localStorage`-only persistence.

## Product Purpose

A personal todo/task-management app, themed end-to-end around the Greek myth of Atlas, the Titan condemned to bear the weight of the heavens. It exists to track personal projects ("Realms") and tasks ("Burdens") with due dates ("Fates"), priority ("Weight"), and subtasks, entirely client-side. Success is a genuinely pleasant, coherent, myth-flavored daily-use tool — not just a CRUD exercise.

## Positioning

Not competing on features — competing on *voice and coherence*. Ordinary todo apps are neutral productivity tools; Atlas commits fully to a single sustained metaphor (myth-flavored terminology, a museum-of-antiquities visual language: aged bronze, marble/parchment, laurel, terracotta, Aegean blue) rather than being generic productivity software with myth-themed labels slapped on top.

## Operating Context

- Runs entirely in the browser, no backend/server — `webpack-dev-server` in dev, static bundle in production.
- All state lives in a single `localStorage` key per `StorageManager`, loaded once at startup; the in-memory `TodoList`/`User` object tree is the source of truth while running.
- Terminology mapping (for code identifiers, UI copy, and commit messages) lives in `znotes/atlas-terminology.md` — keep code identifiers plain English (`task`, `complete`, `delete`) and reserve myth language for user-facing copy and BEM class names.
- Architecture rationale (why nesting vs. referencing, why save-on-mutation, dependency direction between entities/store/render) lives in `znotes/architecture.md`.

## Capabilities and Constraints

- Realms (`Project`) own Burdens (`Task`) one-to-many, exclusive nesting; Burdens own SubTasks the same way. SubTasks cannot themselves have subtasks (composition, not inheritance — a deliberate, reversible constraint).
- Full CRUD is wired for realms, burdens, and subtasks: add/edit/delete, complete-toggle on burdens and subtasks, moving a burden between realms via edit.
- Forms are real modal dialogs (Optics `<dialog class="modal">`), not inline/accordion editing.
- Today view aggregates "Neglected" (overdue, incomplete) and "due today" burdens across all realms; each realm also has its own page (active vs. cast-off burdens).
- No sorting implemented yet (parked feature, no decided sort key).
- No automated tests exist in the repo yet.
- `logo.png` is currently unoptimized (~2.6MB) — fine for dev, flagged as needing compression before any real deploy.

## Brand Commitments

- **Name & voice:** "Atlas" — every standard todo-app noun is reframed through the myth (Task→Burden, Project→Realm, Due Date→Fate, Priority→Weight, Complete→Cast Off, Delete→Abandon, Edit→Alter Burden). Full mapping in `znotes/atlas-terminology.md`.
- **Visual world (already committed, not up for reinterpretation without an explicit redesign request):** museum-of-Greek-antiquities materials — aged bronze (primary), warm stone/marble neutral (optimized for light mode as the default), terracotta (danger/urgent), ochre (warning), laurel green (notice/success), Aegean blue (info). Full palette rationale and exact hue/saturation values in `znotes/theme-rationale.md`; token wiring in `znotes/optics-tokens-reference.md`.
- **Typography:** classical serif (Cinzel, falling back to Playfair Display, then system serif) for display/headings only; plain system-ui sans for body copy and task lists, for actual readability.
- **Design system:** built on `@rolemodel/optics` (BEM-structured, token-based) — new component work should compose Optics primitives and tokens rather than introducing a parallel styling system.
- Explicitly avoid "toga-party clip-art" kitsch — the bar is restrained and classical, not costume-y.

## Evidence on Hand

- `znotes/mockups/atlas-mockups.html` (+ `mockup.css`) — the original Round 1 design mockup the current UI was built from.
- `znotes/logo-prompt.md` — the prompt used to generate the current logo mark; useful reference if the logo is ever regenerated.
- No user testimonials, case studies, or external evidence exist or are needed — single personal user, not a marketed product.

## Product Principles

1. Commit fully to the myth metaphor in user-facing surfaces; never let generic "todo app" language leak back in once a term has an Atlas equivalent.
2. Prefer nesting for ownership (Realm→Burden→SubTask), reference for shared vocabulary (Weight) — apply this test to any new entity relationship.
3. Derive state, never duplicate it (e.g. `completed` from `completed_at`, overdue from date comparison) — avoid dual sources of truth.
4. Every mutation saves immediately to `localStorage` and re-renders from the single in-memory tree — no partial hydration, no debounced/batched writes to the model.
5. Restrained classical craft over cartoonish theming — the visual and copy bar is "museum of antiquities," not clip-art.

## Accessibility & Inclusion

No specific standard has been committed to yet; continue using sensible semantic HTML/ARIA (as already present — `aria-pressed`, `aria-label`, `aria-current`, `sr-only` text) without treating it as a formal, audited requirement for now.
