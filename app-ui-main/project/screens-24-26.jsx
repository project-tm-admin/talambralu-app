// Communication module — message requests inbox, chat, call screen.

function S24_Inbox() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      <div style={{ padding: '8px 20px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: TLM_FONT.display, fontSize: 28,
          letterSpacing: '-0.015em' }}>Messages</div>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: TLM.surface,
          border: `1px solid ${TLM.hair}`, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M3 5l6 5 6-5M3 5h12v8H3z" stroke={TLM.ink}
              strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* segmented */}
      <div style={{ padding: '4px 20px 12px',
        display: 'flex', gap: 6 }}>
        <Seg active count={3}>Conversations</Seg>
        <Seg count={5} dot>Requests</Seg>
        <Seg>Archived</Seg>
      </div>

      {/* requests strip — controlled message requests */}
      <div style={{
        margin: '0 20px 14px', padding: '12px 14px',
        borderRadius: 14, background: TLM.field,
        border: `1px solid ${TLM.hair}`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ display: 'flex' }}>
          <Av i={0} size={32} stack/>
          <Av i={1} size={32} stack offset={-10}/>
          <Av i={2} size={32} stack offset={-20}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>5 new requests</div>
          <div style={{ fontSize: 11, color: TLM.mute, marginTop: 1 }}>
            Verified users only · Review before chatting
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14">
          <path d="M5 3l4 4-4 4" stroke={TLM.ink} strokeWidth="1.5"
            fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* conversation list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <ConvRow name="Anjali R." preview="Sounds great — will share my horoscope tonight 🪔"
          time="2m" unread={2} verified avatar={3} typing/>
        <ConvRow name="Sneha P." preview="My parents would love to talk to your family"
          time="1h" unread={1} verified avatar={4}/>
        <ConvRow name="Divya N." preview="Pic: Hyderabad family visit · 3 photos"
          time="Yesterday" verified avatar={5} pinned/>
        <ConvRow name="Riya · Family-managed" preview="Namaste! I'm Riya's mother. We are based in Houston…"
          time="2d" verified avatar={6} family/>
        <ConvRow name="Pranavi K." preview="Audio call · 8m" time="3d"
          verified avatar={7} call/>
        <ConvRow name="Lasya G." preview="Could you share your kundali PDF when free?"
          time="5d" avatar={8} verified/>

        {/* premium upsell */}
        <div style={{
          margin: '14px 20px 24px', padding: '14px 16px',
          borderRadius: 14, background: TLM.surface,
          border: `1px dashed ${TLM.accent}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: TLM.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 1l2.4 5 5.6.5-4.2 3.8L14 16 9 13l-5 3 1.2-5.7L1 6.5 6.6 6z"
                fill={TLM.accent} stroke={TLM.accent} strokeWidth="1" strokeLinejoin="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              Voice & video calls · Premium
            </div>
            <div style={{ fontSize: 11, color: TLM.mute, marginTop: 1 }}>
              Unlock calls + read receipts + see who saved you
            </div>
          </div>
          <button style={{
            padding: '8px 14px', borderRadius: 100, border: 'none',
            background: TLM.accent, color: '#FFFFFF',
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>Go Premium</button>
        </div>
      </div>

      <BottomTabs active="messages"/>
    </div>
  );
}

// 25 — Chat thread
function S25_Chat() {
  return (
    <div style={{
      width: '100%', height: '100%', background: TLM.bg,
      fontFamily: TLM_FONT.ui, color: TLM.ink,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '6px 16px 8px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${TLM.hair}` }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M11 4l-5 5 5 5" stroke={TLM.ink} strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Av i={3} size={36}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Anjali R.</span>
            <VerifyDot/>
          </div>
          <div style={{ fontSize: 11, color: '#22C55E' }}>● Online now</div>
        </div>
        <CallBtn kind="audio"/>
        <CallBtn kind="video" premium/>
      </div>

      {/* Trust banner */}
      <div style={{
        margin: '10px 16px 4px', padding: '8px 12px',
        borderRadius: 10, background: TLM.field,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <VerifyDot/>
        <span style={{ fontSize: 11, color: TLM.ink2 }}>
          Both profiles verified · Match accepted Apr 28
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto',
        padding: '10px 16px', display: 'flex',
        flexDirection: 'column', gap: 8 }}>

        <DateChip>Today</DateChip>

        <Bubble side="them">Namaste! Nice to connect 🙏</Bubble>
        <Bubble side="them">My family is from Krishna district as well — small world.</Bubble>

        <Bubble side="me">Namaste Anjali — same here! My ammamma is from Vijayawada.</Bubble>
        <Bubble side="me" status="read">Would love to know more about your family.</Bubble>

        {/* Horoscope share with consent */}
        <ShareCard kind="horoscope" name="Anjali_kundali.pdf" size="2.4 MB"/>

        <Bubble side="them">Thank you for sharing 🪔 Will pass it to my parents this evening.</Bubble>

        {/* Flagged-message warning (system) */}
        <SystemNote>
          One message was hidden — flagged by our safety filter. <span style={{
            color: TLM.accent, fontWeight: 500 }}>Review</span>
        </SystemNote>

        <Bubble side="them" typing/>
      </div>

      {/* Composer */}
      <div style={{
        padding: '8px 12px 16px', borderTop: `1px solid ${TLM.hair}`,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <ComposerBtn>
          <path d="M9 4v10M4 9h10" stroke={TLM.ink} strokeWidth="1.6"
            strokeLinecap="round"/>
        </ComposerBtn>
        <div style={{
          flex: 1, height: 40, borderRadius: 100, background: TLM.field,
          border: `1px solid ${TLM.hair}`, padding: '0 14px',
          display: 'flex', alignItems: 'center',
          fontSize: 13, color: TLM.mute,
        }}>
          Write a message…
        </div>
        <ComposerBtn>
          <path d="M5 9c0 2 1.8 4 4 4s4-2 4-4M9 1v9M9 13v3M6 16h6"
            stroke={TLM.ink} strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        </ComposerBtn>
        <button style={{
          width: 40, height: 40, borderRadius: 100, border: 'none',
          background: TLM.accent, display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8l12-6-5 14-2-6-5-2z" fill="#FFFFFF" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// 26 — Audio/video call screen (incoming)
function S26_Call() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#1B1916', color: '#FFFFFF',
      fontFamily: TLM_FONT.ui,
      display: 'flex', flexDirection: 'column',
      paddingTop: 56, boxSizing: 'border-box', overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Background photo with dark overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
        <PhotoPlaceholder label="Anjali · portrait" height="100%" tone="warm"/>
      </div>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(27,25,22,0.5) 0%, rgba(27,25,22,0.85) 60%, #1B1916 100%)',
      }}/>

      <div style={{ position: 'relative', zIndex: 1, flex: 1,
        display: 'flex', flexDirection: 'column' }}>
        {/* Top */}
        <div style={{ padding: '12px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: TLM_FONT.mono, fontSize: 10,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
          }}>Incoming · Voice call</div>
          <div style={{
            padding: '3px 8px', borderRadius: 100,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            fontFamily: TLM_FONT.mono, fontSize: 9,
            letterSpacing: '0.1em', fontWeight: 600,
          }}>★ PREMIUM</div>
        </div>

        {/* Caller block */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 14,
          padding: '20px 24px' }}>
          <div style={{
            width: 132, height: 132, borderRadius: 100,
            border: '3px solid rgba(255,255,255,0.18)',
            overflow: 'hidden', position: 'relative',
            boxShadow: '0 0 0 8px rgba(255,255,255,0.05)',
          }}>
            <PhotoPlaceholder label="Anjali" height="100%" tone="warm"/>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8 }}>
              <h1 style={{ fontFamily: TLM_FONT.display, fontSize: 36,
                margin: 0, fontWeight: 400, letterSpacing: '-0.015em' }}>
                Anjali R.
              </h1>
              <VerifyDot/>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)',
              marginTop: 4 }}>
              Dallas, TX · Match since Apr 28
            </div>
          </div>
          <div style={{
            marginTop: 8, padding: '6px 12px', borderRadius: 100,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
            fontSize: 11.5, color: 'rgba(255,255,255,0.85)',
          }}>
            🔒 End-to-end encrypted
          </div>
        </div>

        {/* Action row */}
        <div style={{ padding: '0 28px 24px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-end' }}>
          <CallAction kind="decline" label="Decline"/>
          <CallAction kind="message" label="Message"/>
          <CallAction kind="accept" label="Accept" big/>
        </div>
      </div>
    </div>
  );
}

