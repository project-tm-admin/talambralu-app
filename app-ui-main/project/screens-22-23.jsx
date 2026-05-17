// Search & Discovery — browse, filter, save searches.
// Two screens: 22 main feed, 23 filter sheet.

function S22_Search() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: TLM_FONT.display, fontSize: 26,
          letterSpacing: '-0.015em' }}>Discover</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <SqIcon><path d="M3 5h12M5 9h8M7 13h4" stroke={TLM.ink}
            strokeWidth="1.4" strokeLinecap="round"/></SqIcon>
          <SqIcon dot>
            <path d="M9 2v2m0 12v-2M2 9h2m12 0h-2M4.2 4.2l1.4 1.4m6.8 6.8l1.4 1.4M4.2 13.8l1.4-1.4m6.8-6.8l1.4-1.4"
              stroke={TLM.ink} strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="2.5" stroke={TLM.ink} strokeWidth="1.4" fill="none"/>
          </SqIcon>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 20px 10px' }}>
        <div style={{
          height: 44, borderRadius: 12, background: TLM.field,
          border: `1px solid ${TLM.hair}`, padding: '0 14px',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke={TLM.ink2} strokeWidth="1.3"/>
            <path d="M9 9l3 3" stroke={TLM.ink2} strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 14, color: TLM.mute, flex: 1 }}>
            Search by name, city, college…
          </span>
          <span style={{
            fontFamily: TLM_FONT.mono, fontSize: 9.5, color: TLM.mute,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '3px 7px', borderRadius: 6,
            border: `0.5px solid ${TLM.hair2}`,
          }}>⌘ K</span>
        </div>
      </div>

      {/* Quick-filter chips — horizontal scroll */}
      <div style={{
        display: 'flex', gap: 7, padding: '2px 20px 12px',
        overflowX: 'auto',
      }}>
        <FilterChip active count={12}>All filters</FilterChip>
        <FilterChip dot>Verified</FilterChip>
        <FilterChip>USA only</FilterChip>
        <FilterChip>Telugu</FilterChip>
        <FilterChip>Premium</FilterChip>
        <FilterChip>Family-managed</FilterChip>
        <FilterChip>Recently active</FilterChip>
      </div>

      {/* Saved search bar */}
      <div style={{
        margin: '0 20px 12px', padding: '10px 12px',
        borderRadius: 12, background: TLM.surface,
        border: `1px solid ${TLM.hair}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: TLM.field,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M3.5 2h7v10l-3.5-2-3.5 2V2z" stroke={TLM.accent}
              strokeWidth="1.3" strokeLinejoin="round" fill={TLM.accent} fillOpacity="0.15"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: TLM.ink,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Hindu · Kamma · 27–32 · Bay Area
          </div>
          <div style={{ fontSize: 10.5, color: TLM.mute, marginTop: 1 }}>
            Saved search · 4 new this week
          </div>
        </div>
        <button style={{
          fontFamily: TLM_FONT.mono, fontSize: 9.5,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '6px 10px', borderRadius: 100,
          background: 'transparent', border: `0.5px solid ${TLM.hair2}`,
          color: TLM.ink, cursor: 'pointer',
        }}>Alert ON</button>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden',
        paddingBottom: 8 }}>

        {/* Highly compatible — featured row */}
        <Section title="Highly compatible" sub="Top picks based on your preferences">
          <HRail>
            <FeaturedCard name="Anjali R., 28" city="Dallas, TX"
              tag="92% compatible" tagAccent verified premium/>
            <FeaturedCard name="Sneha P., 27" city="Sunnyvale, CA"
              tag="89% compatible" tagAccent verified/>
            <FeaturedCard name="Divya N., 29" city="Edison, NJ"
              tag="86% compatible" tagAccent verified/>
          </HRail>
        </Section>

        {/* Quick browse — swipe-like stack hint */}
        <Section title="Quick browse" sub="Two-tap pass / save / interest"
          action="Open">
          <div style={{ padding: '0 20px' }}>
            <QuickBrowseStack/>
          </div>
        </Section>

        {/* Recently joined */}
        <Section title="Recently joined" sub="New profiles this week">
          <HRail>
            <MiniCard name="Kavya, 26" city="Austin, TX" badge="NEW" verified/>
            <MiniCard name="Meera, 28" city="Seattle, WA" badge="NEW"/>
            <MiniCard name="Lasya, 27" city="Chicago, IL" badge="NEW" verified/>
            <MiniCard name="Sireesha, 29" city="Boston, MA" badge="NEW"/>
          </HRail>
        </Section>

        {/* Recently active */}
        <Section title="Active now" sub="Online in the last 24 hours">
          <HRail>
            <MiniCard name="Pranavi, 28" city="Plano, TX" online verified/>
            <MiniCard name="Harini, 27" city="Fremont, CA" online/>
            <MiniCard name="Sruthi, 30" city="Atlanta, GA" online verified premium/>
          </HRail>
        </Section>

        {/* Family-managed profiles */}
        <Section title="Family-managed" sub="Profiles managed by parents or siblings">
          <HRail>
            <MiniCard name="Riya, 26" city="Houston, TX" managed verified/>
            <MiniCard name="Tanvi, 28" city="Iselin, NJ" managed/>
            <MiniCard name="Sahithi, 27" city="Cary, NC" managed verified/>
          </HRail>
        </Section>

        {/* Saved searches grid */}
        <Section title="Your saved searches" action="Manage">
          <div style={{ padding: '0 20px',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <SavedSearch query="Hindu · Kamma · 27–32" loc="Bay Area" alerts count={48}/>
            <SavedSearch query="MS+ · Vegetarian · GC" loc="Dallas / Austin" alerts={false} count={22}/>
            <SavedSearch query="Reddy · 26–30" loc="NJ / NY" alerts count={31}/>
            <SavedSearch query="Doctor · Telugu" loc="Anywhere USA" alerts={false} count={9}/>
          </div>
        </Section>

        <div style={{ height: 24 }}/>
      </div>

      {/* Bottom tabs */}
      <BottomTabs active="search"/>
    </div>
  );
}

// 23 — Filter sheet (modal)
function S23_Filters() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${TLM.hair}` }}>
        <button style={{ background: 'transparent', border: 'none',
          fontSize: 14, color: TLM.ink, cursor: 'pointer' }}>Cancel</button>
        <div style={{ fontFamily: TLM_FONT.display, fontSize: 18 }}>Filters</div>
        <button style={{ background: 'transparent', border: 'none',
          fontSize: 13, fontWeight: 500, color: TLM.accent, cursor: 'pointer' }}>Reset</button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <FilterGroup title="Quality">
          <ToggleRow label="Verified profiles only" sub="ID + face verified" on/>
          <ToggleRow label="USA-based only" sub="Currently living in the United States" on/>
          <ToggleRow label="Telugu only" sub="Mother tongue or fluent" on/>
          <ToggleRow label="Premium profiles" sub="Showcase listings" on={false}/>
          <ToggleRow label="Family-managed" sub="Profiles run by family member" on={false}/>
        </FilterGroup>

        <FilterGroup title="Age">
          <RangeRow label="Age range" lo={27} hi={32} min={21} max={45}/>
        </FilterGroup>

        <FilterGroup title="Religion & community">
          <ChipGroup label="Religion" values={['Hindu']}
            options={['Hindu', 'Christian', 'Muslim', 'Sikh', 'Jain', 'Other']}/>
          <ChipGroup label="Caste / sub-caste" values={['Kamma', 'Reddy']}
            options={['Kamma', 'Reddy', 'Brahmin', 'Kapu', 'Velama', 'Any']}/>
          <ChipGroup label="Gothram" values={['Any']}
            options={['Bharadwaja', 'Kashyapa', 'Vasishta', 'Any']}/>
        </FilterGroup>

        <FilterGroup title="Location & visa">
          <ChipGroup label="State" values={['CA', 'TX']}
            options={['CA', 'TX', 'NY', 'NJ', 'WA', 'IL', 'MA', 'GA']}/>
          <ChipGroup label="Visa status" values={['H-1B', 'GC', 'Citizen']}
            options={['H-1B', 'L1/L2', 'GC', 'Citizen', 'F-1/OPT']}/>
        </FilterGroup>

        <FilterGroup title="Education & profession">
          <ChipGroup label="Education" values={['MS+']}
            options={['Bachelors', 'MS+', 'PhD', 'MBA', 'MD']}/>
          <ChipGroup label="Profession" values={['Tech', 'Medicine']}
            options={['Tech', 'Medicine', 'Finance', 'Law', 'Academia', 'Other']}/>
        </FilterGroup>

        <FilterGroup title="Lifestyle">
          <ChipGroup label="Diet" values={['Vegetarian']}
            options={['Vegetarian', 'Eggetarian', 'Non-veg', 'Vegan']}/>
          <ChipGroup label="Marital status" values={['Never married']}
            options={['Never married', 'Divorced', 'Widowed']}/>
        </FilterGroup>

        <div style={{ padding: '14px 20px 24px' }}>
          <button style={{
            width: '100%', padding: '10px 14px', borderRadius: 12,
            background: 'transparent', border: `1px dashed ${TLM.hair2}`,
            fontSize: 13, color: TLM.ink, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 2h7v10l-3.5-2-3.5 2V2z" stroke={TLM.ink}
                strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
            Save this search · Get alerts
          </button>
        </div>
      </div>

      {/* Sticky footer */}
      <div style={{
        padding: '12px 20px 20px',
        borderTop: `1px solid ${TLM.hair}`,
        background: TLM.bg,
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: TLM_FONT.mono, fontSize: 9.5,
            color: TLM.mute, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Matches
          </div>
          <div style={{ fontFamily: TLM_FONT.display, fontSize: 22 }}>
            142 results
          </div>
        </div>
        <button style={{
          padding: '14px 22px', borderRadius: 100, border: 'none',
          background: TLM.accent, color: '#FFFFFF',
          fontSize: 14, fontWeight: 500, cursor: 'pointer',
        }}>Show matches</button>
      </div>
    </div>
  );
}

// ─── helpers ────────────────────────────────────────────────────

function SqIcon({ children, dot }) {
  return (
    <div style={{
      width: 38, height: 38, borderRadius: 10, background: TLM.surface,
      border: `1px solid ${TLM.hair}`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', position: 'relative',
    }}>
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        {children}
      </svg>
      {dot && <div style={{
        position: 'absolute', top: 7, right: 7, width: 6, height: 6,
        borderRadius: 100, background: TLM.accent,
        border: `1.5px solid ${TLM.surface}` }}/>}
    </div>
  );
}

function FilterChip({ children, active, count, dot }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 12px', borderRadius: 100,
      background: active ? TLM.accent : TLM.surface,
      border: `1px solid ${active ? TLM.accent : TLM.hair2}`,
      color: active ? '#FFFFFF' : TLM.ink,
      fontSize: 12.5, fontWeight: 500, whiteSpace: 'nowrap',
      cursor: 'pointer',
    }}>
      {dot && <span style={{
        width: 6, height: 6, borderRadius: 100, background: TLM.verify,
      }}/>}
      {children}
      {count != null && (
        <span style={{
          fontSize: 10.5, padding: '1px 6px', borderRadius: 100,
          background: active ? 'rgba(255,255,255,0.25)' : TLM.field,
          color: active ? '#FFFFFF' : TLM.ink,
        }}>{count}</span>
      )}
    </div>
  );
}

