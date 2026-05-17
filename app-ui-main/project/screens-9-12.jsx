// Screens 09–12: Visa status, Family, Horoscope, Diet/lifestyle

// 09 — Visa / Immigration status — KEY DIFFERENTIATOR
function S09_Visa() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={8}/>
      <Title>Your status in the U.S.</Title>
      <Sub>Verified by document. A green check shows up on your profile so matches know it's real.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardRow title="U.S. Citizen" sub="Naturalized or born in the U.S."/>
        <CardRow title="Green Card" sub="Permanent resident"/>
        <CardRow title="H-1B" sub="With or without I-140 approved" selected
          badge={<VerifyBadge kind="VERIFIED"/>}/>
        <CardRow title="L-1 / O-1 / E-2"/>
        <CardRow title="F-1 / OPT" sub="Student or post-grad work"/>
        <CardRow title="Prefer not to say"/>
      </div>

      <div style={{
        marginTop: 18, padding: '14px 16px', borderRadius: 14,
        background: TLM.verifySoft,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 100, background: TLM.verify,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7l3 3 5-6" stroke="white" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: TLM.verify, marginBottom: 2 }}>
            Document verification
          </div>
          <div style={{ fontSize: 13, color: TLM.ink2, lineHeight: 1.4 }}>
            Upload an I-797 or visa stamp later — we redact your number and only show the badge.
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 10 — Family details
function S10_Family() {
  return (
    <Screen>
      <TopBar skip/>
      <Stepper step={9}/>
      <Title>Your family</Title>
      <Sub>Family matters in matchmaking. Add what you're comfortable sharing.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Father's profession" value="Retired · Civil engineer"/>
        <Field label="Mother's profession" value="Homemaker"/>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}><Field label="Brothers" value="1" mono/></div>
          <div style={{ flex: 1 }}><Field label="Sisters" value="0" mono/></div>
        </div>
        <Field label="Family currently lives in" value="Vijayawada, India"/>
      </div>

      <div style={{
        marginTop: 22, padding: 16, borderRadius: 16,
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10, background: TLM.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="6" r="2.2" stroke={TLM.accentInk} strokeWidth="1.2"/>
              <circle cx="11" cy="6" r="2.2" stroke={TLM.accentInk} strokeWidth="1.2"/>
              <path d="M2 13c0-1.7 1.3-3 3-3s3 1.3 3 3M8 13c0-1.7 1.3-3 3-3s3 1.3 3 3"
                stroke={TLM.accentInk} strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Add a parent co-pilot</div>
            <div style={{ fontSize: 12, color: TLM.mute }}>Let them help review matches</div>
          </div>
          <Chip size="sm">Later</Chip>
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 11 — Horoscope (star + rasi)
function S11_Horoscope() {
  return (
    <Screen>
      <TopBar skip/>
      <Stepper step={10}/>
      <Title>Birth details for horoscope</Title>
      <Sub>Optional. We'll generate a Jathakam you can share with family.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Birth time" value="04:32 AM" mono suffix="IST"/>
        <Field label="Birth place" value="Vijayawada, AP"/>
      </div>

      <div style={{
        marginTop: 22, padding: 18, borderRadius: 18,
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.15 }}>
          <RiceScatter count={8}/>
        </div>
        <div style={{
          fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14,
        }}>Calculated</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Nakshatra</div>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 22 }}>Rohini</div>
            <div style={{ fontFamily: TLM_FONT.telugu, fontSize: 14, color: TLM.ink2 }}>రోహిణి</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Rasi</div>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 22 }}>Vrishabha</div>
            <div style={{ fontFamily: TLM_FONT.telugu, fontSize: 14, color: TLM.ink2 }}>వృషభ</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Pada</div>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 22 }}>2</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: TLM.mute, fontFamily: TLM_FONT.mono,
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Lagna</div>
            <div style={{ fontFamily: TLM_FONT.display, fontSize: 22 }}>Mesha</div>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 14, fontSize: 13, color: TLM.mute, lineHeight: 1.4,
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <RiceGrain size={5}/>
        <div>You can share or hide your horoscope per match.</div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 12 — Diet + lifestyle
function S12_Diet() {
  const Group = ({ label, options, selected }) => (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {options.map(o => (
          <Chip key={o} selected={selected === o} size="sm">{o}</Chip>
        ))}
      </div>
    </div>
  );
  return (
    <Screen>
      <TopBar/>
      <Stepper step={11}/>
      <Title>Lifestyle</Title>
      <Sub>Honest answers help us find people you'll actually click with.</Sub>

      <Group label="Diet" selected="Vegetarian"
        options={['Vegetarian', 'Eggetarian', 'Non-veg', 'Vegan', 'Jain']}/>
      <Group label="Drinks" selected="Socially"
        options={['Never', 'Socially', 'Often']}/>
      <Group label="Smokes" selected="Never"
        options={['Never', 'Socially', 'Regularly']}/>
      <Group label="Exercise" selected="A few times a week"
        options={['Daily', 'A few times a week', 'Rarely']}/>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

Object.assign(window, { S09_Visa, S10_Family, S11_Horoscope, S12_Diet });