// ── helpers ─────────────────────────────────────

function Seg({ children, active, count, dot }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 100,
      background: active ? TLM.ink : TLM.surface,
      color: active ? TLM.bg : TLM.ink,
      border: `1px solid ${active ? TLM.ink : TLM.hair2}`,
      fontSize: 12.5, fontWeight: 500, position: 'relative',
    }}>
      {children}
      {count != null && <span style={{
        fontSize: 10, padding: '1px 6px', borderRadius: 100,
        background: active ? 'rgba(255,255,255,0.2)' : TLM.field,
      }}>{count}</span>}
      {dot && <span style={{
        position: 'absolute', top: 4, right: 6, width: 6, height: 6,
        borderRadius: 100, background: TLM.accent,
      }}/>}
    </div>
  );
}

function Av({ i = 0, size = 36, stack, offset = 0 }) {
  const tones = ['#E8B5A8', '#D4B896', '#C9A586', '#B8927A', '#E0C9A8',
    '#D8B89A', '#C8A88A', '#B89878', '#E5BFA0'];
  return (
    <div style={{
      width: size, height: size, borderRadius: 100,
      background: tones[i % tones.length],
      flexShrink: 0,
      marginLeft: stack ? offset : 0,
      border: stack ? '2px solid ' + TLM.field : 'none',
      backgroundImage: `linear-gradient(135deg, ${tones[i % tones.length]}, ${tones[(i + 1) % tones.length]})`,
    }}/>
  );
}