function Section({ title, sub, action, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ padding: '4px 20px 10px',
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: TLM_FONT.display, fontSize: 17,
            letterSpacing: '-0.01em' }}>{title}</div>
          {sub && <div style={{ fontSize: 11.5, color: TLM.mute, marginTop: 1 }}>
            {sub}</div>}
        </div>
        {action && <button style={{
          background: 'transparent', border: 'none',
          fontFamily: TLM_FONT.mono, fontSize: 9.5, color: TLM.ink,
          letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
        }}>{action}</button>}
      </div>
      {children}
    </div>
  );
}

function HRail({ children }) {
  return (
    <div style={{ display: 'flex', gap: 10, padding: '0 20px',
      overflowX: 'auto' }}>
      {children}
    </div>
  );
}

function FeaturedCard({ name, city, tag, tagAccent, verified, premium }) {
  return (
    <div style={{
      flex: '0 0 168px', background: TLM.surface,
      borderRadius: 16, border: `1px solid ${TLM.hair}`,
      overflow: 'hidden',
    }}>
      <div style={{ position: 'relative', height: 200 }}>
        <PhotoPlaceholder label={name} height="100%" tone="warm"/>
        {premium && <div style={{
          position: 'absolute', top: 8, left: 8,
          padding: '3px 7px', borderRadius: 100,
          background: 'rgba(255,255,255,0.94)',
          fontFamily: TLM_FONT.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.1em', color: TLM.accentInk,
        }}>★ PREMIUM</div>}
        {tag && <div style={{
          position: 'absolute', bottom: 8, left: 8, right: 8,
          padding: '4px 8px', borderRadius: 100,
          background: tagAccent ? TLM.accent : 'rgba(255,255,255,0.92)',
          color: tagAccent ? '#FFFFFF' : TLM.ink,
          fontFamily: TLM_FONT.mono, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.04em', textAlign: 'center',
        }}>{tag}</div>}
      </div>
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 5 }}>
          {name}
          {verified && <VerifyDot/>}
        </div>
        <div style={{ fontSize: 11, color: TLM.mute, marginTop: 1 }}>
          {city}
        </div>
      </div>
    </div>
  );
}

