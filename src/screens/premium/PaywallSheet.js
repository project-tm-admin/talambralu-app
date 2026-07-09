import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';

const CREAM   = '#FAF5ED';
const GOLD_INK = '#7A5810';

function CheckIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16">
      <Path d="M3 8l3.5 3.5L13 5" stroke={GOLD_INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

const FEATURES = [
  'Full verified profile details',
  'Voice intros & private messages',
  'Advanced filters · visa, community, profession',
  "See who's interested in you",
];

export default function PaywallSheet() {
  const navigation = useNavigation();

  return (
    <View style={styles.overlay}>
      {/* Tap-to-dismiss area */}
      <TouchableOpacity
        style={styles.dismiss}
        activeOpacity={1}
        onPress={() => navigation.goBack()}
      />

      {/* Sheet */}
      <View style={styles.sheet}>
        {/* Handle */}
        <View style={styles.handle} />

        {/* Star icon */}
        <View style={styles.starCircle}>
          <Svg width={26} height={26} viewBox="0 0 24 24">
            <Path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={GOLD_INK}
            />
          </Svg>
        </View>

        {/* Headline */}
        <Text style={styles.title}>
          {'Unlock voice intros with '}
          <Text style={styles.titleItalic}>Premium</Text>
        </Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Hear how Anjali speaks before you reach out — and unlock everything else you'd want to know about her.
        </Text>

        {/* Feature list */}
        <View style={styles.featureCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureRowBorder]}>
              <CheckIcon />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.replace('Premium')}
          activeOpacity={0.86}
        >
          <Text style={styles.ctaText}>See Premium plans  ›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Text style={styles.maybeLater}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  dismiss: {
    flex: 1,
  },

  // ── Sheet ─────────────────────────────────────────────────────────────────
  sheet: {
    backgroundColor: CREAM,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: 12,
    marginBottom: 24,
  },

  // ── Star circle ───────────────────────────────────────────────────────────
  starCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  title: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: T.accent,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  titleItalic: {
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 13,
    color: T.mute,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // ── Feature card ──────────────────────────────────────────────────────────
  featureCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  featureRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.07)',
  },
  featureText: {
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
    flex: 1,
  },

  // ── Buttons ───────────────────────────────────────────────────────────────
  ctaBtn: {
    width: '100%',
    height: 52,
    backgroundColor: T.accent,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  maybeLater: {
    fontSize: 13,
    color: T.mute,
    paddingVertical: 4,
  },
});
