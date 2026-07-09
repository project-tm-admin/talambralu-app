import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';

function BackArrow() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckmarkIcon() {
  return (
    <Svg width={28} height={28} viewBox="0 0 28 28" fill="none">
      <Path d="M6 14l5.5 5.5L22 8" stroke="white" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CameraIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="#2E8B7A" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="12" cy="13" r="4" stroke="#2E8B7A" strokeWidth={1.7} />
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="2" width="14" height="20" rx="2" stroke="#7A50C8" strokeWidth={1.7} fill="none" />
      <Path d="M9 6h6" stroke="#7A50C8" strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx="12" cy="17" r="1" fill="#7A50C8" />
    </Svg>
  );
}

function CardIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect x="1" y="4" width="22" height="16" rx="2" stroke="#3A78C9" strokeWidth={1.7} fill="none" />
      <Path d="M1 10h22" stroke="#3A78C9" strokeWidth={1.7} />
      <Path d="M5 15h4" stroke="#3A78C9" strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M5 17.5h2.5" stroke="#3A78C9" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function DollarIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2v20" stroke="#3D8A5C" strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#3D8A5C" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

function GradCapIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M22 10L12 5 2 10l10 5 10-5z" stroke="#A07040" strokeWidth={1.7} strokeLinejoin="round" />
      <Path d="M6 12.5v5c4 2.5 12 2.5 12 0v-5" stroke="#A07040" strokeWidth={1.7} strokeLinecap="round" />
      <Path d="M22 10v4" stroke="#A07040" strokeWidth={1.7} strokeLinecap="round" />
    </Svg>
  );
}

const ROWS = [
  {
    IconComp: CameraIcon,
    iconBg: '#C2EDE7',
    title: 'Face verification',
    subtitle: 'Verified 14 Mar 2026',
    action: { type: 'link', label: 'Re-verify' },
  },
  {
    IconComp: PhoneIcon,
    iconBg: '#EDE2F7',
    title: 'Phone number',
    subtitle: '+1 (415) ••• +24',
    action: { type: 'link', label: 'Change' },
  },
  {
    IconComp: CardIcon,
    iconBg: '#D4E8F7',
    title: 'Visa status — H-1B',
    subtitle: 'Valid until 09/2028',
    action: { type: 'link', label: 'Update doc' },
  },
  {
    IconComp: DollarIcon,
    iconBg: '#DCEFE2',
    title: 'Income range',
    subtitle: 'Paystub under review',
    action: { type: 'badge', label: 'IN REVIEW' },
  },
  {
    IconComp: GradCapIcon,
    iconBg: '#F5EDE0',
    title: 'Education — MS, CMU',
    subtitle: 'Add a transcript or diploma',
    action: { type: 'accent', label: 'Verify now' },
  },
];

export default function EditTrustScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn} activeOpacity={0.7}>
          <BackArrow />
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>TRUST & VERIFICATION</Text>
        <View style={styles.topBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Trust Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreCircle}>
            <CheckmarkIcon />
          </View>
          <View style={styles.scoreText}>
            <Text style={styles.scoreTitle}>3 of 5 verified</Text>
            <Text style={styles.scoreSub}>Verified profiles get 3× more interest from matches.</Text>
          </View>
        </View>

        {/* Section Label */}
        <Text style={styles.sectionLabel}>VERIFICATIONS</Text>

        {/* Verification Rows */}
        <View style={styles.rowList}>
          {ROWS.map((row, i) => {
            const { IconComp, iconBg, title, subtitle, action } = row;
            const isLast = i === ROWS.length - 1;
            return (
              <View key={i}>
                <View style={styles.row}>
                  <View style={[styles.iconSquare, { backgroundColor: iconBg }]}>
                    <IconComp />
                  </View>
                  <View style={styles.rowMiddle}>
                    <Text style={styles.rowTitle}>{title}</Text>
                    <Text style={styles.rowSub}>{subtitle}</Text>
                  </View>
                  {action.type === 'link' && (
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.actionLink}>{action.label}</Text>
                    </TouchableOpacity>
                  )}
                  {action.type === 'badge' && (
                    <View style={styles.inReviewBadge}>
                      <Text style={styles.inReviewText}>{action.label}</Text>
                    </View>
                  )}
                  {action.type === 'accent' && (
                    <TouchableOpacity activeOpacity={0.7}>
                      <Text style={styles.accentLink}>{action.label}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {!isLast && <View style={styles.hairline} />}
              </View>
            );
          })}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: '#FFFFFF',
  },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
    gap: 4,
  },
  backLabel: {
    fontSize: 15,
    color: T.ink,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: T.ink,
    fontWeight: '600',
  },
  saveLabel: {
    fontSize: 15,
    color: T.accent,
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 60,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#DCEFE2',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3D8A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E5C3A',
    marginBottom: 4,
  },
  scoreSub: {
    fontSize: 13,
    color: '#3D6B50',
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    letterSpacing: 1.4,
    color: T.mute,
    fontWeight: '600',
    marginBottom: 10,
  },
  rowList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  iconSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowMiddle: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 2,
  },
  rowSub: {
    fontSize: 12,
    color: T.mute,
  },
  actionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: T.verify,
  },
  accentLink: {
    fontSize: 14,
    fontWeight: '600',
    color: T.accent,
  },
  inReviewBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inReviewText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C05621',
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.hair,
    marginLeft: 56,
  },
});
