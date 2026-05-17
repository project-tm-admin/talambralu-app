// Screens 17–18: Matches list (post-onboarding) and Match detail
// Matrimony tone — serif headings, sandalwood ink, no dating-style swipe.

// 17 — Matches home (replaces dating "swipe" with curated daily matches)
function S17_Matches() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 14px', display: 'flex',
        alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
            textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 4,
          }}>Tuesday · May 5</div>
          <div style={{ fontFamily: TLM_FONT.display, fontSize: 28,
            lineHeight: 1.05, letterSpacing: '-0.015em' }}>
            Namaste, Anika
          </div>
          <div style={{ fontSize: 13, color: TLM.ink2, marginTop: 4 }}>
            12 new matches handpicked for you today
          </div>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 100, background: TLM.surface,
          border: `1px solid ${TLM.hair}`, display: 'flex',
          alignItems: 'center', justifyContent: 'center', position: 'relative',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 14V8a5 5 0 0110 0v6M2.5 14h13M7.5 16.5h3"
              stroke={TLM.ink} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <div style={{
            position: 'absolute', top: 8, right: 9, width: 7, height: 7,
            borderRadius: 100, background: TLM.accent,
            border: `1.5px solid ${TLM.surface}`,
          }}/>
        </div>
      </div>

      {/* Filters moved to profile/preferences */}

      {/* Section: Today's introductions (curated, not infinite swipe) */}
      <div style={{ padding: '6px 20px 10px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: TLM_FONT.display, fontSize: 18,
          letterSpacing: '-0.01em' }}>Today's introductions</div>
        <div style={{ fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
          textTransform: 'uppercase', letterSpacing: '0.1em' }}>1 of 5</div>
      </div>

      {/* Featured match card */}
      <div style={{ padding: '0 20px', flex: 1, overflow: 'hidden' }}>
        <FeaturedMatch/>
      </div>

      {/* Page indicator */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '14px 0 4px',
      }}>
        {[true, false, false, false, false].map((on, i) => (
          <div key={i} style={{
            width: on ? 18 : 6, height: 6, borderRadius: 100,
            background: on ? TLM.ink : TLM.hair2,
            transition: 'all 0.2s',
          }}/>
        ))}
      </div>

      {/* Daily matches CTA + bottom nav handled by parent device */}
      <div style={{
        margin: '8px 20px 12px', padding: '12px 14px', borderRadius: 14,
        background: TLM.accentSoft, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, background: TLM.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3.5" width="12" height="10" rx="1.5"
              stroke={TLM.accentInk} strokeWidth="1.2"/>
            <path d="M5 1.5v3M11 1.5v3M2 7h12" stroke={TLM.accentInk}
              strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: TLM.accentInk }}>
            7 more for tomorrow
          </div>
          <div style={{ fontSize: 11, color: TLM.accentInk, opacity: 0.75 }}>
            New matches arrive at 8am every morning
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M5 3l4 4-4 4" stroke={TLM.accentInk} strokeWidth="1.4"
            fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Bottom tab bar */}
      <BottomTabs active="matches"/>
    </div>
  );
}

function VerifyDot() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12">
      <circle cx="6" cy="6" r="5.5" fill={TLM.verify}/>
      <path d="M3.5 6L5.2 7.7 8.5 4.4" stroke="white" strokeWidth="1.4"
        strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

