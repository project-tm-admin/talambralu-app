// Screens 13–16: Photos, About+Voice prompt, Partner preferences, Notifications/verification

// 13 — Add Photos (redesigned)
// Hero main photo + 5 supporting slots, photo type tags, progress, tips
function S13_Photos() {
  const slots = [
    { tag: 'Solo', filled: true, label: 'Portrait', tone: 'warm' },
    { tag: 'Outdoor', filled: true, label: 'Outdoor', tone: 'cool' },
    { tag: 'Family', filled: true, label: 'Family', tone: 'warm' },
    { tag: 'Hobby', filled: false },
    { tag: 'Travel', filled: false },
  ];
  const filledCount = 1 + slots.filter(s => s.filled).length;
  const total = 6;
  return (
    <Screen>
      <TopBar/>
      <Stepper step={12}/>
      <Title>Add your photos</Title>
      <Sub>Real, recent photos help families connect with you. {filledCount} of {total} added.</Sub>

      {/* Progress bar */}
      <div style={{
        height: 4, borderRadius: 100, background: TLM.hair2,
        marginTop: 4, marginBottom: 14, overflow: 'hidden',
      }}>
        <div style={{
          width: `${(filledCount / total) * 100}%`, height: '100%',
          background: TLM.accent, borderRadius: 100,
        }}/>
      </div>

      {/* Hero main photo */}
      <div style={{
        position: 'relative', borderRadius: 18, overflow: 'hidden',
        marginBottom: 12, aspectRatio: '4/5',
        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.18)',
      }}>
        <PhotoPlaceholder label="Main portrait" height="100%" tone="warm"/>
        {/* gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)',
        }}/>
        {/* main pill */}
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '5px 10px', borderRadius: 100,
          background: TLM.accent, color: '#FFFFFF',
          fontFamily: TLM_FONT.mono, fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.12em',
        }}>★ PRIMARY</div>
        {/* AI verified pill */}
        <div style={{
          position: 'absolute', top: 12, right: 12,
          padding: '5px 9px', borderRadius: 100,
          background: 'rgba(255,255,255,0.94)',
          backdropFilter: 'blur(8px)',
          fontFamily: TLM_FONT.mono, fontSize: 9, fontWeight: 600,
          letterSpacing: '0.06em', color: '#15803D',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="4" fill="#15803D"/>
            <path d="M3 5l1.5 1.5L7 4" stroke="#FFFFFF" strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          AI VERIFIED
        </div>
        {/* footer actions */}
        <div style={{
          position: 'absolute', bottom: 12, left: 12, right: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            color: '#FFFFFF', fontSize: 12, fontWeight: 500,
            letterSpacing: '0.02em',
          }}>Tap to retake</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <PhotoIconBtn>
              <path d="M9 4v10M4 9h10" stroke="#FFFFFF" strokeWidth="1.6"
                strokeLinecap="round"/>
            </PhotoIconBtn>
            <PhotoIconBtn>
              <path d="M3 5l3-3h6l3 3M3 5v9h12V5M3 5h12M9 8a3 3 0 100 6 3 3 0 000-6z"
                stroke="#FFFFFF" strokeWidth="1.4" fill="none"
                strokeLinecap="round" strokeLinejoin="round"/>
            </PhotoIconBtn>
          </div>
        </div>
      </div>

      {/* Supporting slot grid (1 row of 5 mini cards, scrollable) */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6,
        marginBottom: 14,
      }}>
        {slots.map((s, i) => (
          <div key={i} style={{
            position: 'relative', aspectRatio: '3/4', borderRadius: 10,
            overflow: 'hidden', background: TLM.surface,
            border: s.filled ? `1px solid ${TLM.hair}` : `1.5px dashed ${TLM.hair2}`,
          }}>
            {s.filled ? (
              <PhotoPlaceholder label={s.label} height="100%" tone={s.tone}/>
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 3v8M3 7h8" stroke={TLM.mute}
                    strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
            )}
            {/* tag */}
            <div style={{
              position: 'absolute', bottom: 4, left: 4, right: 4,
              padding: '2px 4px', borderRadius: 6,
              background: s.filled ? 'rgba(0,0,0,0.55)' : 'transparent',
              color: s.filled ? '#FFFFFF' : TLM.mute,
              fontFamily: TLM_FONT.mono, fontSize: 8, fontWeight: 600,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              textAlign: 'center',
            }}>{s.tag}</div>
          </div>
        ))}
      </div>

      {/* Photo guidelines card */}
      <div style={{
        padding: '12px 14px', borderRadius: 14, background: TLM.surface,
        border: `1px solid ${TLM.hair}`, marginBottom: 12,
      }}>
        <div style={{
          fontFamily: TLM_FONT.mono, fontSize: 9.5, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: TLM.mute, marginBottom: 8,
        }}>Photo tips</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <PhotoTip ok>Clear face, no sunglasses</PhotoTip>
          <PhotoTip ok>Recent photo (within 1 year)</PhotoTip>
          <PhotoTip>Add one traditional attire shot</PhotoTip>
          <PhotoTip>Add one full-body photo</PhotoTip>
        </div>
      </div>

      {/* Privacy card */}
      <div style={{
        padding: '10px 12px', borderRadius: 12, background: TLM.field,
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 6V4.5a4 4 0 018 0V6M2.5 6h9v6.5h-9z"
            stroke={TLM.ink} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
        </svg>
        <div style={{ fontSize: 11.5, color: TLM.ink2, flex: 1, lineHeight: 1.35 }}>
          Photos are blurred for non-matches. You control who can see clearly.
        </div>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
      <Ghost>Skip for now</Ghost>
    </Screen>
  );
}

function PhotoIconBtn({ children }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 100,
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.3)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
        {children}
      </svg>
    </div>
  );
}

