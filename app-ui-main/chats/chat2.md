# Motion Design System

_Started 2026-05-09 21:46 UTC_

---

## User

crafted the motions here. Making the experience more engaging and alive

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: write_file]_

Adding craft + life to the experience without rewriting any of the screens — a single `motions.jsx` companion that injects keyframes, watches for screens entering view, and adds a few targeted enhancers (typing cursor, accent pulse, image float, sway on rice grains).

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Added a motion layer (`motions.jsx`) that brings the onboarding to life without touching any of the existing screen code:

- **Screen entrance** — each artboard fades in with a staggered rise on its top-level children (title → sub → fields → CTA), triggered when the screen scrolls into the canvas viewport.
- **Ambient life** — the welcome illustration floats gently, rice-grain scatters sway at varied speeds, the Telugu wordmark settles in from a blurred wide-track state.
- **Living widgets** — primary CTAs breathe softly, buttons lift on hover and press in on click, the stepper bar fills, the phone-input caret blinks, and selected cards radiate a subtle accent ring.
- **Respects `prefers-reduced-motion`** — all animation collapses out for users who opt out.

It's pure DOM/CSS with an IntersectionObserver + MutationObserver, so it survives theme tweaks and re-renders.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: snip]_

_[tool: fork_verifier_agent]_

The motion layer is in and the entrance stagger fix is live.

## User

Verifier agent check completed

## Assistant

