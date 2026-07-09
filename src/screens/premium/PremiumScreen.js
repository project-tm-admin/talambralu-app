import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';

const GOLD_INK = '#7A5810';
const GOLD_BG  = '#F5ECD0';

// ─── Icons ────────────────────────────────────────────────────────────────────
function XIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={T.ink} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ─── Plan data ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: '12mo',
    duration: '12 months',
    badge: 'BEST VALUE',
    badgeColor: '#2D7A4A',
    billing: '$179.88 billed yearly',
    original: '$34.99',
    price: '$14.99',
    unit: '/mo · save 57%',
  },
  {
    id: '6mo',
    duration: '6 months',
    badge: 'MOST CHOSEN',
    badgeColor: T.accent,
    billing: '$119.94 billed every 6 months',
    original: '$34.99',
    price: '$19.99',
    unit: '/mo · save 43%',
  },
  {
    id: '1mo',
    duration: '1 month',
    badge: null,
    billing: 'Billed monthly · cancel anytime',
    original: null,
    price: '$34.99',
    unit: '/ month',
  },
];

const FEATURES = [
  'Full verified details — ID, income & family',
  'Voice intros & private messaging',
  'Advanced filters — visa, community, gothram',
  'See everyone who\'s interested in you',
  'Unlimited daily matches & interests',
  'Private, incognito browsing',
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PremiumScreen() {
  const navigation = useNavigation();
  const [selected, setSelected] = useState('6mo');

  const selectedPlan = PLANS.find(p => p.id === selected);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Top bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.starLabel}>★</Text>
          <Text style={styles.headerTitle}>PREMIUM</Text>
        </View>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <XIcon />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Sphere ────────────────────────────────────────────────────── */}
        <View style={styles.sphereWrap}>
          <View style={[styles.sphere, { backgroundColor: '#F0E0B0' }]}>
            <Svg width={40} height={40} viewBox="0 0 24 24">
              <Path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="#5A3A06"
              />
            </Svg>
          </View>
        </View>

        {/* ── Headline ──────────────────────────────────────────────────── */}
        <Text style={styles.headline}>
          {'Be the introduction\nfamilies '}
          <Text style={styles.italic}>say yes</Text>
          {' to.'}
        </Text>

        {/* ── Subtitle ──────────────────────────────────────────────────── */}
        <Text style={styles.subtitle}>
          Premium opens the doors that matter — deeper verification, voice intros, and the filters serious families look for.
        </Text>

        {/* ── Social proof ──────────────────────────────────────────────── */}
        <View style={styles.socialRow}>
          <View style={styles.avatarStack}>
            <View style={[styles.avatar, { backgroundColor: '#B8865C', zIndex: 3 }]}>
              <Text style={styles.avatarText}>RT</Text>
            </View>
            <View style={[styles.avatar, { backgroundColor: '#C4858A', zIndex: 2, marginLeft: -10 }]}>
              <Text style={styles.avatarText}>AK</Text>
            </View>
            <View style={[styles.avatar, { zIndex: 1, marginLeft: -10 }, { backgroundColor: '#D4A574' }]} />
            <View style={styles.plusChip}>
              <Text style={styles.plusText}>+12k</Text>
            </View>
          </View>
          <View style={styles.socialRight}>
            <Text style={styles.stars}>★★★★★</Text>
            <Text style={styles.socialLabel}>12,000+ premium members</Text>
          </View>
        </View>

        {/* ── Features ──────────────────────────────────────────────────── */}
        <Text style={styles.featuresLabel}>EVERYTHING YOU UNLOCK</Text>
        <View style={styles.featuresCard}>
          {FEATURES.map((f, i) => (
            <View key={i} style={[styles.featureRow, i < FEATURES.length - 1 && styles.featureRowBorder]}>
              <View style={styles.checkBox}>
                <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                  <Path d="M20 6L9 17l-5-5" stroke={GOLD_INK} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* ── Plan chooser ──────────────────────────────────────────────── */}
        <View style={styles.planHeader}>
          <Text style={styles.planHeaderLabel}>CHOOSE A PLAN</Text>
          <Text style={styles.planHeaderRight}>7-day free trial included</Text>
        </View>

        {PLANS.map(plan => {
          const isSelected = selected === plan.id;
          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelected(plan.id)}
              activeOpacity={0.85}
            >
              {/* Radio */}
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <CheckIcon />}
              </View>

              {/* Plan info */}
              <View style={styles.planInfo}>
                <View style={styles.planNameRow}>
                  <Text style={styles.planDuration}>{plan.duration}</Text>
                  {plan.badge && (
                    <View style={[styles.badge, { backgroundColor: plan.badgeColor }]}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planBilling}>{plan.billing}</Text>
              </View>

              {/* Price */}
              <View style={styles.priceBlock}>
                {plan.original && (
                  <Text style={styles.priceOriginal}>{plan.original}</Text>
                )}
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.priceUnit}>{plan.unit}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Sticky CTA ────────────────────────────────────────────────── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.86}>
          <Text style={styles.ctaText}>Start 7-day free trial  ›</Text>
        </TouchableOpacity>
        <Text style={styles.finePrint}>
          Then {selectedPlan?.price}/mo, billed per {selectedPlan?.id === '12mo' ? '12 months' : selectedPlan?.id === '6mo' ? '6 months' : 'month'}. Cancel anytime.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },

  // ── Header ───────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starLabel: {
    fontSize: 14,
    color: GOLD_INK,
  },
  headerTitle: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    color: GOLD_INK,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scroll: { paddingHorizontal: 20, alignItems: 'center' },

  // ── Sphere ───────────────────────────────────────────────────────────────
  sphereWrap: {
    marginBottom: 20,
    shadowColor: GOLD_INK,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
    elevation: 8,
  },
  sphere: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // ── Headline ─────────────────────────────────────────────────────────────
  headline: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: T.accent,
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 14,
  },
  italic: {
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: T.mute,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 4,
  },

  // ── Social proof ─────────────────────────────────────────────────────────
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E8E4DE',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 24,
    alignSelf: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  plusChip: {
    marginLeft: -4,
    backgroundColor: GOLD_BG,
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  plusText: {
    fontSize: 10,
    fontWeight: '700',
    color: GOLD_INK,
  },
  socialRight: {
    gap: 1,
  },
  stars: {
    fontSize: 11,
    color: '#C8920A',
    letterSpacing: 1,
  },
  socialLabel: {
    fontSize: 11,
    color: T.mute,
    fontWeight: '500',
  },

  // ── Plan chooser ─────────────────────────────────────────────────────────
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  planHeaderLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
  },
  planHeaderRight: {
    fontSize: 11,
    color: T.mute,
  },
  planCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E0DCD6',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  planCardSelected: {
    borderColor: T.accent,
    borderWidth: 1.8,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C8C4BE',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  radioSelected: {
    backgroundColor: '#3A1A10',
    borderColor: '#3A1A10',
  },
  planInfo: {
    flex: 1,
    gap: 3,
  },
  planNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  planDuration: {
    fontSize: 15,
    fontWeight: '700',
    color: T.ink,
  },
  badge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 0.5,
    color: '#fff',
    fontWeight: '700',
  },
  planBilling: {
    fontSize: 12,
    color: T.mute,
  },
  priceBlock: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  priceOriginal: {
    fontSize: 11,
    color: T.mute,
    textDecorationLine: 'line-through',
  },
  price: {
    fontFamily: FONTS.display,
    fontSize: 22,
    fontWeight: '700',
    color: T.accent,
    lineHeight: 26,
  },
  priceUnit: {
    fontSize: 11,
    color: T.mute,
  },

  // ── Features ─────────────────────────────────────────────────────────────
  featuresLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: T.mute,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 10,
  },
  featuresCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0DCD6',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  featureRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E8E4DE',
  },
  checkBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: GOLD_BG,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  featureText: {
    fontSize: 14,
    color: T.ink,
    fontWeight: '500',
    flex: 1,
  },

  // ── Footer ───────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E8E4DE',
  },
  ctaBtn: {
    width: '100%',
    height: 54,
    backgroundColor: T.accent,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: T.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 6,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  finePrint: {
    fontSize: 12,
    color: T.mute,
    textAlign: 'center',
  },
});