function PhotoTip({ children, ok }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 16, height: 16, borderRadius: 100,
        background: ok ? '#DCFCE7' : TLM.field,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {ok ? (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M2 5l1.8 1.8L8 3" stroke="#15803D" strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        ) : (
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <path d="M5 2v6M2 5h6" stroke={TLM.mute}
              strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        )}
      </div>
      <span style={{ fontSize: 12, color: ok ? TLM.ink2 : TLM.mute,
        textDecoration: ok ? 'none' : 'none' }}>{children}</span>
    </div>
  );
}

// 14 — About me / prompts (with voice + AI assist)
function S14_About() {
  return (
    <Screen>
      <TopBar/>
      <Stepper step={13}/>
      <Title>Tell your story</Title>
      <Sub>Pick one prompt to start. Add a voice note for an instant connection.</Sub>

      {/* Selected prompt with AI-assisted draft */}
      <div style={{
        background: TLM.surface, border: `1.5px solid ${TLM.ink}`,
        borderRadius: 18, padding: 18, marginBottom: 12,
      }}>
        <div style={{
          fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10,
        }}>Prompt 1 of 3</div>
        <div style={{
          fontFamily: TLM_FONT.display, fontSize: 19, lineHeight: 1.2,
          color: TLM.ink, marginBottom: 12, fontStyle: 'italic',
        }}>What does &ldquo;home&rdquo; mean to you?</div>
        <div style={{ fontSize: 14, lineHeight: 1.5, color: TLM.ink2 }}>
          Sunday filter coffee in Sunnyvale, my mom's voice on speakerphone, and the
          smell of tadka somewhere in the building.
        </div>

        <div style={{
          display: 'flex', gap: 8, marginTop: 14, paddingTop: 14,
          borderTop: `1px solid ${TLM.hair}`,
        }}>
          <Chip size="sm" icon={
            <svg width="11" height="11" viewBox="0 0 12 12">
              <path d="M6 1l1.5 3 3 .5-2 2 .5 3-3-1.5-3 1.5.5-3-2-2 3-.5z"
                fill={TLM.accent}/>
            </svg>
          }>AI · Make it warmer</Chip>
          <Chip size="sm">Translate · తెలుగు</Chip>
        </div>
      </div>

      {/* Voice prompt */}
      <div style={{
        background: TLM.surface, border: `1px solid ${TLM.hair}`,
        borderRadius: 18, padding: 16,
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 100, background: TLM.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
            <rect x="4" y="1" width="6" height="10" rx="3" fill="white"/>
            <path d="M1 9c0 3.3 2.7 6 6 6s6-2.7 6-6M7 15v2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>Voice intro · 30s</div>
          {/* Waveform */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'center', height: 18 }}>
            {[6, 10, 14, 8, 12, 16, 10, 6, 12, 14, 9, 5, 11, 15, 10, 7, 13, 9, 6, 11, 8, 4, 10, 13]
              .map((h, i) => (
                <div key={i} style={{
                  width: 2, height: h, borderRadius: 2,
                  background: i < 14 ? TLM.ink : TLM.hair2,
                }}/>
              ))}
          </div>
          <div style={{ fontFamily: TLM_FONT.mono, fontSize: 11, color: TLM.mute,
            marginTop: 4 }}>0:18 / 0:30</div>
        </div>
      </div>

      <div style={{
        marginTop: 12, fontSize: 13, color: TLM.mute, lineHeight: 1.4,
        textAlign: 'center',
      }}>2 more prompts to add</div>

      <div style={{ flex: 1 }}/>
      <Primary>Continue</Primary>
    </Screen>
  );
}

// 15 — Partner preferences
function S15_Preferences() {
  const Section = ({ label, value, children }) => (
    <div style={{
      background: TLM.surface, border: `1px solid ${TLM.hair}`,
      borderRadius: 16, padding: 16, marginBottom: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: children ? 12 : 0 }}>
        <div style={{
          fontFamily: TLM_FONT.mono, fontSize: 10, color: TLM.mute,
          textTransform: 'uppercase', letterSpacing: '0.1em',
        }}>{label}</div>
        <div style={{ fontSize: 13, color: TLM.ink, fontFamily: TLM_FONT.ui }}>{value}</div>
      </div>
      {children}
    </div>
  );
  return (
    <Screen>
      <TopBar skip/>
      <Stepper step={14}/>
      <Title>Who are you looking for?</Title>
      <Sub>Soft preferences — we'll show good matches even when they don't tick every box.</Sub>

      <Section label="Age" value="27 – 33">
        <div style={{
          height: 4, borderRadius: 2, background: TLM.field, position: 'relative',
        }}>
          <div style={{
            position: 'absolute', left: '20%', right: '40%',
            top: 0, bottom: 0, background: TLM.ink, borderRadius: 2,
          }}/>
          <div style={{
            position: 'absolute', left: '20%', top: '50%',
            transform: 'translate(-50%, -50%)', width: 16, height: 16,
            borderRadius: 100, background: TLM.bg, border: `2px solid ${TLM.ink}`,
          }}/>
          <div style={{
            position: 'absolute', left: '60%', top: '50%',
            transform: 'translate(-50%, -50%)', width: 16, height: 16,
            borderRadius: 100, background: TLM.bg, border: `2px solid ${TLM.ink}`,
          }}/>
        </div>
      </Section>

      <Section label="Distance" value="Anywhere in U.S."/>
      <Section label="Mother tongue" value="Telugu"/>
      <Section label="Education" value="Bachelor's or higher"/>
      <Section label="Visa status" value="Citizen, GC, H-1B"/>
      <Section label="Diet" value="Vegetarian"/>
    </Screen>
  );
}

// 16 — Verification + Notifications (final)
function S16_Verify() {
  return (
    <Screen hideHome>
      <TopBar onBack={false}/>
      <Stepper step={16}/>
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 22, marginTop: 8,
      }}>
        <div style={{ position: 'relative', width: 96, height: 96 }}>
          <Avatar initials="AT" size={96}/>
          <div style={{
            position: 'absolute', bottom: -4, right: -4,
            width: 32, height: 32, borderRadius: 100, background: TLM.verify,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `3px solid ${TLM.bg}`,
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 7l3 3 5-6" stroke="white" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </div>
        </div>
      </div>

      <Title size={28} mb={6}>You're almost in, Anika</Title>
      <Sub mb={20}>Two quick steps to unlock matches.</Sub>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CardRow
          title="Verify your photo"
          sub="Selfie pose · 20 seconds"
          leading={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TLM.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="9" rx="2" stroke={TLM.accentInk} strokeWidth="1.4"/>
              <circle cx="8" cy="8.5" r="2.2" stroke={TLM.accentInk} strokeWidth="1.4"/>
            </svg>
          </div>}
          trailing={<svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 3l5 5-5 5" stroke={TLM.ink} strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}/>

        <CardRow
          title="Verify your visa"
          sub="Optional · adds H-1B / GC badge"
          badge={<VerifyBadge kind="GC"/>}
          leading={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TLM.verifySoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2.5" y="3" width="11" height="10" rx="1.5" stroke={TLM.verify} strokeWidth="1.4"/>
              <path d="M5 6h6M5 9h4" stroke={TLM.verify} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>}
          trailing={<svg width="16" height="16" viewBox="0 0 16 16">
            <path d="M6 3l5 5-5 5" stroke={TLM.ink} strokeWidth="1.5" fill="none"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>}/>

        <CardRow
          title="Notifications"
          sub="New matches, messages, profile views"
          leading={<div style={{
            width: 36, height: 36, borderRadius: 12, background: TLM.field,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 12V8a4.5 4.5 0 119 0v4M2 12h12M6.5 14.5h3"
                stroke={TLM.ink} strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>}
          trailing={<div style={{
            width: 36, height: 22, borderRadius: 100, background: TLM.ink,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 2, right: 2, width: 18, height: 18,
              borderRadius: 100, background: TLM.bg,
            }}/>
          </div>}/>
      </div>

      <div style={{ flex: 1 }}/>
      <Primary>See your matches
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke={TLM.bg} strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Primary>
    </Screen>
  );
}

Object.assign(window, { S13_Photos, S14_About, S15_Preferences, S16_Verify });
