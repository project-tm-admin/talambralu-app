// Screens 05–08: US Location, India Origin, Religion/Gothram, Education+Profession

// 05 — US Location (state/metro)
function S05_USLocation() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={4}/>
      <Title>Where in the U.S.?</Title>
      <Sub>We'll prioritize matches near you, but you can search anywhere.</Sub>

      <div style={{
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
        borderRadius: 16, padding: '14px 16px', display: 'flex',
        alignItems: 'center', gap: 12, marginBottom: 18,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="6" stroke={TLM.mute} strokeWidth="1.4"/>
          <path d="M13 13l3 3" stroke={TLM.mute} strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 15, color: TLM.mute, flex: 1 }}>Search city or zip</div>
      </div>

      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12,
      }}>Detected · Bay Area</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        <CardRow title="Sunnyvale, CA" sub="Bay Area · 94087" selected
          leading={<div style={{ width: 36, height: 36, borderRadius: 12,
            background: TLM.accentSoft, display: 'flex', alignItems: 'center',
            justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5 1.5 3 3.7 3 6.5c0 3.5 5 8 5 8s5-4.5 5-8c0-2.8-2-5-5-5z"
                stroke={TLM.accentInk} strokeWidth="1.4"/>
              <circle cx="8" cy="6.3" r="1.6" fill={TLM.accentInk}/>
            </svg>
          </div>}/>
      </div>

      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>Popular Telugu hubs</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['Dallas–Fort Worth', 'NYC / NJ', 'Bay Area', 'Seattle', 'Atlanta',
          'Chicago', 'Houston', 'Phoenix', 'Boston', 'Raleigh'].map(c => (
          <Chip key={c} size="sm">{c}</Chip>
        ))}
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 06 — Origin in India (state, mother tongue, sub-caste)
function S06_IndiaOrigin() {
  const Section = ({ label, children }) => (
    <div>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
  return (
    <Screen>
      <TopBar/>
      <Stepper step={5}/>
      <Title>Roots in India</Title>
      <Sub>Used to find culturally-aligned matches. You control what's shown.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Section label="Home state">
          <div style={{ display: 'flex', gap: 8 }}>
            <Chip selected>Andhra Pradesh</Chip>
            <Chip>Telangana</Chip>
            <Chip>Other</Chip>
          </div>
        </Section>

        <Section label="District">
          <Field label="District" value="Krishna" />
        </Section>

        <Section label="Mother tongue">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[['Telugu', true], ['Hindi', false], ['English', true], ['Tamil', false]].map(([t, sel]) => (
              <Chip key={t} selected={sel} size="sm">{t}</Chip>
            ))}
          </div>
          <div style={{ fontSize: 12, color: TLM.mute, marginTop: 8,
            display: 'flex', alignItems: 'center', gap: 6 }}>
            <RiceGrain size={5}/>
            Pick all that apply — primary first.
          </div>
        </Section>

        <Section label="Community">
          <Field label="Sub-caste · optional" value="Kamma" suffix="Private"/>
        </Section>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 07 — Religion + Gothram (optional)
function S07_Religion() {
  return (
    <Screen>
      <TopBar skip/>
      <Stepper step={6}/>
      <Title>Faith &amp; family lineage</Title>
      <Sub>Optional. Shown only to matches who care, hidden from those who don't.</Sub>

      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>Religion</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
        {[['Hindu', true], ['Christian', false], ['Muslim', false],
          ['Sikh', false], ['Jain', false], ['Spiritual', false],
          ['No religion', false]].map(([t, sel]) => (
          <Chip key={t} selected={sel} size="sm">{t}</Chip>
        ))}
      </div>

      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>How important is religion to you?</div>
      <div style={{
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
        borderRadius: 16, padding: 16, marginBottom: 22,
      }}>
        <div style={{
          height: 4, borderRadius: 2, background: TLM.field,
          position: 'relative', marginBottom: 10,
        }}>
          <div style={{
            position: 'absolute', inset: 0, width: '62%',
            background: TLM.ink, borderRadius: 2,
          }}/>
          <div style={{
            position: 'absolute', left: '62%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: 100, background: TLM.ink,
            border: `3px solid ${TLM.bg}`, boxShadow: `0 0 0 1px ${TLM.ink}`,
          }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono }}>
          <span>NOT AT ALL</span><span>SOMEWHAT</span><span>VERY</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Gothram · optional" value="Bharadwaja"/>
        </div>
        <div style={{ width: 110 }}>
          <Field label="Star" value="Rohini" mono/>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 08 — Education + Profession + Income
function S08_Education() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={7}/>
      <Title>Education &amp; work</Title>
      <Sub>What you do matters here. Income range is private — we use it for matching only.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Highest degree" value="MS · Computer Science"/>
        <Field label="University" value="UT Austin"/>
        <Field label="Job title" value="Senior Product Manager"/>
        <Field label="Company" value="Stripe"/>
      </div>

      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em',
        marginTop: 22, marginBottom: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>Annual income · USD</span>
        <span style={{ color: TLM.ink, textTransform: 'none',
          letterSpacing: 0, fontSize: 13 }}>$180k – $220k</span>
      </div>
      <div style={{
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
        borderRadius: 16, padding: 18,
      }}>
        <div style={{
          height: 4, borderRadius: 2, background: TLM.field,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '40%', right: '25%',
            top: 0, bottom: 0, background: TLM.ink, borderRadius: 2,
          }}/>
          <div style={{
            position: 'absolute', left: '40%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: 100, background: TLM.bg,
            border: `2px solid ${TLM.ink}`,
          }}/>
          <div style={{
            position: 'absolute', left: '75%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 18, height: 18, borderRadius: 100, background: TLM.bg,
            border: `2px solid ${TLM.ink}`,
          }}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono,
          marginTop: 12, fontVariantNumeric: 'tabular-nums' }}>
          <span>$50K</span><span>$150K</span><span>$300K+</span>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

Object.assign(window, { S05_USLocation, S06_IndiaOrigin, S07_Religion, S08_Education });