function MiniCard({ name, city, badge, online, verified, premium, managed }) {
  return (
    <div style={{ flex: '0 0 130px' }}>
      <div style={{ position: 'relative', borderRadius: 14,
        overflow: 'hidden', height: 160 }}>
        <PhotoPlaceholder label={name} height="100%" tone="warm"/>
        {badge && <div style={{
          position: 'absolute', top: 8, left: 8,
          padding: '3px 7px', borderRadius: 100,
          background: TLM.ink, color: TLM.bg,
          fontFamily: TLM_FONT.mono, fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.1em',
        }}>{badge}</div>}
        {online && <div style={{
          position: 'absolute', top: 8, right: 8,
          width: 9, height: 9, borderRadius: 100,
          background: '#22C55E', border: '1.5px solid white',
        }}/>}
        {premium && <div style={{
          position: 'absolute', bottom: 8, left: 8,
          padding: '2px 6px', borderRadius: 100,
          background: 'rgba(255,255,255,0.94)',
          fontFamily: TLM_FONT.mono, fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.08em', color: TLM.accentInk,
        }}>★ PREMIUM</div>}
        {managed && <div style={{
          position: 'absolute', bottom: 8, left: 8,
          padding: '3px 7px', borderRadius: 100,
          background: 'rgba(255,255,255,0.94)',
          fontFamily: TLM_FONT.mono, fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.06em', color: TLM.ink,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <circle cx="3" cy="3.5" r="1.4" stroke={TLM.ink} strokeWidth="1"/>
            <circle cx="7" cy="3.5" r="1.4" stroke={TLM.ink} strokeWidth="1"/>
            <path d="M1 8.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5M5 8.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5"
              stroke={TLM.ink} strokeWidth="1" fill="none"/>
          </svg>
          FAMILY
        </div>}
      </div>
      <div style={{ padding: '8px 2px 0' }}>
        <div style={{ fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          {name}
          {verified && <VerifyDot/>}
        </div>
        <div style={{ fontSize: 10.5, color: TLM.mute, marginTop: 1 }}>
          {city}
        </div>
      </div>
    </div>
  );
}

function QuickBrowseStack() {
  return (
    <div style={{ position: 'relative', height: 130 }}>
      {/* back card */}
      <div style={{
        position: 'absolute', top: 8, left: 14, right: 14, height: 110,
        borderRadius: 14, background: TLM.field,
        border: `1px solid ${TLM.hair}`,
      }}/>
      <div style={{
        position: 'absolute', top: 4, left: 7, right: 7, height: 116,
        borderRadius: 14, background: TLM.surface,
        border: `1px solid ${TLM.hair}`,
      }}/>
      {/* front card */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 122,
        borderRadius: 14, background: TLM.surface,
        border: `1px solid ${TLM.hair}`, overflow: 'hidden',
        display: 'flex', alignItems: 'center', gap: 12, padding: 12,
      }}>
        <div style={{ width: 96, height: 96, borderRadius: 12,
          overflow: 'hidden', flexShrink: 0 }}>
          <PhotoPlaceholder label="Sneha" height="100%" tone="warm"/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 18,
              letterSpacing: '-0.01em' }}>Sneha P., 27</div>
            <VerifyDot/>
          </div>
          <div style={{ fontSize: 11.5, color: TLM.mute, marginBottom: 8 }}>
            Sunnyvale, CA · Hindu · Kamma
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <RoundIcon kind="x" tone="red"/>
            <RoundIcon kind="bookmark" tone="gold"/>
            <RoundIcon kind="heart" tone="rose"/>
            <div style={{ flex: 1 }}/>
            <div style={{
              fontFamily: TLM_FONT.mono, fontSize: 9, color: TLM.mute,
              alignSelf: 'center', letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>Swipe →</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundIcon({ kind, tone }) {
  const bg = tone === 'red' ? '#FEE2E2' : tone === 'gold' ? '#FEF3C7' : '#FCE7E9';
  const fg = tone === 'red' ? '#DC2626' : tone === 'gold' ? '#D97706' : '#E11D48';
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 100, background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        {kind === 'x' && <path d="M3 3l8 8M11 3l-8 8" stroke={fg}
          strokeWidth="1.6" strokeLinecap="round"/>}
        {kind === 'bookmark' && <path d="M3.5 2h7v10l-3.5-2-3.5 2V2z"
          fill={fg}/>}
        {kind === 'heart' && <path d="M7 12s-4-2.5-4-5.5C3 4.5 4.5 3 6 3c.6 0 1.2.3 1 1 .8-.7 1.4-1 2-1 1.5 0 3 1.5 3 3.5 0 3-4 5.5-4 5.5z"
          fill={fg}/>}
      </svg>
    </div>
  );
}

function SavedSearch({ query, loc, alerts, count }) {
  return (
    <div style={{
      padding: '10px 12px', borderRadius: 12, background: TLM.surface,
      border: `1px solid ${TLM.hair}`, position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 4 }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M3 1.5h6v9l-3-1.7-3 1.7v-9z" stroke={TLM.accent}
            strokeWidth="1.3" strokeLinejoin="round"
            fill={TLM.accent} fillOpacity="0.15"/>
        </svg>
        {alerts && <span style={{
          fontFamily: TLM_FONT.mono, fontSize: 8.5, fontWeight: 700,
          letterSpacing: '0.1em', color: TLM.verify,
          textTransform: 'uppercase', padding: '1px 5px',
          borderRadius: 100, background: '#DCFCE7',
        }}>● ALERTS</span>}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3 }}>
        {query}
      </div>
      <div style={{ fontSize: 10.5, color: TLM.mute, marginTop: 2 }}>
        {loc}
      </div>
      <div style={{
        marginTop: 8, fontFamily: TLM_FONT.mono, fontSize: 9,
        color: TLM.ink, letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>{count} matches</div>
    </div>
  );
}

// ── filter sheet helpers ──

function FilterGroup({ title, children }) {
  return (
    <div style={{ padding: '14px 20px 4px',
      borderBottom: `1px solid ${TLM.hair}` }}>
      <div style={{ fontFamily: TLM_FONT.mono, fontSize: 9.5,
        color: TLM.mute, letterSpacing: '0.12em',
        textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10,
        marginBottom: 14 }}>
        {children}
      </div>
    </div>
  );
}

function ToggleRow({ label, sub, on }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: TLM.mute, marginTop: 1 }}>
          {sub}</div>}
      </div>
      <div style={{
        width: 38, height: 22, borderRadius: 100, padding: 2,
        background: on ? TLM.accent : TLM.hair2,
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'all 0.15s',
      }}>
        <div style={{ width: 18, height: 18, borderRadius: 100,
          background: '#FFFFFF',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}/>
      </div>
    </div>
  );
}

function RangeRow({ label, lo, hi, min, max }) {
  const lp = ((lo - min) / (max - min)) * 100;
  const hp = ((hi - min) / (max - min)) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 12 }}>
        <span style={{ fontSize: 13, color: TLM.ink2 }}>{label}</span>
        <span style={{ fontFamily: TLM_FONT.display, fontSize: 18 }}>
          {lo}–{hi}
        </span>
      </div>
      <div style={{ position: 'relative', height: 4, background: TLM.hair2,
        borderRadius: 100 }}>
        <div style={{ position: 'absolute', height: '100%',
          left: `${lp}%`, right: `${100 - hp}%`,
          background: TLM.accent, borderRadius: 100 }}/>
        <div style={{ position: 'absolute', top: -7,
          left: `calc(${lp}% - 9px)`, width: 18, height: 18,
          borderRadius: 100, background: '#FFFFFF',
          border: `2px solid ${TLM.accent}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}/>
        <div style={{ position: 'absolute', top: -7,
          left: `calc(${hp}% - 9px)`, width: 18, height: 18,
          borderRadius: 100, background: '#FFFFFF',
          border: `2px solid ${TLM.accent}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}/>
      </div>
    </div>
  );
}

function ChipGroup({ label, values, options }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: TLM.ink2, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map(o => {
          const sel = values.includes(o);
          return (
            <span key={o} style={{
              padding: '6px 11px', borderRadius: 100,
              fontSize: 12, fontWeight: 500,
              background: sel ? TLM.accent : TLM.surface,
              color: sel ? '#FFFFFF' : TLM.ink,
              border: `1px solid ${sel ? TLM.accent : TLM.hair2}`,
              cursor: 'pointer',
            }}>{o}</span>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { S22_Search, S23_Filters });
