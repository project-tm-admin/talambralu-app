import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Dimensions, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { FONTS } from '../../theme';

const { width, height } = Dimensions.get('window');

const MAROON = '#6E1622';
const INK2   = '#5C564F';
const CREAM  = '#FFFFFF';

const HERO_IMG        = require('../../../assets/welcome-extracted/00-hero-full.png');
const FLORA_LEFT_IMG  = require('../../../assets/welcome-extracted/08-flora-bottom-left.png');
const FLORA_RIGHT_IMG = require('../../../assets/welcome-extracted/09-flora-bottom-right.png');

function CoupleHeartIcon() {
  return (
    <Svg width={26} height={24} viewBox="0 0 26 24" fill="none">
      <Path d="M13 22C13 22 2 15 2 8C2 5.2 4.2 3 7 3C9.2 3 11.2 4.3 13 6.2C14.8 4.3 16.8 3 19 3C21.8 3 24 5.2 24 8C24 15 13 22 13 22Z"
        fill="rgba(255,255,255,0.28)" stroke="rgba(255,255,255,0.6)" strokeWidth={1} />
      <Circle cx="9.5"  cy="9.5" r="2.5" fill="white" opacity={0.9} />
      <Path d="M6.5 15.5c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="white" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.9} />
      <Circle cx="16.5" cy="9.5" r="2.5" fill="white" opacity={0.9} />
      <Path d="M13.5 15.5c0-1.7 1.3-3 3-3s3 1.3 3 3" stroke="white" strokeWidth={1.2} fill="none" strokeLinecap="round" opacity={0.9} />
    </Svg>
  );
}

function PersonIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={MAROON} strokeWidth={1.6} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={MAROON} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

function ArrowRight({ color }) {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function HeartDivider() {
  return (
    <View style={styles.heartDividerWrap}>
      <View style={styles.hairline} />
      <Svg width={14} height={12} viewBox="0 0 14 12" style={{ marginHorizontal: 10 }}>
        <Path d="M7 11C7 11 1 7 1 3.5C1 2 2.1 1 3.5 1C4.8 1 6 1.8 7 3C8 1.8 9.2 1 10.5 1C11.9 1 13 2 13 3.5C13 7 7 11 7 11Z"
          fill={MAROON} opacity={0.55} />
      </Svg>
      <View style={styles.hairline} />
    </View>
  );
}

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const heroHeight = Math.round(height * 0.56);

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      {/* Hero — full painted scene, bell already inside */}
      <View style={[styles.heroWrap, { height: heroHeight }]}>
        <Image source={HERO_IMG} style={styles.heroImg} resizeMode="cover" />
      </View>

      {/* Wordmark + title + tagline */}
      <View style={styles.textBlock}>
        <Text style={styles.teluguScript}>❀ తలంభాలు ❀</Text>
        <Text style={styles.title}>Talambralu</Text>
        <Text style={styles.tagline}>Telugu matches, made for life in{'\n'}the U.S.</Text>
        <HeartDivider />
      </View>

      {/* CTAs */}
      <View style={[styles.ctaBlock, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('EmailSignup')} activeOpacity={0.86}>
          <View style={styles.primaryIconBox}><CoupleHeartIcon /></View>
          <Text style={styles.primaryLabel}>Create an account</Text>
          <ArrowRight color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.ghostBtn} onPress={() => navigation.navigate('SignIn')} activeOpacity={0.72}>
          <View style={styles.ghostIconBox}><PersonIcon /></View>
          <Text style={styles.ghostLabel}>I already have an account</Text>
          <ArrowRight color={MAROON} />
        </TouchableOpacity>

        <Text style={styles.terms}>
          {'By continuing you agree to our '}
          <Text style={styles.termsLink}>Terms</Text>
          {'  •  '}
          <Text style={styles.termsLink}>Privacy</Text>
        </Text>
      </View>

      {/* Corner flora — painted pink flowers */}
      <Image source={FLORA_LEFT_IMG}  style={styles.floraLeft}  resizeMode="contain" pointerEvents="none" />
      <Image source={FLORA_RIGHT_IMG} style={styles.floraRight} resizeMode="contain" pointerEvents="none" />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
  },

  // Hero
  heroWrap: {
    width,
    overflow: 'hidden',
    backgroundColor: CREAM,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },

  // Text block
  textBlock: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 0,
    paddingHorizontal: 24,
    gap: 2,
  },
  teluguScript: {
    fontFamily: FONTS.display,
    fontSize: 15,
    color: MAROON,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 44,
    fontWeight: '500',
    color: MAROON,
    letterSpacing: -0.8,
    lineHeight: 52,
    marginTop: 2,
  },
  tagline: {
    fontSize: 14,
    color: INK2,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
  heartDividerWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width - 160,
    marginTop: 6,
  },
  hairline: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: MAROON,
    opacity: 0.25,
  },

  // CTAs
  ctaBlock: {
    flex: 1,
    paddingHorizontal: 22,
    justifyContent: 'flex-end',
    paddingBottom: 12,
    gap: 10,
  },
  primaryBtn: {
    height: 52,
    borderRadius: 100,
    backgroundColor: MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: MAROON,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  ghostBtn: {
    height: 52,
    borderRadius: 100,
    borderWidth: 1.2,
    borderColor: MAROON,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: 'transparent',
  },
  ghostIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  terms: {
    fontSize: 11.5,
    color: INK2,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: MAROON,
    fontWeight: '700',
  },

  // Flora corners
  floraLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 90,
    height: 90,
  },
  floraRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 90,
    height: 90,
  },
});
