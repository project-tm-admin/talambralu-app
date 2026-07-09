/**
 * ChatScreen — real-time Firestore chat
 *
 * Route params:
 *   conversationId  string  — Firestore conversation doc ID
 *   peerId          string  — their Firebase UID
 *   peerName        string  — display name
 *   peerVerified    bool?   — show verify dot
 *   peerLocation    string? — for call screen
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Avatar from '../../components/Avatar';
import { VerifyDot } from '../../components/VerifyBadge';
import { useApp } from '../../store/AppContext';
import {
  subscribeToMessages, sendMessage, markMessagesRead,
} from '../../firebase/firestore';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91A16 16 0 0016.09 17.9l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke={T.ink} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function VideoIcon({ locked }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 7l-7 5 7 5V7z" stroke={locked ? T.mute : T.ink} strokeWidth={1.6} fill={locked ? T.hair2 : 'none'} />
      <Rect x="1" y="5" width="15" height="14" rx="2" stroke={locked ? T.mute : T.ink} strokeWidth={1.6} fill="none" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="11" rx="2" stroke={T.verify} strokeWidth={1.5} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke={T.verify} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

function AttachIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function SendIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" fill="#D4A017" />
    </Svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ChatScreen() {
  const navigation       = useNavigation();
  const route            = useRoute();
  const { firebaseUser, isPremium } = useApp();

  const {
    conversationId = '',
    peerId         = '',
    peerName       = 'Unknown',
    peerVerified   = false,
    peerLocation   = '',
  } = route.params || {};

  const [messages, setMessages]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [text,     setText]       = useState('');
  const [sending,  setSending]    = useState(false);

  const scrollRef = useRef(null);
  const myUid     = firebaseUser?.uid;

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId) { setLoading(false); return; }

    const unsub = subscribeToMessages(conversationId, msgs => {
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    });

    // Mark messages as read on open
    markMessagesRead(conversationId, myUid).catch(() => {});

    return unsub;
  }, [conversationId, myUid]);

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || sending || !conversationId) return;
    setText('');
    setSending(true);
    try {
      await sendMessage(conversationId, myUid, trimmed);
    } catch (e) {
      console.error('sendMessage error:', e.message);
      setText(trimmed); // restore on failure
    } finally {
      setSending(false);
    }
  }, [text, sending, conversationId, myUid]);

  const startCall = useCallback((callType) => {
    navigation.navigate('Call', {
      conversationId,
      peerId,
      peerName,
      peerLocation,
      peerVerified,
      callType,
      isIncoming: false,
    });
  }, [navigation, conversationId, peerId, peerName, peerLocation, peerVerified]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: T.bg }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.topCenter}>
            <Avatar name={peerName} size={36} />
            <View>
              <View style={styles.nameVerifyRow}>
                <Text style={styles.chatName}>{peerName}</Text>
                {peerVerified && <VerifyDot size={12} />}
              </View>
              <Text style={styles.onlineText}>Tap to view profile</Text>
            </View>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.topBtn} onPress={() => startCall('voice')}>
              <PhoneIcon />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.topBtn, styles.videoBtn]}
              onPress={() => isPremium ? startCall('video') : null}
            >
              <VideoIcon locked={!isPremium} />
              {!isPremium && (
                <View style={styles.starBadge}>
                  <StarIcon />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Trust banner */}
      <View style={styles.trustBanner}>
        <LockIcon />
        <Text style={styles.trustText}>Messages are private. Never share personal details too early.</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color={T.accent} />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messageList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.length === 0 && (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>Say hello to {peerName} 👋</Text>
              </View>
            )}

            {messages.map(msg => {
              const isMe = msg.from === myUid;
              return (
                <View key={msg.id} style={[styles.msgWrap, isMe ? styles.msgWrapMe : styles.msgWrapThem]}>
                  {!isMe && <Avatar name={peerName} size={28} style={{ marginBottom: 4 }} />}
                  <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
                    <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                      {msg.text}
                    </Text>
                    <Text style={[styles.bubbleTime, isMe ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              );
            })}

            <View style={styles.safetyNote}>
              <Text style={styles.safetyText}>
                For your safety, move conversations off-app only after meeting in a public place
              </Text>
            </View>
          </ScrollView>
        )}

        {/* Composer */}
        <SafeAreaView edges={['bottom']} style={styles.composerWrap}>
          <TouchableOpacity style={styles.composerIcon}>
            <AttachIcon />
          </TouchableOpacity>
          <TextInput
            style={styles.composerInput}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={T.mute}
            multiline
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, text.length > 0 && styles.sendBtnActive]}
            onPress={handleSend}
            disabled={!text.trim() || sending}
          >
            {sending ? <ActivityIndicator size="small" color="#fff" /> : <SendIcon />}
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#FAFAF8' },
  loadingWrap:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar:          { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: T.hair, backgroundColor: T.bg },
  topBtn:          { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topCenter:       { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, marginLeft: 4 },
  nameVerifyRow:   { flexDirection: 'row', alignItems: 'center', gap: 5 },
  chatName:        { fontSize: 16, fontWeight: '700', color: T.ink },
  onlineText:      { fontSize: 11, color: T.mute },
  topActions:      { flexDirection: 'row', gap: 4 },
  videoBtn:        { position: 'relative' },
  starBadge:       { position: 'absolute', top: 6, right: 4 },
  trustBanner:     { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: T.verifySoft, paddingHorizontal: 16, paddingVertical: 8 },
  trustText:       { flex: 1, fontSize: 12, color: '#2D6B48', lineHeight: 18 },
  messageList:     { paddingHorizontal: 16, paddingVertical: 16, gap: 12 },
  emptyWrap:       { alignItems: 'center', paddingVertical: 40 },
  emptyText:       { fontSize: 15, color: T.mute },
  msgWrap:         { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgWrapMe:       { justifyContent: 'flex-end' },
  msgWrapThem:     { justifyContent: 'flex-start' },
  bubble:          { maxWidth: '78%', borderRadius: 18, padding: 12, paddingBottom: 8 },
  bubbleMe:        { backgroundColor: T.accent, borderBottomRightRadius: 4 },
  bubbleThem:      { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: T.hair },
  bubbleText:      { fontSize: 15, lineHeight: 22 },
  bubbleTextMe:    { color: '#fff' },
  bubbleTextThem:  { color: T.ink2 },
  bubbleTime:      { fontSize: 10, marginTop: 4 },
  bubbleTimeMe:    { color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  bubbleTimeThem:  { color: T.mute },
  safetyNote:      { backgroundColor: T.field, borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 8 },
  safetyText:      { fontSize: 12, color: T.mute, textAlign: 'center', lineHeight: 18 },
  composerWrap:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 6, backgroundColor: T.bg, borderTopWidth: 1, borderTopColor: T.hair, gap: 6 },
  composerIcon:    { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  composerInput:   { flex: 1, backgroundColor: T.field, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: T.ink, maxHeight: 100 },
  sendBtn:         { width: 38, height: 38, borderRadius: 19, backgroundColor: T.hair2, justifyContent: 'center', alignItems: 'center' },
  sendBtnActive:   { backgroundColor: T.accent },
});
