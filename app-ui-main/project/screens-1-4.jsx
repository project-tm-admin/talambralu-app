// Screens 01–04: Welcome, Signup, Name/DOB, Gender + Looking for

// 01 — Welcome / Splash (Crimson-white themed, matches inspiration ref)
function S01_Welcome() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      padding: '50px 0 24px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Bell — top center ornament */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginTop: 18, marginBottom: 4,
        position: 'relative', zIndex: 3,
      }}>
        <svg width="56" height="80" viewBox="0 0 56 80" fill="none">
          {/* chain */}
          <path d="M28 0v24" stroke={TLM.accentInk} strokeWidth="1.2" strokeDasharray="2 2"/>
          {/* bell body */}
          <path d="M16 38c0-8 5-14 12-14s12 6 12 14v18H16V38z"
            fill={TLM.accent} stroke={TLM.accentInk} strokeWidth="1"/>
          <ellipse cx="28" cy="56" rx="14" ry="3" fill={TLM.accentInk} opacity="0.85"/>
          <circle cx="28" cy="62" r="2.4" fill={TLM.accentInk}/>
          {/* sound waves */}
          <path d="M12 44q-3 4 0 8M44 44q3 4 0 8"
            stroke={TLM.accentInk} strokeWidth="1" fill="none" opacity="0.5"/>
        </svg>
      </div>

      {/* Petal confetti */}
      <svg style={{
        position: 'absolute', top: 60, left: 0, right: 0, width: '100%', height: 220,
        pointerEvents: 'none', zIndex: 1,
      }} viewBox="0 0 402 220">
        {[
          [40,30,20], [80,18,-30], [120,50,15], [180,12,40], [230,40,-20],
          [280,22,30], [320,58,-10], [360,30,20], [60,90,-15], [340,100,25],
          [110,110,40], [300,140,-30],
        ].map(([x,y,r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="3" ry="6"
            fill={i % 2 ? TLM.accent : TLM.accentInk}
            opacity={i % 2 ? 0.55 : 0.35}
            transform={`rotate(${r} ${x} ${y})`}/>
        ))}
      </svg>

      {/* Hero illustration — fan backdrop + couple */}
      <div style={{ flex: 1, padding: '0 12px', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, marginTop: -8, zIndex: 2 }}>

        {/* Decorative fan / mantapa backdrop */}
        <svg style={{
          position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)', width: 340, height: 320,
          opacity: 0.85,
        }} viewBox="0 0 340 320" fill="none">
          {[...Array(11)].map((_, i) => {
            const a = (i - 5) * 16;
            const colors = [TLM.accent, TLM.accentSoft, '#E8C9B8', '#F0D7C4', TLM.accent, TLM.accentSoft, '#E8C9B8', TLM.accent, TLM.accentSoft, '#F0D7C4', TLM.accent];
            return (
              <g key={i} transform={`translate(170 200) rotate(${a})`}>
                <path d="M0 0 Q-26 -100 0 -180 Q26 -100 0 0Z"
                  fill={colors[i]} opacity={0.7}
                  stroke={TLM.accentInk} strokeWidth="0.4" strokeOpacity="0.25"/>
              </g>
            );
          })}
        </svg>

        {/* Skyline silhouettes (Statue of Liberty + Brooklyn Bridge) */}
        <svg style={{
          position: 'absolute', bottom: 80, left: 6, width: 64, height: 110,
          opacity: 0.32,
        }} viewBox="0 0 64 110" fill="none">
          {/* Liberty */}
          <path d="M32 6c-1 4-3 6-3 8s1 3 3 3 3-1 3-3-2-4-3-8z" fill={TLM.accentInk}/>
          <path d="M28 19l-2 5h12l-2-5h-8z" fill={TLM.accentInk}/>
          <path d="M30 24v40h4V24z" fill={TLM.accentInk}/>
          <path d="M22 64h20v6H22z" fill={TLM.accentInk}/>
          <path d="M24 70h16l-2 30H26z" fill={TLM.accentInk}/>
        </svg>
        <svg style={{
          position: 'absolute', bottom: 60, right: 4, width: 80, height: 90,
          opacity: 0.32,
        }} viewBox="0 0 80 90" fill="none">
          {/* Bridge */}
          <path d="M10 60h60M20 30v30M60 30v30M20 30q20 -20 40 0"
            stroke={TLM.accentInk} strokeWidth="1.4" fill="none"/>
          <path d="M14 30h12v8h-12zM54 30h12v8h-12z" fill={TLM.accentInk}/>
          {[28,34,40,46,52].map(x => (
            <path key={x} d={`M${x} 60v-${10 + Math.abs(40-x)*0.6}`}
              stroke={TLM.accentInk} strokeWidth="0.6"/>
          ))}
        </svg>

        {/* Couple */}
        <img src="assets/welcome-couple.png"
          alt="Telugu couple"
          style={{ maxHeight: '100%', maxWidth: '100%',
            height: '100%', width: 'auto',
            objectFit: 'contain', mixBlendMode: 'multiply',
            position: 'relative', zIndex: 2 }}/>

        {/* Flower kalashams flanking */}
        {[{ side: 'left', x: 8 }, { side: 'right', x: 8 }].map(({ side, x }) => (
          <svg key={side} style={{
            position: 'absolute', bottom: 38, [side]: x, width: 44, height: 70, zIndex: 3,
          }} viewBox="0 0 44 70" fill="none">
            {/* flower cluster */}
            {[[10,8],[22,4],[34,10],[16,16],[28,18],[22,22]].map(([cx,cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="3.4" fill={TLM.accent} opacity="0.85"/>
                <circle cx={cx} cy={cy} r="1.4" fill={TLM.accentSoft}/>
              </g>
            ))}
            {/* leaves */}
            <path d="M6 20q-4 2 -2 6M38 20q4 2 2 6"
              stroke={TLM.accentInk} strokeWidth="0.8" opacity="0.5" fill="none"/>
            {/* vase */}
            <path d="M14 28h16l-2 10c2 4 0 12 -6 12s-8 -8 -6 -12l-2 -10z"
              fill={TLM.accentInk} opacity="0.85"/>
            <rect x="13" y="26" width="18" height="3" fill={TLM.accentInk}/>
            <rect x="16" y="50" width="12" height="2" fill={TLM.accentInk}/>
          </svg>
        ))}
      </div>

      {/* Title block */}
      <div style={{ textAlign: 'center', padding: '4px 24px 14px', zIndex: 3 }}>
        {/* Telugu wordmark + flourish */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: TLM_FONT.telugu, fontSize: 15, color: TLM.accent,
          letterSpacing: '0.04em', marginBottom: 2,
        }}>
          <span style={{ opacity: 0.6 }}>❯</span>
          తలంబ్రాలు
          <span style={{ opacity: 0.6 }}>❮</span>
        </div>
        <div style={{ fontSize: 9, color: TLM.accent, marginBottom: 4 }}>♥</div>
        <h1 style={{
          fontFamily: TLM_FONT.display, fontWeight: 500,
          fontSize: 52, lineHeight: 1, letterSpacing: '-0.02em',
          color: TLM.accentInk, margin: '0 0 8px',
        }}>Talambralu</h1>
        <p style={{
          fontFamily: TLM_FONT.display, fontStyle: 'italic',
          fontSize: 15, color: TLM.ink2, margin: '0 auto', maxWidth: 260,
          lineHeight: 1.4,
        }}>Telugu matches, made for life in<br/>the U.S.</p>
        {/* divider with heart */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 32px 0', justifyContent: 'center',
        }}>
          <div style={{ flex: 1, height: 0.75, background: TLM.accent, opacity: 0.35 }}/>
          <span style={{ color: TLM.accent, fontSize: 10 }}>♥</span>
          <div style={{ flex: 1, height: 0.75, background: TLM.accent, opacity: 0.35 }}/>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ padding: '0 20px',
        display: 'flex', flexDirection: 'column', gap: 8, zIndex: 3 }}>
        {/* Primary — filled accentInk pill */}
        <button style={{
          width: '100%', height: 52, borderRadius: 100, border: 'none',
          background: TLM.accentInk, color: '#FFFFFF',
          fontFamily: TLM_FONT.ui, fontSize: 15, fontWeight: 500,
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* leading heart icon */}
          <span style={{
            position: 'absolute', left: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 100, background: TLM.accent,
          }}>
            <svg width="14" height="13" viewBox="0 0 14 13" fill="none">
              <path d="M7 12C2 8.5 1 6 1 4a3 3 0 016-1 3 3 0 016 1c0 2-1 4.5-6 8z"
                fill={TLM.accentInk}/>
              <circle cx="7" cy="5" r="1.2" fill={TLM.accent}/>
            </svg>
          </span>
          Create an account
          <span style={{ position: 'absolute', right: 20, opacity: 0.8 }}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke="#FFFFFF" strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>

        {/* Secondary — outlined pill */}
        <button style={{
          width: '100%', height: 52, borderRadius: 100,
          background: 'transparent', border: `1px solid ${TLM.accent}`,
          color: TLM.accentInk, fontFamily: TLM_FONT.ui, fontSize: 15, fontWeight: 500,
          cursor: 'pointer', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ position: 'absolute', left: 22 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="6" r="2.6" stroke={TLM.accentInk} strokeWidth="1.2"/>
              <path d="M3 14c1-2.5 3-3.6 5-3.6s4 1.1 5 3.6"
                stroke={TLM.accentInk} strokeWidth="1.2" strokeLinecap="round" fill="none"/>
            </svg>
          </span>
          I already have an account
          <span style={{ position: 'absolute', right: 20, opacity: 0.7 }}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke={TLM.accentInk} strokeWidth="1.4"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </button>

        <div style={{
          fontFamily: TLM_FONT.ui, fontSize: 11, color: TLM.mute,
          textAlign: 'center', marginTop: 6,
        }}>
          By continuing you agree to our{' '}
          <span style={{ color: TLM.accentInk, fontWeight: 500 }}>Terms</span>
          {' · '}
          <span style={{ color: TLM.accentInk, fontWeight: 500 }}>Privacy</span>
        </div>
      </div>
    </div>
  );
}

// 01b — Welcome (Onboarding · Arched variant)
// Same illustration, different system: arched mantapa frame, kalasham crown,
// editorial italic intro line. Picks up theme colors so it matches the rest.
function S01b_WelcomeInvite() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      padding: '50px 0 28px', boxSizing: 'border-box',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Top — kalasham/diya ornament in accent */}
      <div style={{ display: 'flex', justifyContent: 'center',
        marginTop: 14, marginBottom: 6 }}>
        <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
          <path d="M22 2c-1.5 3-3 5-3 8a3 3 0 006 0c0-3-1.5-5-3-8z"
            fill={TLM.accent} opacity="0.9"/>
          <path d="M14 16h16l-2 6H16l-2-6z" fill={TLM.accent} opacity="0.6"/>
          <path d="M12 22h20" stroke={TLM.accent} strokeWidth="0.8" opacity="0.7"/>
          <path d="M6 19c0-3 2-5 6-5M38 19c0-3-2-5-6-5"
            stroke={TLM.accent} strokeWidth="0.8" opacity="0.6" fill="none"/>
          <circle cx="6" cy="19" r="1" fill={TLM.accent} opacity="0.6"/>
          <circle cx="38" cy="19" r="1" fill={TLM.accent} opacity="0.6"/>
        </svg>
      </div>

      {/* Telugu wordmark */}
      <div style={{
        textAlign: 'center', fontFamily: TLM_FONT.telugu,
        fontSize: 14, color: TLM.accentInk, letterSpacing: '0.04em',
      }}>తలంబ్రాలు</div>

      {/* Top ornamental rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8,
        padding: '10px 64px 0' }}>
        <div style={{ flex: 1, height: 0.75, background: TLM.accent, opacity: 0.35 }}/>
        <RiceGrain size={5} color={TLM.accent}/>
        <div style={{ flex: 1, height: 0.75, background: TLM.accent, opacity: 0.35 }}/>
      </div>

      {/* Editorial headline */}
      <div style={{
        textAlign: 'center', padding: '14px 24px 6px',
      }}>
        <h1 style={{
          fontFamily: TLM_FONT.display, fontWeight: 400, fontStyle: 'italic',
          fontSize: 40, lineHeight: 1.04, letterSpacing: '-0.015em',
          color: TLM.ink, margin: 0,
        }}>Find your<br/>match.</h1>
        <div style={{
          fontFamily: TLM_FONT.ui, fontSize: 13, color: TLM.ink2,
          marginTop: 10, lineHeight: 1.45, maxWidth: 280, margin: '10px auto 0',
        }}>A premium matrimony app for Telugu families across the United States.</div>
      </div>

      {/* Illustration in arched frame (mantapa) */}
      <div style={{
        flex: 1, padding: '14px 28px 4px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 0, position: 'relative',
      }}>
        <div style={{
          position: 'relative', width: '100%', height: '100%',
          maxWidth: 320, margin: '0 auto',
          borderTopLeftRadius: '50% 28%',
          borderTopRightRadius: '50% 28%',
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          overflow: 'hidden',
          border: `0.75px solid ${TLM.accent}66`,
        }}>
          <img src="assets/welcome-couple.png"
            alt="Telugu couple dancing"
            style={{ width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center 20%',
              mixBlendMode: 'multiply' }}/>
        </div>
      </div>

      {/* Three trust pills — onboarding hooks */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 6,
        padding: '14px 16px 18px', flexWrap: 'wrap',
      }}>
        {['Verified profiles', 'H-1B & green-card aware', 'Family-friendly'].map((t, i) => (
          <div key={i} style={{
            fontFamily: TLM_FONT.mono, fontSize: 9.5,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: TLM.ink2,
            padding: '5px 9px', borderRadius: 100,
            background: TLM.field, border: `0.5px solid ${TLM.hair}`,
          }}>{t}</div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ padding: '0 24px',
        display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button style={{
          width: '100%', height: 54, borderRadius: 100, border: 'none',
          background: TLM.accentInk, color: '#FFFFFF',
          fontFamily: TLM_FONT.ui, fontSize: 15, fontWeight: 500,
          cursor: 'pointer', letterSpacing: '0.005em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          Create an account
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12M9 1l4 4-4 4" stroke="#FFFFFF" strokeWidth="1.3"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button style={{
          height: 44, background: 'transparent', border: 'none',
          color: TLM.ink, fontSize: 13.5, cursor: 'pointer',
          fontFamily: TLM_FONT.ui, fontWeight: 500,
        }}>I already have an account</button>
      </div>
    </div>
  );
}

// 02 — Phone signup
function S02_Phone() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={1}/>
      <Title>What's your number?</Title>
      <Sub>We'll text a 6-digit code. Your number stays private until you choose to share it.</Sub>

      <div style={{
        display: 'flex', gap: 10, marginBottom: 16,
      }}>
        <div style={{
          background: TLM.surface, border: `1px solid ${TLM.hair}`,
          borderRadius: 16, padding: '12px 14px', display: 'flex',
          alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 18 }}>🇺🇸</span>
          <span style={{ fontSize: 17 }}>+1</span>
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 4l3 3 3-3" stroke={TLM.mute} strokeWidth="1.4" fill="none"
              strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{
          flex: 1, background: TLM.surface, border: `1.5px solid ${TLM.ink}`,
          borderRadius: 16, padding: '12px 16px',
          display: 'flex', alignItems: 'center',
        }}>
          <div style={{ fontSize: 17, fontFamily: TLM_FONT.ui }}>
            (415) 555–<span style={{ color: TLM.ink, borderRight: `2px solid ${TLM.ink}`, paddingRight: 1 }}>02</span>
            <span style={{ color: TLM.mute }}>__</span>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24,
        padding: '10px 14px', borderRadius: 12, background: TLM.accentSoft,
      }}>
        <RiceGrain color={TLM.accentInk}/>
        <div style={{ fontSize: 12, color: TLM.accentInk, lineHeight: 1.4 }}>
          We never sell your data. Verified profiles only.
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Send code</Primary>
      <div style={{ height: 12 }}/>
      <Ghost>Continue with email instead</Ghost>
    </Screen>
  );
}

