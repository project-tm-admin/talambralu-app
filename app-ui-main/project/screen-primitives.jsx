// Shared screen primitives for Talambralu onboarding
// Loaded into window for cross-file React Babel scopes.

const TLM = {
  // Jasmine white + temple stone palette
  bg: '#FBF8F3',
  surface: '#FFFFFF',
  ink: '#2A2723',
  ink2: '#5C564F',
  mute: '#8C8579',
  hair: 'rgba(42,39,35,0.08)',
  hair2: 'rgba(42,39,35,0.14)',
  field: '#F2EDE4',
  // single accent — kumkuma
  accent: 'oklch(0.55 0.14 30)',
  accentSoft: 'oklch(0.92 0.04 30)',
  accentInk: 'oklch(0.38 0.13 30)',
  // verification green (sparingly)
  verify: 'oklch(0.55 0.10 145)',
  verifySoft: 'oklch(0.94 0.04 145)'
};

const TLM_FONT = {
  display: `"Instrument Serif", "Cormorant Garamond", Georgia, serif`,
  ui: `"Geist", -apple-system, BlinkMacSystemFont, sans-serif`,
  mono: `"Geist Mono", "JetBrains Mono", ui-monospace, monospace`,
  telugu: `"Noto Serif Telugu", "Instrument Serif", serif`
};

// ── Screen shell ────────────────────────────────────────────────
function Screen({ children, pad = 24, bg = TLM.bg, hideHome = false }) {
  return (
    <div style={{
      width: '100%', height: '100%', background: bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      padding: `64px ${pad}px ${hideHome ? 24 : 40}px`,
      boxSizing: 'border-box', position: 'relative',
      letterSpacing: '-0.005em'
    }}>
      {children}
    </div>);

}

