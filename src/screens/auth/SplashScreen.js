/**
 * Animated splash screen — shown while Firebase auth state resolves.
 * Talambralu rice-grain motif + Telugu script fade-in.
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const MAROON = '#8B1F2E';
const CREAM  = '#FFFFFF';

export default function SplashScreen() {
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.88)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const grainOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Rice grain appears first
      Animated.timing(grainOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
      // Logo scales + fades in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1, friction: 6, tension: 80, useNativeDriver: true,
        }),
      ]),
      // Tagline fades in
      Animated.timing(textOpacity, {
        toValue: 1, duration: 500, delay: 100, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Decorative rice grain motif (top left) */}
      <Animated.View style={[styles.grainTL, { opacity: grainOpacity }]}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.grain, { transform: [{ rotate: `${i * 30}deg` }] }]} />
        ))}
      </Animated.View>

      {/* Decorative rice grain motif (bottom right) */}
      <Animated.View style={[styles.grainBR, { opacity: grainOpacity }]}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={[styles.grain, { transform: [{ rotate: `${i * 30}deg` }] }]} />
        ))}
      </Animated.View>

      {/* Logo block */}
      <Animated.View style={[
        styles.logoBlock,
        { opacity: logoOpacity, transform: [{ scale: logoScale }] }
      ]}>
        <Text style={styles.teluguScript}>❀ తలంభాలు ❀</Text>
        <Text style={styles.logoText}>Talambralu</Text>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text style={[styles.tagline, { opacity: textOpacity }]}>
        Telugu matches, made for life in the U.S.
      </Animated.Text>

      {/* Loading indicator */}
      <Animated.View style={[styles.dots, { opacity: textOpacity }]}>
        <DotsLoader />
      </Animated.View>
    </View>
  );
}

function DotsLoader() {
  const d1 = useRef(new Animated.Value(0.3)).current;
  const d2 = useRef(new Animated.Value(0.3)).current;
  const d3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const bounce = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      );
    bounce(d1, 0).start();
    bounce(d2, 150).start();
    bounce(d3, 300).start();
  }, []);

  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[d1, d2, d3].map((d, i) => (
        <Animated.View
          key={i}
          style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: MAROON, opacity: d }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CREAM,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBlock: {
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  teluguScript: {
    fontSize: 16,
    color: MAROON,
    letterSpacing: 1.5,
    fontStyle: 'italic',
  },
  logoText: {
    fontSize: 52,
    fontWeight: '500',
    color: MAROON,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: '#5C564F',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
  },
  dots: {
    position: 'absolute',
    bottom: 60,
  },
  // Rice grain motifs
  grainTL: {
    position: 'absolute',
    top: 40,
    left: -20,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grainBR: {
    position: 'absolute',
    bottom: 30,
    right: -20,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  grain: {
    position: 'absolute',
    width: 28,
    height: 10,
    borderRadius: 5,
    backgroundColor: MAROON,
    opacity: 0.12,
  },
});