// 03 — Name + DOB
function S03_Name() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={2}/>
      <Title>Your name &amp; birthday</Title>
      <Sub>This is how matches will see you. You can't change your birthday later.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="First name" value="Anika"/>
        <Field label="Last name" value="Talluri"/>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Field label="Month" value="March" mono/>
          </div>
          <div style={{ width: 80 }}>
            <Field label="Day" value="14" mono/>
          </div>
          <div style={{ width: 96 }}>
            <Field label="Year" value="1996" mono/>
          </div>
        </div>
      </div>

      <div style={{
        marginTop: 14, padding: '10px 14px',
        fontSize: 12, color: TLM.mute,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="6" stroke={TLM.mute} strokeWidth="1.2"/>
          <path d="M7 4v3.5M7 9.5v0.5" stroke={TLM.mute} strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
        Age (29) is shown to matches, not your birthday.
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 04 — Gender + Looking for
function S04_Gender() {
  const Pair = ({ label, options, selected }) => (
    <div>
      <div style={{
        fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
        textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(o => (
          <CardRow key={o} title={o} selected={selected === o}/>
        ))}
      </div>
    </div>
  );
  return (
    <Screen>
      <TopBar/>
      <Stepper step={3}/>
      <Title>Tell us about you</Title>
      <Sub>You can update your preferences any time.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Pair label="I am" selected="Woman"
          options={['Woman', 'Man', 'Non-binary']}/>
        <Pair label="Looking for" selected="Man"
          options={['Men', 'Women', 'Everyone']}/>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

Object.assign(window, { S01_Welcome, S01b_WelcomeInvite, S02_Phone, S03_Name, S04_Gender });
