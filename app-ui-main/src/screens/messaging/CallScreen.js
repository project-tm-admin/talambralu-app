import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';
import { VerifyDot } from '../../components/VerifyBadge';

const { width, height } = Dimensions.get('window');

const WAVEFORM = [12, 20, 32, 18, 28, 44, 22, 36, 48, 30, 24, 40, 28, 36, 20, 44, 16, 38, 26, 42];

function DeclineIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-3.91-3.91" stroke="white" strokeWidth={2} strokeLinecap="round" />
      <Path d="M2 2L22 22" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function MessageIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke="rgba(255,255,255,0.9)" strokeWidth={1.8} fill="none" />
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

function LockIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="11" width="14" height="11" rx="2" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} />
      <Path d="M8 11V7a4 4 0 018 0v4" stroke="rgba(255,255,255,0.8)" strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export default function CallScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A0A0E', '#2D0F18', '#3D1525', '#1A0A0E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circles */}
      {[0.8, 0.65, 0.5].map((opacity, i) => (
        <View
          key={i}
          style={[
            styles.decorCircle,
            {
              width: 280 + i * 60,
              height: 280 + i * 60,
              borderRadius: 200,
              borderWidth: 1,
              borderColor: `rgba(139,31,46,${opacity * 0.2})`,
              opacity,
            },
          ]}
        />
      ))}

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Incoming label + premium badge */}
        <View style={styles.topSection}>
          <Text style={styles.incomingLabel}>INCOMING · VOICE CALL</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumStar}>★</Text>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        </View>

        {/* Avatar ring */}
        <View style={styles.avatarSection}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>PM</Text>
              </View>
            </View>
          </View>

          {/* Waveform around avatar (decorative) */}
          <View style={styles.waveformRow}>
            {WAVEFORM.map((h, i) => (
              <View
                key={i}
                style={[
                  styles.waveBar,
                  { height: h, backgroundColor: i < 10 ? 'rgba(139,31,46,0.8)' : 'rgba(139,31,46,0.3)' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Name + location */}
        <View style={styles.nameSection}>
          <View style={styles.nameVerifyRow}>
            <Text style={styles.callerName}>Priya M.</Text>
            <VerifyDot size={18} />
          </View>
          <Text style={styles.callerLocation}>New Jersey, USA</Text>

          {/* Encrypted pill */}
          <View style={styles.encryptedPill}>
            <LockIcon />
            <Text style={styles.encryptedText}>End-to-end encrypted</Text>
          </View>
        </View>

        {/* Call actions */}
        <View style={styles.actionsSection}>
          {/* Labels */}
          <View style={styles.actionLabels}>
            <Text style={styles.actionLabel}>Decline</Text>
            <Text style={styles.actionLabel}>Message</Text>
            <Text style={styles.actionLabel}>Accept</Text>
          </View>

          <View style={styles.actionBtns}>
            <TouchableOpacity
              style={[styles.callBtn, styles.declineBtn]}
              onPress={() => navigation.goBack()}
            >
              <DeclineIcon />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.callBtn, styles.messageBtn]}>
              <MessageIcon />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.callBtn, styles.acceptBtn]}>
              <View style={styles.acceptGlow} />
              <AcceptIcon />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A0A0E',
  },
  decorCircle: {
    position: 'absolute',
    alignSelf: 'center',
    top: height * 0.25,
  },
  safe: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  topSection: {
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
  },
  incomingLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(212,160,23,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212,160,23,0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  premiumStar: {
    fontSize: 12,
    color: '#D4A017',
  },
  premiumText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: '#D4A017',
    letterSpacing: 1,
  },
  avatarSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  outerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: 'rgba(139,31,46,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  innerRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'rgba(139,31,46,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: T.accentSoft,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: T.accentInk,
  },
  waveformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 40,
    width: '80%',
  },
  waveBar: {
    flex: 1,
    borderRadius: 2,
    minHeight: 3,
  },
  nameSection: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  nameVerifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callerName: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
  callerLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  encryptedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    marginTop: 4,
  },
  encryptedText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  actionsSection: {
    gap: 12,
    marginBottom: 20,
  },
  actionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    width: 80,
    textAlign: 'center',
  },
  actionBtns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  callBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  declineBtn: {
    backgroundColor: '#C53030',
    shadowColor: '#C53030',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  messageBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  acceptBtn: {
    backgroundColor: '#276749',
    position: 'relative',
    shadowColor: '#276749',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  acceptGlow: {
    position: 'absolute',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(39,103,73,0.3)',
    transform: [{ scale: 1.4 }],
  },
});