function ConvRow({ name, preview, time, unread, verified, avatar, typing,
  pinned, family, call }) {
  return (
    <div style={{
      padding: '12px 20px', display: 'flex', gap: 12,
      borderBottom: `1px solid ${TLM.hair}`, position: 'relative',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <Av i={avatar} size={48}/>
        {family && <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 18, height: 18, borderRadius: 100,
          background: TLM.surface, border: `1px solid ${TLM.hair}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="3" cy="3.5" r="1.4" stroke={TLM.ink} strokeWidth="1"/>
            <circle cx="7" cy="3.5" r="1.4" stroke={TLM.ink} strokeWidth="1"/>
            <path d="M1 8.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5M5 8.5c0-1.5 1-2.5 2-2.5s2 1 2 2.5"
              stroke={TLM.ink} strokeWidth="1" fill="none"/>
          </svg>
        </div>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
            minWidth: 0 }}>
            <span style={{ fontSize: 14, fontWeight: 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {name}
            </span>
            {verified && <VerifyDot/>}
            {pinned && <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M6 1l1.2 3 3.3.3-2.5 2.2.7 3.2L6 8.2l-2.7 1.5.7-3.2L1.5 4.3 4.8 4z"
                fill={TLM.ink2}/>
            </svg>}
          </div>
          <div style={{ fontSize: 11, color: TLM.mute,
            fontFamily: TLM_FONT.mono, letterSpacing: '0.04em' }}>{time}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', gap: 10 }}>
          <div style={{
            fontSize: 12.5, color: typing ? TLM.accent : TLM.ink2,
            fontStyle: typing ? 'italic' : 'normal',
            fontWeight: unread ? 500 : 400,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            display: 'flex', alignItems: 'center', gap: 5, flex: 1, minWidth: 0,
          }}>
            {call && <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 2.5l2 .5.5 2-1 1c.5 1.5 1.5 2.5 3 3l1-1 2 .5.5 2c-3 .5-7-3.5-8-8z"
                stroke={TLM.ink2} strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>}
            {typing ? 'typing…' : preview}
          </div>
          {unread > 0 && <div style={{
            minWidth: 18, height: 18, borderRadius: 100,
            background: TLM.accent, color: '#FFFFFF',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 5px', flexShrink: 0,
          }}>{unread}</div>}
        </div>
      </div>
    </div>
  );
}

function CallBtn({ kind, premium }) {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: TLM.surface,
        border: `1px solid ${TLM.hair}`, display: 'flex',
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        opacity: premium ? 0.6 : 1,
      }}>
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          {kind === 'audio' ? (
            <path d="M3 3l2.5.5.5 2.5-1.2 1.2c.6 1.8 1.7 3 3.5 3.5l1.2-1.2 2.5.5.5 2.5C8 13 2 7.5 3 3z"
              stroke={TLM.ink} strokeWidth="1.3" strokeLinejoin="round"/>
          ) : (
            <>
              <rect x="1" y="4" width="9" height="7" rx="1.2" stroke={TLM.ink} strokeWidth="1.3"/>
              <path d="M10 6.5l3-1.5v5l-3-1.5z" stroke={TLM.ink} strokeWidth="1.3"
                strokeLinejoin="round" fill="none"/>
            </>
          )}
        </svg>
      </div>
      {premium && <div style={{
        position: 'absolute', top: -3, right: -3,
        width: 14, height: 14, borderRadius: 100,
        background: TLM.accent, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        border: '2px solid ' + TLM.bg,
      }}>
        <svg width="6" height="6" viewBox="0 0 8 8" fill="none">
          <path d="M2 4l1.2 1.2L6 2.5" stroke="#FFFFFF" strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>}
    </div>
  );
}

function DateChip({ children }) {
  return (
    <div style={{ alignSelf: 'center', padding: '4px 10px', borderRadius: 100,
      background: TLM.field,
      fontFamily: TLM_FONT.mono, fontSize: 9.5,
      color: TLM.mute, letterSpacing: '0.12em',
      textTransform: 'uppercase', margin: '4px 0',
    }}>{children}</div>
  );
}

function Bubble({ children, side, status, typing }) {
  const me = side === 'me';
  return (
    <div style={{ display: 'flex',
      justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '78%', padding: typing ? '10px 14px' : '9px 13px',
        borderRadius: 16,
        borderBottomRightRadius: me ? 4 : 16,
        borderBottomLeftRadius: me ? 16 : 4,
        background: me ? TLM.accent : TLM.surface,
        color: me ? '#FFFFFF' : TLM.ink,
        border: me ? 'none' : `1px solid ${TLM.hair}`,
        fontSize: 13.5, lineHeight: 1.4,
      }}>
        {typing ? (
          <div style={{ display: 'flex', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 5, height: 5, borderRadius: 100,
                background: TLM.mute, opacity: 0.4 + i * 0.2,
              }}/>
            ))}
          </div>
        ) : children}
        {status && (
          <div style={{
            fontSize: 9.5, marginTop: 3,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: TLM_FONT.mono, letterSpacing: '0.08em',
            textAlign: 'right',
          }}>READ · 2:14 PM</div>
        )}
      </div>
    </div>
  );
}

function ShareCard({ kind, name, size }) {
  return (
    <div style={{ alignSelf: 'flex-end', maxWidth: '78%' }}>
      {/* consent banner */}
      <div style={{
        padding: '6px 10px', borderRadius: 10,
        background: TLM.field, fontSize: 10.5, color: TLM.ink2,
        fontFamily: TLM_FONT.mono, letterSpacing: '0.06em',
        textTransform: 'uppercase', marginBottom: 4,
        textAlign: 'center',
      }}>
        🔒 Shared with consent
      </div>
      <div style={{
        padding: '12px 14px', borderRadius: 16, borderBottomRightRadius: 4,
        background: TLM.accent, color: '#FFFFFF',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 38, height: 46, borderRadius: 6,
          background: 'rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TLM_FONT.mono, fontSize: 9, fontWeight: 700,
          letterSpacing: '0.04em',
        }}>PDF</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </div>
          <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.8)',
            marginTop: 2, fontFamily: TLM_FONT.mono, letterSpacing: '0.04em' }}>
            {kind === 'horoscope' ? 'KUNDALI · ' : ''}{size}
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v8M3.5 6.5L7 10l3.5-3.5M2 12h10"
            stroke="#FFFFFF" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </div>
  );
}

function SystemNote({ children }) {
  return (
    <div style={{ alignSelf: 'center', maxWidth: '88%',
      padding: '8px 12px', borderRadius: 10,
      background: '#FEF3C7', border: '1px solid #FCD34D',
      fontSize: 11.5, color: '#78350F',
      display: 'flex', alignItems: 'center', gap: 8, textAlign: 'center',
    }}>
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M7 1l6 11H1L7 1z" stroke="#78350F" strokeWidth="1.3"
          strokeLinejoin="round" fill="#FBBF24" fillOpacity="0.4"/>
        <path d="M7 5v3M7 10v0.5" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
      <span>{children}</span>
    </div>
  );
}

function ComposerBtn({ children }) {
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 100, background: TLM.surface,
      border: `1px solid ${TLM.hair}`, display: 'flex',
      alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      flexShrink: 0,
    }}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {children}
      </svg>
    </div>
  );
}

function CallAction({ kind, label, big }) {
  const colors = {
    decline: '#E11D48',
    accept: '#22C55E',
    message: 'rgba(255,255,255,0.18)',
  };
  const sz = big ? 72 : 56;
  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8 }}>
      <div style={{
        width: sz, height: sz, borderRadius: 100,
        background: colors[kind],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: kind === 'accept' ? '0 0 24px rgba(34,197,94,0.5)' : 'none',
        transform: kind === 'decline' ? 'rotate(135deg)' : 'none',
      }}>
        <svg width={big ? 28 : 22} height={big ? 28 : 22} viewBox="0 0 24 24" fill="none">
          {kind === 'message' ? (
            <path d="M4 6h16v10H6l-2 2V6z" stroke="#FFFFFF" strokeWidth="1.8"
              strokeLinejoin="round"/>
          ) : (
            <path d="M5 4l4 1 1 4-2 2c1 3 3 5 6 6l2-2 4 1 1 4c-6 1-15-7-16-16z"
              fill="#FFFFFF"/>
          )}
        </svg>
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
        {label}
      </div>
    </div>
  );
}

Object.assign(window, { S24_Inbox, S25_Chat, S26_Call });
