/**
 * CallScreen — Agora voice/video call
 *
 * Route params:
 *   conversationId  string   — used as Agora channel name
 *   peerId          string   — their Firebase UID
 *   peerName        string   — display name
 *   peerLocation    string?  — city/state shown on screen
 *   peerVerified    bool?    — show verify dot
 *   callType        'voice' | 'video'
 *   isIncoming      bool     — true → show accept/decline, false → auto-join
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { VerifyDot } from '../../components/VerifyBadge';
import Avatar from '../../components/Avatar';
import {
  fetchAgoraToken, joinVoiceCall, joinVideoCall,
  leaveCall, toggleMute, enableSpeaker, isAgoraAvailable,
} from '../../services/agora';
import { useApp } from '../../store/AppContext';

const { width, height } = Dimensions.get('window');
const WAVEFORM = [12, 20, 32, 18, 28, 44, 22, 36, 48, 30, 24, 40, 28, 36, 20, 44, 16, 38, 26, 42];

// ─── Icons ────────────────────────────────────────────────────────────────────

function DeclineIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-3.91-3.91" stroke="white" strokeWidth={2} strokeLinecap="round" />
      <Path d="M2 2L22 22" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function AcceptIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0016.09 17.9l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="white" />
    </Svg>
  );
}

function MuteIcon({ active }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      {active ? (
        <>
          <Rect x="9" y="2" width="6" height="11" rx="3" stroke="white" strokeWidth={1.8} />
          <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8M2 2l20 20" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
        </>
      ) : (
        <>
          <Rect x="9" y="2" width="6" height="11" rx="3" stroke="white" strokeWidth={1.8} />
          <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

function SpeakerIcon({ active }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="white" strokeWidth={1.8} fill={active ? 'white' : 'none'}
        strokeLinecap="round" strokeLinejoin="round"
      />
      {active && (
        <Path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" stroke="white" strokeWidth={1.8} strokeLinecap="round" />
      )}
    </Svg>
  );
}

function EndCallIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-3.91-3.91" stroke="white" strokeWidth={2} strokeLinecap="round" />
      <Path d="M2 2L22 22" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="11" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function useCallTimer(active) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CallScreen() {
  const navigation   = useNavigation();
  const route        = useRoute();
  const { firebaseUser } = useApp();

  const {
    conversationId = 'default-channel',
    peerId         = '',
    peerName       = 'Unknown',
    peerLocation   = '',
    peerVerified   = false,
    callType       = 'voice',
    isIncoming     = false,
  } = route.params || {};

  // 'ringing' | 'connecting' | 'active' | 'ended'
  const [callState, setCallState] = useState(isIncoming ? 'ringing' : 'connecting');
  const [muted,     setMuted]     = useState(false);
  const [speaker,   setSpeaker]   = useState(false);
  const [noSdk,     setNoSdk]     = useState(false);

  const engineRef = useRef(null);
  const timer     = useCallTimer(callState === 'active');

  // Auto-join when initiating (not incoming)
  useEffect(() => {
    if (!isIncoming) joinCall();
    return () => { if (engineRef.current) leaveCall(); };
  }, []);

  const joinCall = useCallback(async () => {
    setCallState('connecting');
    try {
      const available = await isAgoraAvailable();
      if (!available) {
        setNoSdk(true);
        setCallState('active'); // show UI anyway in Expo Go
        return;
      }

      // Convert UID string to a stable integer for Agora
      const agoraUid = Math.abs(
        firebaseUser?.uid?.split('').reduce((a, c) => a + c.charCodeAt(0), 0) || 0
      ) % 100000;

      const token = await fetchAgoraToken(conversationId, agoraUid);
      const engine = callType === 'video'
        ? await joinVideoCall(conversationId, token, agoraUid)
        : await joinVoiceCall(conversationId, token, agoraUid);

      engineRef.current = engine;
      setCallState('active');
    } catch (e) {
      console.error('joinCall error:', e.message);
      Alert.alert('Call failed', e.message, [{ text: 'OK', onPress: endCall }]);
    }
  }, [conversationId, callType, firebaseUser]);

  const endCall = useCallback(async () => {
    setCallState('ended');
    try { await leaveCall(); } catch (_) {}
    navigation.goBack();
  }, [navigation]);

  const handleAccept = useCallback(() => joinCall(), [joinCall]);

  const handleDecline = useCallback(async () => {
    try { await leaveCall(); } catch (_) {}
    navigation.goBack();
  }, [navigation]);

  const handleMute = useCallback(async () => {
    const next = !muted;
    setMuted(next);
    await toggleMute(next).catch(() => {});
  }, [muted]);

  const handleSpeaker = useCallback(async () => {
    const next = !speaker;
    setSpeaker(next);
    await enableSpeaker(next).catch(() => {});
  }, [speaker]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#1A0A0E' }]} />

      {[0.8, 0.65, 0.5].map((opacity, i) => (
        <View key={i} style={[styles.decorCircle, {
          width: 280 + i * 60, height: 280 + i * 60,
          borderRadius: 200,
          borderWidth: 1,
          borderColor: `rgba(139,31,46,${opacity * 0.2})`,
          opacity,
        }]} />
      ))}

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Top label */}
        <View style={styles.topSection}>
          <Text style={styles.incomingLabel}>
            {callState === 'ringing'
              ? `INCOMING · ${callType.toUpperCase()} CALL`
              : callState === 'connecting'
                ? 'CONNECTING…'
                : callState === 'active'
                  ? `${callType.toUpperCase()} CALL · ${timer}`
                  : 'CALL ENDED'}
          </Text>
          {noSdk && (
            <View style={styles.sdkWarn}>
              <Text style={styles.sdkWarnText}>Agora SDK unavailable in Expo Go — use a dev build to test calls</Text>
            </View>
          )}
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <Avatar name={peerName} size={120} />
            </View>
          </View>

          {callState === 'ringing' && (
            <View style={styles.waveformRow}>
              {WAVEFORM.map((h, i) => (
                <View key={i} style={[styles.waveBar, {
                  height: h,
                  backgroundColor: i < 10 ? 'rgba(139,31,46,0.8)' : 'rgba(139,31,46,0.3)',
                }]} />
              ))}
            </View>
          )}

          {callState === 'connecting' && (
            <ActivityIndicator color="rgba(139,31,46,0.8)" size="large" style={{ marginTop: 20 }} />
          )}
        </View>

        {/* Name */}
        <View style={styles.nameSection}>
          <View style={styles.nameVerifyRow}>
            <Text style={styles.callerName}>{peerName}</Text>
            {peerVerified && <VerifyDot size={18} />}
          </View>
          {!!peerLocation && <Text style={styles.callerLocation}>{peerLocation}</Text>}
          <View style={styles.encryptedPill}>
            <LockIcon />
            <Text style={styles.encryptedText}>End-to-end encrypted</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          {callState === 'ringing' ? (
            // Incoming — decline / accept
            <>
              <View style={styles.actionLabels}>
                <Text style={styles.actionLabel}>Decline</Text>
                <Text style={styles.actionLabel}>Accept</Text>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity style={[styles.callBtn, styles.declineBtn]} onPress={handleDecline}>
                  <DeclineIcon />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.callBtn, styles.acceptBtn]} onPress={handleAccept}>
                  <View style={styles.acceptGlow} />
                  <AcceptIcon />
                </TouchableOpacity>
              </View>
            </>
          ) : callState === 'connecting' ? (
            // Connecting — only allow cancel
            <View style={styles.actionBtns}>
              <TouchableOpacity style={[styles.callBtn, styles.declineBtn]} onPress={handleDecline}>
                <DeclineIcon />
              </TouchableOpacity>
            </View>
          ) : (
            // Active — mute / speaker / end
            <>
              <View style={styles.actionLabels}>
                <Text style={styles.actionLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
                <Text style={styles.actionLabel}>End</Text>
                <Text style={styles.actionLabel}>{speaker ? 'Earpiece' : 'Speaker'}</Text>
              </View>
              <View style={styles.actionBtns}>
                <TouchableOpacity
                  style={[styles.callBtn, muted ? styles.activeToggleBtn : styles.messageBtn]}
                  onPress={handleMute}
                >
                  <MuteIcon active={muted} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.callBtn, styles.declineBtn]} onPress={endCall}>
                  <EndCallIcon />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.callBtn, speaker ? styles.activeToggleBtn : styles.messageBtn]}
                  onPress={handleSpeaker}
                >
                  <SpeakerIcon active={speaker} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#1A0A0E' },
  decorCircle:     { position: 'absolute', alignSelf: 'center', top: height * 0.25 },
  safe:            { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  topSection:      { alignItems: 'center', gap: 10, marginTop: 20 },
  incomingLabel:   { fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' },
  sdkWarn:         { backgroundColor: 'rgba(255,200,0,0.15)', borderWidth: 1, borderColor: 'rgba(255,200,0,0.3)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, marginTop: 4 },
  sdkWarnText:     { color: 'rgba(255,220,0,0.9)', fontSize: 11, textAlign: 'center' },
  avatarSection:   { alignItems: 'center', flex: 1, justifyContent: 'center' },
  outerRing:       { width: 180, height: 180, borderRadius: 90, borderWidth: 1.5, borderColor: 'rgba(139,31,46,0.4)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  innerRing:       { width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: 'rgba(139,31,46,0.6)', justifyContent: 'center', alignItems: 'center' },
  waveformRow:     { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40, width: '80%' },
  waveBar:         { flex: 1, borderRadius: 2, minHeight: 3 },
  nameSection:     { alignItems: 'center', gap: 6, marginBottom: 20 },
  nameVerifyRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  callerName:      { fontFamily: FONTS.display, fontSize: 32, color: '#fff', fontWeight: '300' },
  callerLocation:  { fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  encryptedPill:   { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 100, marginTop: 4 },
  encryptedText:   { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  actionsSection:  { gap: 12, marginBottom: 20 },
  actionLabels:    { flexDirection: 'row', justifyContent: 'space-around' },
  actionLabel:     { fontSize: 13, color: 'rgba(255,255,255,0.6)', width: 80, textAlign: 'center' },
  actionBtns:      { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  callBtn:         { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  declineBtn:      { backgroundColor: '#C53030', shadowColor: '#C53030', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 },
  messageBtn:      { backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  activeToggleBtn: { backgroundColor: 'rgba(255,255,255,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)' },
  acceptBtn:       { backgroundColor: '#276749', position: 'relative', shadowColor: '#276749', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.6, shadowRadius: 16, elevation: 10 },
  acceptGlow:      { position: 'absolute', width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(39,103,73,0.3)', transform: [{ scale: 1.4 }] },
});
