// motions.jsx — Talambralu motion layer
// Adds entrance animation when each screen comes into view, and a handful
// of ambient + targeted micro-interactions. Pure DOM/CSS, runs once at boot
// and re-targets after React re-renders. Respects prefers-reduced-motion.

(function () {
  if (window.__TLM_MOTIONS_BOOTED) return;
  window.__TLM_MOTIONS_BOOTED = true;

  const reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────────────────────────
  // Stylesheet — all the motion tokens live here.
  // ─────────────────────────────────────────────────────────────────
  const css = `
  /* Easing */
  :root {
    --tlm-ease: cubic-bezier(0.22, 1, 0.36, 1);
    --tlm-ease-soft: cubic-bezier(0.32, 0.72, 0, 1);
  }

  @keyframes tlm-rise {
    from { opacity: 0; transform: translate3d(0, 14px, 0); filter: blur(2px); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); filter: blur(0); }
  }
  @keyframes tlm-rise-sm {
    from { opacity: 0; transform: translate3d(0, 6px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }
  @keyframes tlm-fade {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes tlm-pop {
    0%   { opacity: 0; transform: scale(0.86); }
    65%  { opacity: 1; transform: scale(1.04); }
    100% { transform: scale(1); }
  }
  @keyframes tlm-breathe {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.012); }
  }
  @keyframes tlm-float {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50%      { transform: translate3d(0, -5px, 0); }
  }
  @keyframes tlm-sway {
    0%, 100% { transform: rotate(-1.2deg); }
    50%      { transform: rotate(1.2deg); }
  }
  @keyframes tlm-grain {
    0%   { transform: translate3d(0, 0, 0) rotate(0); }
    50%  { transform: translate3d(0, -2px, 0) rotate(6deg); }
    100% { transform: translate3d(0, 0, 0) rotate(0); }
  }
  @keyframes tlm-blink {
    0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; }
  }
  @keyframes tlm-shimmer {
    0%   { background-position: -180% 0; }
    100% { background-position: 180% 0; }
  }
  @keyframes tlm-progress-fill {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes tlm-ring-pulse {
    0%   { box-shadow: 0 0 0 0 currentColor; opacity: 0.45; }
    100% { box-shadow: 0 0 0 14px transparent; opacity: 0; }
  }
  @keyframes tlm-wordmark {
    0%   { letter-spacing: 0.5em; opacity: 0; filter: blur(6px); }
    100% { letter-spacing: 0.02em; opacity: 1; filter: blur(0); }
  }
  @keyframes tlm-underscore {
    0%, 49% { opacity: 1; } 50%, 100% { opacity: 0.15; }
  }

  /* ────────── Screen entrance: stagger top-level children ────────── */

  /* The actual screen content lives at:
     [data-screen-label] > IOSDevice frame > viewport > Screen container > children
     We can't know the exact depth, so we cascade animation into all
     reasonable levels and let the deepest match win.                  */
  [data-screen-label] {
    will-change: auto;
  }
  [data-screen-label].tlm-in {
    animation: tlm-fade 0.35s var(--tlm-ease) backwards;
  }

  /* Stagger immediate children of the Screen padding container.
     This catches: Title, Sub, field stacks, CTA, etc. */
  .tlm-stage > * {
    animation: tlm-rise 0.62s var(--tlm-ease) backwards;
    animation-play-state: paused;
  }
  [data-screen-label].tlm-in .tlm-stage > * {
    animation-play-state: running;
  }
  .tlm-stage > *:nth-child(1)  { animation-delay: 0.06s; }
  .tlm-stage > *:nth-child(2)  { animation-delay: 0.12s; }
  .tlm-stage > *:nth-child(3)  { animation-delay: 0.19s; }
  .tlm-stage > *:nth-child(4)  { animation-delay: 0.27s; }
  .tlm-stage > *:nth-child(5)  { animation-delay: 0.34s; }
  .tlm-stage > *:nth-child(6)  { animation-delay: 0.41s; }
  .tlm-stage > *:nth-child(7)  { animation-delay: 0.48s; }
  .tlm-stage > *:nth-child(8)  { animation-delay: 0.54s; }
  .tlm-stage > *:nth-child(9)  { animation-delay: 0.60s; }
  .tlm-stage > *:nth-child(10) { animation-delay: 0.66s; }
  .tlm-stage > *:nth-child(n+11) { animation-delay: 0.72s; }

  /* ────────── Buttons: feel ────────── */
  [data-screen-label] button {
    transition: transform 0.18s var(--tlm-ease),
                box-shadow 0.22s var(--tlm-ease),
                filter 0.22s var(--tlm-ease);
  }
  [data-screen-label] button:hover {
    transform: translateY(-1.5px);
    filter: brightness(1.04);
  }
  [data-screen-label] button:active {
    transform: translateY(0) scale(0.985);
    filter: brightness(0.96);
  }

  /* The accent CTA gently breathes when the screen is alive. */
  [data-screen-label].tlm-in .tlm-cta {
    animation: tlm-breathe 4.5s var(--tlm-ease-soft) infinite;
    animation-delay: 1.2s;
    transform-origin: center;
  }

  /* ────────── Ambient: rice-grain scatter sways ────────── */
  /* Each ellipse is a single grain. We stagger via nth-child. */
  [data-screen-label] .tlm-grain-host ellipse {
    transform-origin: center;
    transform-box: fill-box;
    animation: tlm-grain 7s ease-in-out infinite;
  }
  [data-screen-label] .tlm-grain-host ellipse:nth-child(2n)  { animation-duration: 8.4s; animation-delay: -1.1s; }
  [data-screen-label] .tlm-grain-host ellipse:nth-child(3n)  { animation-duration: 6.2s; animation-delay: -2.6s; }
  [data-screen-label] .tlm-grain-host ellipse:nth-child(5n)  { animation-duration: 9.5s; animation-delay: -3.8s; }
  [data-screen-label] .tlm-grain-host ellipse:nth-child(7n)  { animation-duration: 7.8s; animation-delay: -0.7s; }

  /* ────────── Welcome illustration: very gentle float ────────── */
  [data-screen-label] img.tlm-hero {
    animation: tlm-float 7.5s var(--tlm-ease-soft) infinite;
    will-change: transform;
  }

  /* ────────── Telugu wordmark: settles in ────────── */
  [data-screen-label].tlm-in .tlm-wordmark {
    animation: tlm-wordmark 1.4s var(--tlm-ease) backwards;
    animation-delay: 0.4s;
  }

  /* ────────── Stepper bar: fills ────────── */
  .tlm-progress-fill {
    transform-origin: left center;
    animation: tlm-progress-fill 0.9s var(--tlm-ease) backwards;
    animation-delay: 0.25s;
  }

  /* ────────── Phone-input cursor: blinks ────────── */
  .tlm-cursor {
    display: inline-block;
    animation: tlm-blink 1.05s steps(1, end) infinite;
  }

  /* Underscore placeholders pulse softly so the field looks live */
  .tlm-underscore {
    animation: tlm-underscore 1.4s ease-in-out infinite;
  }

  /* ────────── Selected card / chip: subtle accent pulse ────────── */
  .tlm-selected-pulse::after {
    content: '';
    position: absolute; inset: -1px;
    border-radius: inherit; pointer-events: none;
    box-shadow: 0 0 0 0 currentColor;
    animation: tlm-ring-pulse 2.4s var(--tlm-ease) infinite;
    color: var(--tlm-accent, #B85C3A);
    opacity: 0.5;
  }

  /* ────────── Photo placeholders: shimmer until image swaps in ────── */
  .tlm-shimmer {
    background-image: linear-gradient(
      100deg,
      rgba(255,255,255,0) 30%,
      rgba(255,255,255,0.45) 50%,
      rgba(255,255,255,0) 70%
    );
    background-size: 200% 100%;
    background-repeat: no-repeat;
    animation: tlm-shimmer 2.4s linear infinite;
  }

  /* ────────── Reduced motion ────────── */
  @media (prefers-reduced-motion: reduce) {
    [data-screen-label] *,
    [data-screen-label] *::before,
    [data-screen-label] *::after {
      animation: none !important;
      transition-duration: 0.01ms !important;
    }
  }
  `;

  const styleEl = document.createElement('style');
  styleEl.id = 'tlm-motions';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  if (reduce) return; // CSS handles the rest; skip enhancers.

  // ─────────────────────────────────────────────────────────────────
  // Enhancers — small DOM tweaks to make specific patterns animate.
  // ─────────────────────────────────────────────────────────────────

  // Pick the "Screen padding container" inside an artboard. Screens use
  // display:flex + flex-direction:column with padding around the children.
  // The container can sit several iOS-frame wrappers deep, none of which
  // are themselves flex-column — so we recurse the whole subtree, collect
  // every flex-column candidate, and pick the deepest one with the most
  // children (that's the actual screen body).
  function findStage(root) {
    const candidates = [];
    function walk(node, depth) {
      if (!(node instanceof HTMLElement)) return;
      if (node !== root) {
        const cs = node.style;
        const isCol =
          (cs.display === 'flex' && cs.flexDirection === 'column') ||
          /flex-direction:\s*column/i.test(node.getAttribute('style') || '');
        if (isCol && node.children.length >= 3) {
          candidates.push({ node, depth, kids: node.children.length });
        }
      }
      for (const c of node.children) walk(c, depth + 1);
    }
    walk(root, 0);
    if (!candidates.length) return null;
    // Prefer deepest; tie-break by most children.
    candidates.sort((a, b) => b.depth - a.depth || b.kids - a.kids);
    return candidates[0].node;
  }

  function enhance(artboard) {
    if (artboard.__tlmEnhanced) return;
    artboard.__tlmEnhanced = true;

    // 1. Stage class for the staggered entrance.
    const stage = findStage(artboard);
    if (stage) stage.classList.add('tlm-stage');

    // 2. Tag rice-grain SVGs (RiceScatter) so we can sway them.
    artboard.querySelectorAll('svg').forEach((svg) => {
      const grains = svg.querySelectorAll('ellipse[rx="1.6"]');
      if (grains.length >= 4) svg.classList.add('tlm-grain-host');
    });

    // 3. Welcome hero illustration → floats gently.
    artboard.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (/welcome-couple/.test(src)) img.classList.add('tlm-hero');
    });

    // 4. Telugu wordmark — first element using the Telugu serif.
    artboard.querySelectorAll('*').forEach((el) => {
      const ff = (el.style && el.style.fontFamily) || '';
      if (/Noto\s*Serif\s*Telugu/i.test(ff)) el.classList.add('tlm-wordmark');
    });

    // 5. Primary CTA → breathing accent. Heuristic: a full-width button
    //    with rounded radius that's not transparent. Tag the LAST one only.
    const candidates = Array.from(artboard.querySelectorAll('button')).filter(
      (b) => {
        const bg = b.style.background || b.style.backgroundColor || '';
        return bg && bg !== 'transparent' && !/rgba\(0,\s*0,\s*0,\s*0\)/.test(bg);
      }
    );
    if (candidates.length) candidates[0].classList.add('tlm-cta');

    // 6. Stepper progress bar — find an absolutely-positioned div with
    //    width set to a percent inside a thin track.
    artboard.querySelectorAll('div').forEach((d) => {
      const s = d.style;
      if (
        s.position === 'absolute' &&
        /%$/.test(s.width || '') &&
        parseFloat(s.width) > 0 &&
        parseFloat(s.width) < 100
      ) {
        const parent = d.parentElement;
        if (parent && parent.offsetHeight && parent.offsetHeight <= 6) {
          d.classList.add('tlm-progress-fill');
        }
      }
    });

    // 7. Selected cards / chips — heuristic: borderColor matches a strong
    //    accent and boxShadow is an accent ring. Add subtle pulse.
    //    (Light touch — only on items that are clearly "selected".)
    artboard.querySelectorAll('div').forEach((d) => {
      const s = d.style;
      const hasAccentRing =
        s.boxShadow && /\b0 0 0 1px\b/.test(s.boxShadow);
      if (hasAccentRing) {
        d.style.position = d.style.position || 'relative';
        d.classList.add('tlm-selected-pulse');
        // Pull the actual accent color out of the borderColor or boxShadow
        const m =
          (s.borderColor && s.borderColor.match(/#[0-9a-f]{3,6}|oklch\([^)]+\)|rgb[a]?\([^)]+\)/i)) ||
          (s.boxShadow && s.boxShadow.match(/#[0-9a-f]{3,6}|oklch\([^)]+\)|rgb[a]?\([^)]+\)/i));
        if (m) d.style.setProperty('--tlm-accent', m[0]);
      }
    });

    // 8. Phone-input cursor: find the span with borderRight (the caret-
    //    looking element in S02_Phone) and animate it.
    artboard.querySelectorAll('span').forEach((sp) => {
      if (sp.style.borderRight && /2px solid/.test(sp.style.borderRight)) {
        sp.classList.add('tlm-cursor');
      }
    });
    // Underscore placeholders next to the caret.
    artboard.querySelectorAll('span').forEach((sp) => {
      if (sp.textContent === '__' || sp.textContent === '_') {
        sp.classList.add('tlm-underscore');
      }
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Observer: when an artboard intersects the viewport, replay entrance.
  // (In design-canvas the user scrolls/pans rather than scrolling the
  //  document — IntersectionObserver still fires on initial layout, and
  //  we replay when they pan a screen back into view.)
  // ─────────────────────────────────────────────────────────────────
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const el = e.target;
        if (e.isIntersecting && e.intersectionRatio > 0.15) {
          if (!el.classList.contains('tlm-in')) {
            el.classList.add('tlm-in');
          }
        }
        // We deliberately don't strip tlm-in on exit — once seen, stay alive.
      });
    },
    { threshold: [0, 0.15, 0.4], rootMargin: '0px 0px -10% 0px' }
  );

  const tracked = new WeakSet();
  function scan() {
    document.querySelectorAll('[data-screen-label]').forEach((el) => {
      if (tracked.has(el)) return;
      tracked.add(el);
      enhance(el);
      io.observe(el);
    });
  }

  // Initial scan once React mounts.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scan);
  } else {
    scan();
  }
  // Re-scan on subtree changes (theme tweaks remount the canvas).
  const mo = new MutationObserver(() => {
    // Throttle: only do work once per microtask burst.
    if (mo.__pending) return;
    mo.__pending = true;
    queueMicrotask(() => {
      mo.__pending = false;
      scan();
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
