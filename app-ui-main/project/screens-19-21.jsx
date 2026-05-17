// Screens 19–21: Forgot password, Sign up with email, OTP verification
// Auth flow — same matrimony tone, sandalwood ink, serif headlines.

// 19 — Forgot password
function S19_ForgotPassword() {
  return (
    <Screen>
      <TopBar/>
      <div style={{ marginTop: 8 }}/>

      {/* Lock illustration block */}
      <div style={{
        width: 64, height: 64, borderRadius: 20, background: TLM.field,
        border: `1px solid ${TLM.hair}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 22,
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="6" y="12" width="16" height="11" rx="2"
            stroke={TLM.ink} strokeWidth="1.5"/>
          <path d="M9.5 12V9a4.5 4.5 0 019 0v3" stroke={TLM.ink} strokeWidth="1.5"/>
          <circle cx="14" cy="17.5" r="1.4" fill={TLM.ink}/>
        </svg>
      </div>

      <Title>Forgot your password?</Title>
      <Sub>Enter the email tied to your Talambralu account. We'll send a 6-digit code to reset it.</Sub>

      <div style={{ marginBottom: 14 }}>
        <Field label="Email" value="anika.talluri@gmail.com"/>
      </div>

      <div style={{
        padding: '12px 14px', borderRadius: 12, background: TLM.field,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <RiceGrain size={5} color={TLM.ink2}/>
        <div style={{ fontSize: 12, color: TLM.ink2, lineHeight: 1.45, flex: 1 }}>
          For your safety, the code expires in 10 minutes and can't be used twice.
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Send reset code</Primary>
      <div style={{ height: 12 }}/>
      <div style={{
        textAlign: 'center', fontSize: 13, color: TLM.ink2,
      }}>
        Remembered it? <span style={{ color: TLM.ink, fontWeight: 500,
          textDecoration: 'underline', textDecorationColor: TLM.hair2,
          textUnderlineOffset: 3 }}>Back to sign in</span>
      </div>
    </Screen>
  );
}

// 20 — Sign up with email
function S20_EmailSignup() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={1}/>
      <Title>Create your account</Title>
      <Sub>Use the email your family checks too — important match updates land here.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Field label="Full name" value="Anika Talluri"/>
        <Field label="Email" value="anika.talluri@gmail.com"/>

        {/* Password with visibility toggle + strength */}
        <div style={{
          background: TLM.surface, border: `1.5px solid ${TLM.ink}`,
          borderRadius: 16, padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline' }}>
            <div style={{
              fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
              textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>Password</div>
            <div style={{
              fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.verify,
              fontWeight: 600, letterSpacing: '0.06em',
            }}>STRONG</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', marginTop: 4 }}>
            <div style={{ fontSize: 18, color: TLM.ink, letterSpacing: 4 }}>
              ••••••••••
            </div>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M1 9s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke={TLM.ink2} strokeWidth="1.3"/>
              <circle cx="9" cy="9" r="2.2" stroke={TLM.ink2} strokeWidth="1.3"/>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
            {[1, 1, 1, 0].map((on, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: on ? TLM.verify : TLM.hair,
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div style={{
        marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '6px 14px', fontSize: 12, color: TLM.ink2,
      }}>
        {[
          ['8+ characters', true],
          ['One number', true],
          ['Upper & lowercase', true],
          ['Symbol (!@#$)', false],
        ].map(([t, ok]) => (
          <div key={t} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              {ok ? (
                <>
                  <circle cx="6" cy="6" r="6" fill={TLM.verify}/>
                  <path d="M3.5 6L5 7.5 8.5 4" stroke="white" strokeWidth="1.4"
                    strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </>
              ) : (
                <circle cx="6" cy="6" r="5.5" stroke={TLM.hair2} strokeWidth="1.2"/>
              )}
            </svg>
            <span style={{ color: ok ? TLM.ink : TLM.mute }}>{t}</span>
          </div>
        ))}
      </div>

      {/* Marketing consent */}
      <div style={{
        marginTop: 18, display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <div style={{
          width: 20, height: 20, borderRadius: 6, background: TLM.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, marginTop: 1,
        }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L5 9l4.5-5.5" stroke={TLM.bg} strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize: 12, color: TLM.ink2, lineHeight: 1.45 }}>
          Email me weekly handpicked matches and family-friendly success stories.
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Create account</Primary>
      <div style={{
        marginTop: 10, textAlign: 'center', fontSize: 13, color: TLM.ink2,
      }}>
        Have an account? <span style={{ color: TLM.ink, fontWeight: 500 }}>Sign in</span>
      </div>
    </Screen>
  );
}

// 21 — OTP verification
function S21_OTP() {
  const digits = ['4', '8', '2', '1', '', ''];
  return (
    <Screen>
      <TopBar/>
      <div style={{ marginTop: 8 }}/>

      <div style={{
        width: 64, height: 64, borderRadius: 20, background: TLM.accentSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 22, position: 'relative',
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect x="4" y="6" width="20" height="14" rx="2"
            stroke={TLM.accentInk} strokeWidth="1.5"/>
          <path d="M4 10l10 6 10-6" stroke={TLM.accentInk} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <Title>Check your email</Title>
      <Sub>
        We sent a 6-digit code to{' '}
        <span style={{ color: TLM.ink, fontWeight: 500 }}>
          anika.talluri@gmail.com
        </span>. It expires in 9:42.
      </Sub>

      {/* OTP boxes */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {digits.map((d, i) => {
          const filled = !!d;
          const active = !filled && i === digits.findIndex(x => !x);
          return (
            <div key={i} style={{
              flex: 1, height: 60, borderRadius: 14,
              background: TLM.surface,
              border: `1.5px solid ${active ? TLM.ink : filled ? TLM.hair2 : TLM.hair}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: TLM_FONT.display, fontSize: 28, color: TLM.ink,
              position: 'relative',
            }}>
              {d}
              {active && (
                <div style={{
                  position: 'absolute', width: 1.5, height: 24,
                  background: TLM.ink, animation: 'blink 1s infinite',
                }}/>
              )}
            </div>
          );
        })}
      </div>

      {/* Resend timer */}
      <div style={{
        padding: '12px 14px', borderRadius: 12, background: TLM.field,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" stroke={TLM.ink2} strokeWidth="1.2"/>
            <path d="M7 4v3.2L9 8.5" stroke={TLM.ink2} strokeWidth="1.2"
              strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 12, color: TLM.ink2 }}>Resend code in</span>
        </div>
        <span style={{
          fontFamily: TLM_FONT.mono, fontSize: 13, color: TLM.ink,
          fontVariantNumeric: 'tabular-nums', fontWeight: 500,
        }}>00:42</span>
      </div>

      {/* Tip */}
      <div style={{
        marginTop: 14, fontSize: 12, color: TLM.mute, lineHeight: 1.5,
        display: 'flex', gap: 8, alignItems: 'flex-start',
      }}>
        <RiceGrain size={5} color={TLM.mute}/>
        <div>
          Didn't get it? Check spam, or{' '}
          <span style={{ color: TLM.ink, fontWeight: 500,
            textDecoration: 'underline', textDecorationColor: TLM.hair2,
            textUnderlineOffset: 3 }}>use a different email</span>.
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary disabled>Verify &amp; continue</Primary>
    </Screen>
  );
}

Object.assign(window, { S19_ForgotPassword, S20_EmailSignup, S21_OTP });
