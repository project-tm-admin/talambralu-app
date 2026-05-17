import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Avatar from '../../components/Avatar';
import { VerifyDot } from '../../components/VerifyBadge';

const MESSAGES = [
  { id: 1, from: 'them', text: "Namaste! I loved your answer about home — the paati's kitchen metaphor really resonated 🌸", time: '10:02 AM' },
  { id: 2, from: 'me', text: "Thank you! It felt like the truest way to describe it. How would you describe home for yourself?", time: '10:15 AM' },
  { id: 3, from: 'them', text: "Home for me is the sound of my mother's voice on a Sunday morning call, and the smell of Biryani from our Hyderabad trips.", time: '10:18 AM' },
  { id: 4, from: 'me', text: "That's beautiful. I could almost smell it! Are you originally from Hyderabad?", time: '10:22 AM' },
  { id: 5, from: 'them', text: "Born there, but grew up in Vijayawada. Moved to New Jersey for my PhD. You?", time: '10:25 AM' },
  { id: 6, from: 'me', text: "Similar story — Vijayawada roots, came to Bay Area for work after my MS. Small world!", time: '10:27 AM' },
];

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

function VideoIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 7l-7 5 7 5V7z" stroke={T.mute} strokeWidth={1.6} fill={T.hair2} />
      <Rect x="1" y="5" width="15" height="14" rx="2" stroke={T.mute} strokeWidth={1.6} fill="none" />
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

function MicIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="11" rx="3" stroke={T.mute} strokeWidth={1.6} />
      <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke={T.mute} strokeWidth={1.6} strokeLinecap="round" />
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

function HoroBubble() {
  return (
    <View style={styles.horoBubble}>
      <View style={styles.horoHeader}>
        <Text style={styles.horoTitle}>Horoscope match request</Text>
      </View>
      <View style={styles.horoBody}>
        <Text style={styles.horoText}>Anika wants to share her birth chart</Text>
      </View>
      <View style={styles.horoLock}>
        <LockIcon />
        <Text style={styles.horoLockText}>Requires Premium to unlock ★</Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const [message, setMessage] = useState('');

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={{ backgroundColor: T.bg }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
            <BackIcon />
          </TouchableOpacity>
          <View style={styles.topCenter}>
            <Avatar name="Priya M." size={36} />
            <View>
              <View style={styles.nameVerifyRow}>
                <Text style={styles.chatName}>Priya M.</Text>
                <VerifyDot size={12} />
              </View>
              <Text style={styles.onlineText}>Online now</Text>
            </View>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.topBtn}>
              <PhoneIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoLocked}>
              <VideoIcon />
              <StarIcon />
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
        <ScrollView
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        >
          {MESSAGES.map(msg => (
            <View key={msg.id} style={[styles.msgWrap, msg.from === 'me' ? styles.msgWrapMe : styles.msgWrapThem]}>
              {msg.from === 'them' && <Avatar name="Priya M." size={28} style={{ marginBottom: 4 }} />}
              <View style={[styles.bubble, msg.from === 'me' ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={[styles.bubbleText, msg.from === 'me' ? styles.bubbleTextMe : styles.bubbleTextThem]}>
                  {msg.text}
                </Text>
                <Text style={[styles.bubbleTime, msg.from === 'me' ? styles.bubbleTimeMe : styles.bubbleTimeThem]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          <HoroBubble />

          {/* Safety note */}
          <View style={styles.safetyNote}>
            <Text style={styles.safetyText}>
              For your safety, move conversations off-app only after meeting in a public place
            </Text>
          </View>
        </ScrollView>

        {/* Composer */}
        <SafeAreaView edges={['bottom']} style={styles.composerWrap}>
          <TouchableOpacity style={styles.composerIcon}>
            <AttachIcon />
          </TouchableOpacity>
          <TextInput
            style={styles.composerInput}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            placeholderTextColor={T.mute}
            multiline
          />
          <TouchableOpacity style={styles.composerIcon}>
            <MicIcon />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.sendBtn, message.length > 0 && styles.sendBtnActive]}>
            <SendIcon />
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: T.bg,
  },
  topBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginLeft: 4,
  },
  nameVerifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '700',
    color: T.ink,
  },
  onlineText: {
    fontSize: 11,
    color: T.verify,
    fontWeight: '500',
  },
  topActions: {
    flexDirection: 'row',
    gap: 4,
  },
  videoLocked: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: T.verifySoft,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: '#2D6B48',
    lineHeight: 18,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  msgWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  msgWrapMe: { justifyContent: 'flex-end' },
  msgWrapThem: { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    borderRadius: 18,
    padding: 12,
    paddingBottom: 8,
  },
  bubbleMe: {
    backgroundColor: T.accent,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: T.hair,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextMe: { color: '#fff' },
  bubbleTextThem: { color: T.ink2 },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
  },
  bubbleTimeMe: { color: 'rgba(255,255,255,0.65)', textAlign: 'right' },
  bubbleTimeThem: { color: T.mute },
  horoBubble: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 16,
    overflow: 'hidden',
    width: 260,
    marginVertical: 8,
  },
  horoHeader: {
    backgroundColor: T.field,
    padding: 10,
  },
  horoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: T.ink,
    textAlign: 'center',
  },
  horoBody: { padding: 12 },
  horoText: {
    fontSize: 13,
    color: T.mute,
    textAlign: 'center',
  },
  horoLock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: T.verifySoft,
    paddingVertical: 8,
  },
  horoLockText: {
    fontSize: 12,
    color: T.verify,
    fontWeight: '600',
  },
  safetyNote: {
    backgroundColor: T.field,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  safetyText: {
    fontSize: 12,
    color: T.mute,
    textAlign: 'center',
    lineHeight: 18,
  },
  composerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    gap: 6,
  },
  composerIcon: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composerInput: {
    flex: 1,
    backgroundColor: T.field,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: T.ink,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: T.accent,
  },
});