// Stepper: dots indicating progress through 16 screens
function Stepper({ step, total = 16 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
      <div style={{
        flex: 1, height: 3, borderRadius: 2, background: TLM.hair,
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${step / total * 100}%`,
          background: TLM.ink, borderRadius: 2
        }} />
      </div>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 11, color: TLM.mute,
        fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em'
      }}>{String(step).padStart(2, '0')}/{total}</div>
    </div>);

}

// Top bar with back arrow + skip
function TopBar({ onBack = true, skip = false, label }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 24, height: 24
    }}>
      <div style={{ width: 28, display: 'flex', alignItems: 'center' }}>
        {onBack &&
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke={TLM.ink} strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        }
      </div>
      {label && <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 11, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.12em'
      }}>{label}</div>}
      <div style={{ width: 28, textAlign: 'right' }}>
        {skip && <span style={{ fontSize: 14, color: TLM.mute }}>Skip</span>}
      </div>
    </div>);

}

function Title({ children, size = 32, mb = 8 }) {
  return (
    <h1 style={{
      fontFamily: TLM_FONT.display, fontWeight: 400,
      fontSize: size, lineHeight: 1.05, letterSpacing: '-0.02em',
      color: TLM.ink, margin: 0, marginBottom: mb, textWrap: 'pretty'
    }}>{children}</h1>);

}

function Sub({ children, mb = 32 }) {
  return (
    <p style={{
      fontSize: 15, lineHeight: 1.45, color: TLM.ink2,
      margin: 0, marginBottom: mb, textWrap: 'pretty'
    }}>{children}</p>);

}

// Primary CTA — kumkuma accent
function Primary({ children, disabled = false, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 56, borderRadius: 16, border: 'none',
      background: disabled ? TLM.field : TLM.accent, color: disabled ? TLM.mute : '#FFFFFF',
      fontFamily: TLM_FONT.ui, fontSize: 16, fontWeight: 500,
      letterSpacing: '-0.005em', cursor: disabled ? 'default' : 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
    }}>{children}</button>);

}

function Ghost({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 52, borderRadius: 14,
      background: 'transparent', border: `1px solid ${TLM.hair2}`,
      color: TLM.ink, fontFamily: TLM_FONT.ui, fontSize: 15, fontWeight: 500,
      cursor: 'pointer'
    }}>{children}</button>);

}

// Field with floating label
function Field({ label, value, placeholder, mono = false, suffix }) {
  return (
    <div style={{
      background: TLM.surface, border: `1px solid ${TLM.hair}`,
      borderRadius: 16, padding: '12px 16px', position: 'relative'
    }}>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4
      }}>{label}</div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'
      }}>
        <div style={{
          fontFamily: mono ? TLM_FONT.mono : TLM_FONT.ui,
          fontSize: 17, color: value ? TLM.ink : TLM.mute, fontWeight: 400
        }}>{value || placeholder}</div>
        {suffix && <div style={{ fontSize: 13, color: TLM.mute }}>{suffix}</div>}
      </div>
    </div>);

}

// Chip selectable
function Chip({ children, selected = false, icon, size = 'md' }) {
  const pad = size === 'sm' ? '8px 14px' : '12px 18px';
  const fs = size === 'sm' ? 13 : 14;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: pad, borderRadius: 100,
      background: selected ? TLM.accent : TLM.surface,
      color: selected ? '#FFFFFF' : TLM.ink,
      border: `1px solid ${selected ? TLM.accent : TLM.hair2}`,
      fontSize: fs, fontWeight: 500, fontFamily: TLM_FONT.ui,
      cursor: 'pointer', whiteSpace: 'nowrap'
    }}>
      {icon}
      {children}
    </div>);

}

// Selectable card row
function CardRow({ title, sub, selected = false, badge, leading, trailing }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px', borderRadius: 16,
      background: TLM.surface,
      border: `1px solid ${selected ? TLM.accent : TLM.hair}`,
      boxShadow: selected ? `0 0 0 1px ${TLM.accent}` : 'none'
    }}>
      {leading}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 15, fontWeight: 500, color: TLM.ink
        }}>
          {title}
          {badge}
        </div>
        {sub && <div style={{ fontSize: 13, color: TLM.mute, marginTop: 2 }}>{sub}</div>}
      </div>
      {trailing}
      {!trailing &&
      <div style={{
        width: 22, height: 22, borderRadius: 100,
        border: `1.5px solid ${selected ? TLM.accent : TLM.hair2}`,
        background: selected ? TLM.accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
          {selected &&
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6.5L5 9l4.5-5.5" stroke="#FFFFFF" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        }
        </div>
      }
    </div>);

}

// Verified badge — green check pill
function VerifyBadge({ kind = 'H1B' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px 3px 6px', borderRadius: 100,
      background: TLM.verifySoft,
      color: TLM.verify, fontSize: 10.5, fontWeight: 600,
      fontFamily: TLM_FONT.mono, letterSpacing: '0.04em'
    }}>
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5.5" fill={TLM.verify} />
        <path d="M3.5 6L5.2 7.7 8.5 4.4" stroke="white" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {kind}
    </span>);

}

// Talambralu rice-grain motif — small SVG. Used sparingly.
function RiceGrain({ size = 6, color }) {
  return (
    <svg width={size} height={size * 1.6} viewBox="0 0 6 10" style={{ display: 'block' }}>
      <ellipse cx="3" cy="5" rx="2" ry="4.5" fill={color || TLM.accent} />
    </svg>);

}

// Decorative rice-grain scatter (top corner accent)
function RiceScatter({ count = 14, color }) {
  // deterministic seeds so screens look consistent
  const seeds = [
  [10, 20, 24], [35, 8, -15], [62, 26, 40], [88, 14, 70],
  [120, 30, 10], [22, 50, -30], [48, 64, 55], [78, 52, -10],
  [110, 70, 25], [140, 40, 80], [6, 84, 5], [38, 96, -45],
  [70, 90, 35], [100, 100, -20]].
  slice(0, count);
  return (
    <svg width="160" height="120" viewBox="0 0 160 120" style={{ pointerEvents: 'none' }}>
      {seeds.map(([x, y, r], i) =>
      <ellipse key={i} cx={x} cy={y} rx="1.6" ry="3.6"
      fill={color || TLM.accent}
      transform={`rotate(${r} ${x} ${y})`} opacity={0.7 + i % 3 * 0.1} />
      )}
    </svg>);

}

// Initials placeholder for an avatar
function Avatar({ initials = 'AT', size = 64, ring = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 100,
      background: TLM.field, color: TLM.ink2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: TLM_FONT.display, fontSize: size * 0.42, letterSpacing: '0.02em',
      border: ring ? `2px solid ${TLM.accent}` : 'none',
      boxShadow: ring ? `0 0 0 2px ${TLM.bg}, 0 0 0 3px ${TLM.accent}` : 'none'
    }}>{initials}</div>);

}

// Image placeholder. Real-photo pool is rotated by hashing the label,
// so the same person appears consistently across screens.
const TLM_PHOTO_POOL = [
'assets/portrait-anjali.png'];

function _hashIdx(s, n) {
  let h = 0;
  for (let i = 0; i < (s || '').length; i++) h = h * 31 + s.charCodeAt(i) | 0;
  return Math.abs(h) % n;
}
function PhotoPlaceholder({ label = 'Portrait', height = 160, width = '100%', tone = 'warm', src, fit = 'cover', position = 'center top' }) {
  const stripeA = tone === 'warm' ? '#EFE7D7' : '#E6E3DD';
  const stripeB = tone === 'warm' ? '#E5DAC4' : '#D9D5CD';
  const useSrc = src || (TLM_PHOTO_POOL.length ?
  TLM_PHOTO_POOL[_hashIdx(label, TLM_PHOTO_POOL.length)] :
  null);
  if (useSrc) {
    return (
      <div style={{
        width, height, overflow: 'hidden',
        background: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px)`
      }}>
        <img src={useSrc} alt={label} style={{ ...{

            objectFit: fit, objectPosition: position, display: 'block', height: "420px", width: "250px"
          }, objectFit: "cover", width: "300px" }} />
      </div>);

  }
  return (
    <div style={{
      width, height, borderRadius: 14, overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${stripeA} 0 8px, ${stripeB} 8px 16px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: TLM.ink2, fontFamily: TLM_FONT.mono, fontSize: 10,
      letterSpacing: '0.12em', textTransform: 'uppercase',
      border: `1px solid ${TLM.hair}`
    }}>{label}</div>);

}

Object.assign(window, {
  TLM, TLM_FONT, Screen, Stepper, TopBar, Title, Sub,
  Primary, Ghost, Field, Chip, CardRow, VerifyBadge,
  RiceGrain, RiceScatter, Avatar, PhotoPlaceholder
});