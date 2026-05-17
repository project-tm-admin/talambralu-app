import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Ellipse, G, Rect, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';

const { width, height } = Dimensions.get('window');

function BellOrnament() {
  return (
    <Svg width={80} height={120} viewBox="0 0 80 120">
      {/* Chain links */}
      <G>
        {[0, 14, 28].map(y => (
          <Ellipse key={y} cx="40" cy={y + 5} rx="4" ry="7" fill="none" stroke={T.accentSoft} strokeWidth={2} />
        ))}
      </G>
      {/* Bell body */}
      <Path d="M20 60 Q15 80 10 95 L70 95 Q65 80 60 60 Q50 50 40 50 Q30 50 20 60Z" fill={T.accentSoft} />
      {/* Bell rim */}
      <Ellipse cx="40" cy="95" rx="30" ry="6" fill={T.accent} opacity={0.6} />
      {/* Bell top */}
      <Circle cx="40" cy="50" r="6" fill={T.accentSoft} />
      {/* Bell clapper */}
      <Line x1="40" y1="88" x2="40" y2="98" stroke={T.accent} strokeWidth={2} />
      <Circle cx="40" cy="100" r="5" fill={T.accent} />
      {/* Decorative dots */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 40 + 22 * Math.cos(rad);
        const y = 78 + 12 * Math.sin(rad);
        return <Circle key={i} cx={x} cy={y} r={2} fill={T.accent} opacity={0.6} />;
      })}
    </Svg>
  );
}

function MantapaBackdrop() {
  return (
    <Svg width={width} height={280} viewBox={`0 0 ${width} 280`}>
      {/* Background arch */}
      <Path
        d={`M${width * 0.1} 280 Q${width * 0.1} 100 ${width * 0.5} 60 Q${width * 0.9} 100 ${width * 0.9} 280`}
        fill={T.field}
        opacity={0.5}
      />
      {/* Inner arch */}
      <Path
        d={`M${width * 0.2} 280 Q${width * 0.2} 120 ${width * 0.5} 80 Q${width * 0.8} 120 ${width * 0.8} 280`}
        fill="none"
        stroke={T.accentSoft}
        strokeWidth={1.5}
      />
      {/* Pillars */}
      <Rect x={width * 0.1 - 10} y={180} width={20} height={100} rx={4} fill={T.accentSoft} opacity={0.6} />
      <Rect x={width * 0.9 - 10} y={180} width={20} height={100} rx={4} fill={T.accentSoft} opacity={0.6} />
      {/* Decorative garland */}
      {Array.from({ length: 12 }).map((_, i) => {
        const t = i / 11;
        const x = width * 0.1 + t * (width * 0.8);
        const y = 160 + 20 * Math.sin(t * Math.PI);
        return <Circle key={i} cx={x} cy={y} r={3} fill={T.accentSoft} />;
      })}
      {/* Rice grains decorative */}
      {[0.2, 0.35, 0.5, 0.65, 0.8].map((pos, i) => (
        <Ellipse key={i} cx={width * pos} cy={240} rx={3} ry={6} fill={T.accent} opacity={0.3} />
      ))}
    </Svg>
  );
}

function CoupleIllustration() {
  return (
    <View style={styles.coupleWrap}>
      <LinearGradient
        colors={['#F7E8D4', '#E8C9A8', '#D4A574']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.couplePlaceholder}
      />
      <View style={styles.coupleOverlay}>
        {/* Silhouette figures */}
        <Svg width={180} height={120} viewBox="0 0 180 120">
          {/* Left figure (woman) */}
          <Circle cx="60" cy="25" r="18" fill="rgba(139,31,46,0.25)" />
          <Path d="M42 50 Q60 45 78 50 L85 120 H35 Z" fill="rgba(139,31,46,0.2)" />
          {/* Saree drape */}
          <Path d="M42 50 Q38 80 40 120" stroke="rgba(139,31,46,0.3)" strokeWidth={2} fill="none" />
          {/* Right figure (man) */}
          <Circle cx="120" cy="22" r="20" fill="rgba(139,31,46,0.2)" />
          <Rect x="102" y="48" width="36" height="72" rx={4} fill="rgba(139,31,46,0.18)" />
        </Svg>
      </View>
    </View>
  );
}

function HeartIcon() {
  return (
    <Svg width={18} height={16} viewBox="0 0 18 16">
      <Path
        d="M9 15C9 15 1 9.5 1 5C1 2.8 2.8 1 5 1C6.5 1 7.8 1.8 9 3C10.2 1.8 11.5 1 13 1C15.2 1 17 2.8 17 5C17 9.5 9 15 9 15Z"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth={0.5}
      />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topSection}>
        <View style={styles.bellWrap}>
          <BellOrnament />
        </View>
        <MantapaBackdrop />
        <CoupleIllustration />
      </View>

      <View style={styles.textSection}>
        <Text style={styles.teluguWordmark}>తలంబ్రాలు</Text>
        <Text style={styles.title}>Talambralu</Text>
        <View style={styles.taglineRow}>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.riceGrain} />
          ))}
          <Text style={styles.tagline}>Telugu matches, made for life in the U.S.</Text>
          {[0, 1, 2].map(i => (
            <View key={i} style={styles.riceGrain} />
          ))}
        </View>
      </View>

      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('EmailSignup')}
          activeOpacity={0.85}
        >
          <HeartIcon />
          <Text style={styles.primaryBtnText}>Create an account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => navigation.navigate('EmailSignup')}
          activeOpacity={0.7}
        >
          <Text style={styles.ghostBtnText}>I already have an account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text>
          {' & '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: T.bg,
  },
  topSection: {
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  bellWrap: {
    position: 'absolute',
    top: -10,
    zIndex: 10,
    alignItems: 'center',
  },
  coupleWrap: {
    position: 'absolute',
    bottom: 0,
    width: 220,
    height: 140,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  couplePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 110,
    borderTopRightRadius: 110,
    opacity: 0.7,
  },
  coupleOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  teluguWordmark: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: T.accent,
    letterSpacing: 2,
    marginBottom: 4,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 52,
    color: T.ink,
    letterSpacing: 1,
    lineHeight: 60,
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 8,
  },
  riceGrain: {
    width: 6,
    height: 10,
    borderRadius: 3,
    backgroundColor: T.accent,
    opacity: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: T.mute,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  ctaSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 8,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: T.accent,
    borderRadius: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ghostBtn: {
    height: 52,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ghostBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
  terms: {
    fontSize: 12,
    color: T.mute,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  link: {
    color: T.accent,
    textDecorationLine: 'underline',
  },
});