function FeaturedMatch() {
  return (
    <div style={{
      background: TLM.surface, borderRadius: 22,
      border: `1px solid ${TLM.hair}`, overflow: 'hidden',
      display: 'flex', flexDirection: 'column', height: '100%',
    }}>
      {/* photo with badges */}
      <div style={{ position: 'relative', height: window.TLM_PHOTO_H || 380 }}>
        <PhotoPlaceholder label="Anjali · saree portrait" height="100%" tone="warm"/>
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '5px 9px 5px 7px', borderRadius: 100,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <VerifyDot/>
          <span style={{ fontFamily: TLM_FONT.mono, fontSize: 10,
            color: TLM.verify, fontWeight: 600, letterSpacing: '0.04em' }}>
            ID + FACE VERIFIED
          </span>
        </div>
        <div style={{
          position: 'absolute', bottom: 12, left: 12,
          padding: '4px 9px', borderRadius: 100,
          background: 'rgba(42,39,35,0.55)', backdropFilter: 'blur(6px)',
          color: 'white', fontSize: 11, display: 'flex',
          alignItems: 'center', gap: 5,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <rect x="1" y="2" width="8" height="6" rx="1" stroke="white" strokeWidth="1.1"/>
            <circle cx="5" cy="5" r="1.4" fill="white"/>
          </svg>
          5 photos
        </div>
      </div>

      {/* details */}
      <div style={{ padding: '14px 16px 10px', flex: 1,
        display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8,
          marginBottom: 2 }}>
          <div style={{ fontFamily: TLM_FONT.display, fontSize: 24,
            letterSpacing: '-0.01em' }}>Anjali R., 28</div>
        </div>
        <div style={{ fontSize: 12, color: TLM.mute, marginBottom: 12 }}>
          Dallas, TX · Krishna District
        </div>

        {/* Highlighted key details — what families look for first */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 8, marginBottom: 10,
        }}>
          <KeyStat label="Height" value="5'6&quot;"/>
          <KeyStat label="Religion" value="Hindu · Kamma"/>
          <KeyStat label="Income" value="$185K / yr"/>
          <KeyStat label="Complexion" value="Wheatish"/>
        </div>

        {/* More details collapsed */}
        <button style={{
          background: 'transparent', border: 'none', padding: '6px 0',
          fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.ink2,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
        }}>
          More about Anjali
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 3.5l3 3 3-3" stroke={TLM.ink2} strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Why this match */}
        <div style={{
          padding: '10px 12px', borderRadius: 12,
          background: TLM.field, marginTop: 'auto',
        }}>
          <div style={{
            fontFamily: TLM_FONT.mono, fontSize: 9.5, color: TLM.mute,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <RiceGrain size={5}/> Why we matched you
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px',
            fontSize: 11.5, color: TLM.ink,
          }}>
            <Reason>Same mother tongue</Reason>
            <Reason>Both H-1B → GC path</Reason>
            <Reason>Diet aligned</Reason>
            <Reason>Family in Krishna dist.</Reason>
          </div>
        </div>
      </div>

      {/* Action row — icon-led matrimony actions */}
      <div style={{
        display: 'flex', borderTop: `1px solid ${TLM.hair}`,
      }}>
        <Action kind="pass" label="Pass"/>
        <Action kind="shortlist" label="Save" middle/>
        <Action kind="interest" label="Interested" primary/>
      </div>
    </div>
  );
}

function Icon({ kind }) {
  const c = TLM.ink2;
  if (kind === 'briefcase') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="4.5" width="10" height="7" rx="1.2" stroke={c} strokeWidth="1.2"/>
      <path d="M5.5 4.5V3.5A1 1 0 016.5 2.5h1A1 1 0 018.5 3.5V4.5" stroke={c} strokeWidth="1.2"/>
    </svg>
  );
  if (kind === 'cap') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 6l6-3 6 3-6 3-6-3z" stroke={c} strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M3.5 7.5v3c0 .8 1.6 1.5 3.5 1.5s3.5-.7 3.5-1.5v-3" stroke={c} strokeWidth="1.2"/>
    </svg>
  );
  if (kind === 'om') return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke={c} strokeWidth="1.2"/>
      <path d="M7 4v6M4 7h6" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
  return null;
}

function Tag({ children }) {
  return (
    <span style={{
      padding: '4px 10px', borderRadius: 100,
      border: `1px solid ${TLM.hair2}`, fontSize: 11,
      color: TLM.ink2, background: TLM.surface,
    }}>{children}</span>
  );
}

function Reason({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
      <svg width="11" height="11" viewBox="0 0 12 12" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M2.5 6L5 8.5l4.5-5.5" stroke={TLM.verify} strokeWidth="1.6"
          fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span>{children}</span>
    </div>
  );
}

