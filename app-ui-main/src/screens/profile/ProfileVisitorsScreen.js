import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import Avatar from '../../components/Avatar';

const { width } = Dimensions.get('window');

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function StarIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24">
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        fill="#D4A017" />
    </Svg>
  );
}

const VISITORS = [
  { name: 'Rohan K.', time: '2h ago', meta: '32 · NJ · H-1B · Software', premium: true, hidden: false },
  { name: 'Karthik R.', time: '4h ago', meta: '30 · CA · GC · Product', premium: false, hidden: false },
  { name: 'Aditya P.', time: 'Yesterday', meta: '34 · TX · GC · Doctor', premium: true, hidden: false },
  { name: 'Sai V.', time: 'Yesterday', meta: '29 · WA · H-1B · ML Engineer', premium: false, hidden: false },
  { name: 'Vikram S.', time: '2 days ago', meta: '33 · IL · Citizen · Finance', premium: false, hidden: false },
  { name: 'Premium member', time: '3 days ago', meta: 'Profile hidden', premium: false, hidden: true },
  { name: 'Akhil M.', time: '4 days ago', meta: '28 · NY · OPT · Designer', premium: false, hidden: false },
];

const TABS = ['Today', 'This week', 'All time'];

function VisitorRow({ visitor, onPress }) {
  return (
    <View style={styles.visitorRow}>
      <View style={styles.visitorAvatar}>
        {visitor.hidden ? (
          <View style={styles.hiddenAvatar}>
            <View style={styles.hiddenBlur} />
          </View>
        ) : (
          <Avatar name={visitor.name} size={50} />
        )}
      </View>
      <View style={styles.visitorInfo}>
        <View style={styles.visitorNameRow}>
          <Text style={[styles.visitorName, visitor.hidden && styles.visitorNameMuted]}>
            {visitor.name}
          </Text>
          {visitor.premium && <StarIcon />}
        </View>
        <Text style={styles.visitorMeta}>{visitor.meta}</Text>
      </View>
      <View style={styles.visitorRight}>
        <Text style={styles.visitorTime}>{visitor.time}</Text>
        {!visitor.hidden && (
          <TouchableOpacity style={styles.viewBtn} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.viewBtnText}>View</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function ProfileVisitorsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('This week');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBtn}>
          <BackArrow />
        </TouchableOpacity>
        <Text style={styles.topTitle}>PROFILE VISITORS</Text>
        <View style={styles.topBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Tab pills */}
        <View style={styles.tabsWrap}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statsLeft}>
            <View style={styles.statCountRow}>
              <Text style={styles.statBig}>128</Text>
              <Text style={styles.statDesc}> visited your profile</Text>
            </View>
            <Text style={styles.statTrend}>↑ 23% vs last week</Text>
          </View>
          <Text style={styles.mostRecent}>MOST RECENT</Text>
        </View>

        {/* Visitor list */}
        <View style={styles.list}>
          {VISITORS.map((v, i) => (
            <VisitorRow
              key={i}
              visitor={v}
              onPress={() => navigation.navigate('MatchDetail')}
            />
          ))}
        </View>

        {/* Premium upsell banner */}
        <View style={styles.premiumBanner}>
          <Text style={styles.premiumBannerText}>
            ⭐ See who hides — go <Text style={styles.premiumBannerLink}>Premium+</Text> to unblur all visitors.
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  topBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
  },
  tabsWrap: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: T.field,
    borderRadius: 100,
    padding: 4,
    gap: 2,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 100,
  },
  tabPillActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 13, color: T.mute, fontWeight: '500' },
  tabTextActive: { color: T.ink, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsLeft: {},
  statCountRow: { flexDirection: 'row', alignItems: 'baseline' },
  statBig: { fontFamily: FONTS.display, fontSize: 40, color: T.ink, fontWeight: '700' },
  statDesc: { fontSize: 15, color: T.ink, fontWeight: '500' },
  statTrend: { fontSize: 13, color: T.verify, fontWeight: '600', marginTop: 2 },
  mostRecent: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: T.mute,
    alignSelf: 'flex-start',
    paddingTop: 6,
  },
  list: { paddingHorizontal: 16 },
  visitorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    gap: 12,
  },
  visitorAvatar: {},
  hiddenAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: T.hair2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenBlur: {
    width: '100%',
    height: '100%',
    backgroundColor: T.field,
  },
  visitorInfo: { flex: 1 },
  visitorNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  visitorName: { fontSize: 15, fontWeight: '600', color: T.ink },
  visitorNameMuted: { color: T.mute },
  visitorMeta: { fontSize: 12, color: T.mute },
  visitorRight: { alignItems: 'flex-end', gap: 6 },
  visitorTime: { fontSize: 12, color: T.mute },
  viewBtn: {
    backgroundColor: T.accent,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  viewBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  premiumBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: T.accentSoft,
    borderRadius: 14,
    padding: 14,
  },
  premiumBannerText: { fontSize: 13, color: T.accentInk, lineHeight: 20 },
  premiumBannerLink: { fontWeight: '700', color: T.accent },
});