function Action({ kind, label, primary, middle }) {
  // Filled, colored icons matching reference: red X, gold star, pink heart
  const colors = {
    pass:      { stroke: 'oklch(0.62 0.20 25)',  bg: 'oklch(0.96 0.03 25)' },   // coral red
    shortlist: { stroke: 'oklch(0.78 0.16 80)',  bg: 'oklch(0.97 0.05 80)' },   // gold
    interest:  { stroke: 'oklch(0.65 0.20 0)',   bg: 'oklch(0.96 0.04 0)' },    // pink
  }[kind];

  const icon = {
    pass: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M6 6l12 12M18 6L6 18" stroke={colors.stroke} strokeWidth="2.6"
          strokeLinecap="round"/>
      </svg>
    ),
    shortlist: (
      // Filled 5-point star
      <svg width="22" height="22" viewBox="0 0 24 24" fill={colors.stroke}>
        <path d="M12 2.5l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.7 5.9 21.1l1.4-6.8L2.2 9.6l6.9-.8z"/>
      </svg>
    ),
    interest: (
      // Filled heart
      <svg width="22" height="22" viewBox="0 0 24 24" fill={colors.stroke}>
        <path d="M12 21s-7.5-4.6-9.5-9.4C1 7.8 3.7 4 7.4 4c2 0 3.6 1 4.6 2.5C13 5 14.6 4 16.6 4 20.3 4 23 7.8 21.5 11.6 19.5 16.4 12 21 12 21z"/>
      </svg>
    ),
  }[kind];

  return (
    <div style={{
      flex: 1, padding: '14px 8px 14px', textAlign: 'center',
      borderLeft: middle || primary ? `1px solid ${TLM.hair}` : 'none',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      cursor: 'pointer',
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 100,
        background: colors.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</div>
      <div style={{
        fontSize: 12, color: TLM.ink2, fontWeight: 500,
      }}>{label}</div>
    </div>
  );
}

function BottomTabs({ active = 'home' }) {
  const tabs = [
    ['home', 'Home', 'M3 10l7-6 7 6v8H3z'],
    ['discover', 'Discover', 'M10 4a6 6 0 100 12 6 6 0 000-12zm5 11l3 3'],
    ['matches', 'Matches', 'M10 16l-7-7a4 4 0 015.5-5.8L10 5l1.5-1.8A4 4 0 0117 9z'],
    ['inbox', 'Inbox', 'M3 5h14v9H6l-3 3z'],
    ['profile', 'Profile', 'M10 11a3 3 0 100-6 3 3 0 000 6zm-6 7a6 6 0 0112 0'],
  ];
  return (
    <div style={{
      borderTop: `1px solid ${TLM.hair}`, background: TLM.bg,
      padding: '8px 8px 0', display: 'flex',
    }}>
      {tabs.map(([id, label, d]) => {
        const on = active === id;
        return (
          <div key={id} style={{
            flex: 1, padding: '6px 0 4px', textAlign: 'center',
            color: on ? TLM.ink : TLM.mute,
          }}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none"
              style={{ margin: '0 auto', display: 'block' }}>
              <path d={d} stroke={on ? TLM.ink : TLM.mute}
                strokeWidth={on ? 1.7 : 1.4}
                fill={on && id === 'matches' ? TLM.accent : 'none'}
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div style={{ fontSize: 10, marginTop: 3,
              fontWeight: on ? 600 : 400 }}>{label}</div>
          </div>
        );
      })}
    </div>
  );
}

// 18 — Match detail (full-page profile view)
function S18_MatchDetail() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero photo */}
      <div style={{ position: 'relative', height: 380, flexShrink: 0 }}>
        <PhotoPlaceholder label="Anjali · portrait" height="100%" tone="warm"/>
        {/* top bar */}
        <div style={{
          position: 'absolute', top: 56, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <CircleBtn>
            <path d="M12 4l-6 6 6 6" stroke={TLM.ink} strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </CircleBtn>
          <div style={{ display: 'flex', gap: 8 }}>
            <CircleBtn>
              <path d="M10 3v9M7 9l3 3 3-3M5 14v2a1 1 0 001 1h8a1 1 0 001-1v-2"
                stroke={TLM.ink} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </CircleBtn>
            <CircleBtn>
              <circle cx="10" cy="5" r="1.4" fill={TLM.ink}/>
              <circle cx="10" cy="10" r="1.4" fill={TLM.ink}/>
              <circle cx="10" cy="15" r="1.4" fill={TLM.ink}/>
            </CircleBtn>
          </div>
        </div>
        {/* photo dots */}
        <div style={{
          position: 'absolute', bottom: 14, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 4,
        }}>
          {[true, false, false, false, false].map((on, i) => (
            <div key={i} style={{
              width: on ? 18 : 5, height: 5, borderRadius: 100,
              background: on ? 'white' : 'rgba(255,255,255,0.55)',
            }}/>
          ))}
        </div>
      </div>

      {/* Scroll content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 28,
              letterSpacing: '-0.015em', display: 'flex', alignItems: 'center', gap: 8 }}>
              Anjali Reddy, 28
              <VerifyDot/>
            </div>
            <div style={{ fontSize: 13, color: TLM.mute, marginTop: 2 }}>
              5'6" · Dallas, TX · Active 2h ago
            </div>
          </div>
          <div style={{
            padding: '5px 9px', borderRadius: 100, background: TLM.accentSoft,
            fontFamily: TLM_FONT.mono, fontSize: 11, color: TLM.accentInk,
            fontWeight: 600, letterSpacing: '0.04em',
          }}>87%</div>
        </div>

        {/* About prompt */}
        <div style={{
          marginTop: 16, padding: 16, borderRadius: 16,
          background: TLM.surface, border: `1px solid ${TLM.hair}`,
        }}>
          <div style={{
            fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8,
          }}>What "home" means to me</div>
          <div style={{ fontFamily: TLM_FONT.display, fontStyle: 'italic',
            fontSize: 17, lineHeight: 1.35, color: TLM.ink }}>
            Sunday filter coffee, my mom's voice on speakerphone, and the smell
            of tadka somewhere in the building.
          </div>
        </div>

        {/* Voice intro */}
        <div style={{
          marginTop: 10, padding: 14, borderRadius: 16,
          background: TLM.surface, border: `1px solid ${TLM.hair}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 100, background: TLM.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="white">
              <path d="M3 2l7 4-7 4z"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
              Voice intro · 0:24
            </div>
            <div style={{ display: 'flex', gap: 2, alignItems: 'center', height: 14 }}>
              {[6,10,12,8,11,14,9,6,11,13,8,5,10,13,9,6,12,8,5,10,7,4,9,11,7,5,9,12]
                .map((h,i) => (
                <div key={i} style={{
                  width: 2, height: h, borderRadius: 2,
                  background: TLM.hair2,
                }}/>
              ))}
            </div>
          </div>
        </div>

        {/* Key facts grid */}
        <div style={{ marginTop: 18 }}>
          <SectionHd>The basics</SectionHd>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          }}>
            <Fact label="Profession" value="Senior SWE · Amazon"/>
            <Fact label="Education" value="MS CS · UT Dallas"/>
            <Fact label="Visa" value="H-1B · I-140" verified/>
            <Fact label="Income" value="$200K – $250K"/>
            <Fact label="Religion" value="Hindu"/>
            <Fact label="Sub-caste" value="Kamma"/>
            <Fact label="Gothram" value="Bharadwaja"/>
            <Fact label="Star" value="Rohini · Pada 2"/>
          </div>
        </div>

        {/* Family */}
        <div style={{ marginTop: 22 }}>
          <SectionHd>Family</SectionHd>
          <div style={{
            padding: 14, borderRadius: 16,
            background: TLM.surface, border: `1px solid ${TLM.hair}`,
            fontSize: 13, color: TLM.ink2, lineHeight: 1.55,
          }}>
            Father, Civil engineer (retd.) · Mother, Homemaker · 1 elder sister
            (married, Hyderabad). Family lives in Vijayawada.
          </div>
        </div>

        <div style={{ height: 110 }}/>
      </div>

      {/* Sticky action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: `linear-gradient(to top, ${TLM.bg} 60%, transparent)`,
        padding: '14px 20px 30px',
      }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{
            width: 56, height: 56, borderRadius: 16, border: `1px solid ${TLM.hair2}`,
            background: TLM.surface, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5l-10 10" stroke={TLM.ink2}
                strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </button>
          <button style={{
            width: 56, height: 56, borderRadius: 16, border: `1px solid ${TLM.hair2}`,
            background: TLM.surface, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 3l5 4 5-4v14l-5-4-5 4z" stroke={TLM.ink}
                strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
          <button style={{
            flex: 1, height: 56, borderRadius: 16, border: 'none',
            background: TLM.ink, color: TLM.bg,
            fontFamily: TLM_FONT.ui, fontSize: 15, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
          }}>
            Send interest
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke={TLM.bg} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function CircleBtn({ children }) {
  return (
    <div style={{
      width: 36, height: 36, borderRadius: 100,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="20" height="20" viewBox="0 0 20 20">{children}</svg>
    </div>
  );
}

function SectionHd({ children }) {
  return (
    <div style={{
      fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
      textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10,
    }}>{children}</div>
  );
}

function Fact({ label, value, verified }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 12,
      background: TLM.surface, border: `1px solid ${TLM.hair}`,
    }}>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 9, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3,
      }}>{label}</div>
      <div style={{ fontSize: 13, color: TLM.ink, fontWeight: 500,
        display: 'flex', alignItems: 'center', gap: 5 }}>
        {value}
        {verified && <VerifyDot/>}
      </div>
    </div>
  );
}

Object.assign(window, { S17_Matches, S18_MatchDetail });

function KeyStat({ label, value }) {
  return (
    <div style={{
      padding: '8px 12px', borderRadius: 12,
      background: TLM.field, border: `1px solid ${TLM.hair}`,
    }}>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 9, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2,
      }}>{label}</div>
      <div style={{ fontSize: 14, color: TLM.ink, fontWeight: 500,
        letterSpacing: '-0.005em' }}>
        {value}
      </div>
    </div>
  );
}

Object.assign(window, { KeyStat });
