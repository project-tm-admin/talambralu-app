/**
 * My Profile / Settings Screen — new app-ui-main UI + Firebase backend
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useApp } from '../../store/AppContext';
import { getAgeFromDob } from '../../utils/matchScore';
import { computeProfileCompleteness } from '../../utils/profileCompleteness';

const GOLD  = '#C8920A';
const GOLD_S = '#FEF3D4';

// ─── Icons ────────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12l6-6M4 12l6 6" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function ChevronRight({ color = T.hair2 }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function PersonIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={T.ink} strokeWidth={1.6} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={T.ink} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
function ShieldIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L3 7v6c0 5 4 9.5 9 11 5-1.5 9-6 9-11V7l-9-5z" stroke={T.ink} strokeWidth={1.6} />
    </Svg>
  );
}
function BellIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={T.ink} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M13.73 21a2 2 0 01-3.46 0" stroke={T.ink} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
function LockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="11" width="18" height="11" rx="2" stroke={T.ink} strokeWidth={1.6} />
      <Path d="M7 11V7a5 5 0 0110 0v4" stroke={T.ink} strokeWidth={1.6} />
    </Svg>
  );
}
function HelpIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={T.ink} strokeWidth={1.6} />
      <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" stroke={T.ink} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx="12" cy="17" r="0.8" fill={T.ink} />
    </Svg>
  );
}
function ChatIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" stroke={T.ink} strokeWidth={1.6} strokeLinejoin="round" />
    </Svg>
  );
}
function DocIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" stroke={T.ink} strokeWidth={1.6} />
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={T.ink} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
function StarFilled() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24">
      <Polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={GOLD} />
    </Svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function MiniAvatar({ label, bg, index }) {
  return (
    <View style={[ms.miniAvatar, { marginLeft: index > 0 ? -8 : 0, zIndex: 10 - index, backgroundColor: bg || T.field }]}>
      {label ? <Text style={ms.miniAvatarText}>{label}</Text> : null}
    </View>
  );
}

function SettingsGroup({ label, rows }) {
  return (
    <View style={ms.group}>
      <Text style={ms.groupLabel}>{label}</Text>
      <View style={ms.groupCard}>
        {rows.map((row, i) => (
          <TouchableOpacity
            key={i}
            style={[ms.row, i < rows.length - 1 && ms.rowBorder]}
            onPress={row.onPress}
            activeOpacity={row.onPress ? 0.75 : 1}
          >
            <View style={ms.rowIcon}>{row.icon}</View>
            <View style={ms.rowText}>
              <Text style={ms.rowTitle}>{row.title}</Text>
              {!!row.subtitle && <Text style={ms.rowSub}>{row.subtitle}</Text>}
            </View>
            {!!row.onPress && <ChevronRight />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MyProfileScreen() {
  const navigation = useNavigation();
  const { userDoc, isPremium, logout, pendingRequests } = useApp();

  const p = userDoc?.profile || {};
  // 'name' is the full name saved by NameDOBScreen; fall back gracefully
  const fullName = p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || 'My Profile';
  const initials = fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const phone = userDoc?.phone || '';
  const email = userDoc?.email || '';
  const contactLine = [phone ? `${phone.slice(0, 4)} ••• ${phone.slice(-4)}` : null, email].filter(Boolean).join(' · ');

  const { pct: completePct, missing: missingFields } = computeProfileCompleteness(userDoc);

  const visitors    = userDoc?.visitorCount     || 0;
  const shortlisted = userDoc?.shortlistedCount  || 0;
  const yourShort   = userDoc?.yourShortlist?.length || 0;

  const activityCards = [
    { count: visitors,    label: 'VISITORS',        screen: 'ProfileVisitors', highlighted: false,
      avatars: [{ label: 'RV', bg: '#A87860' }, { label: 'KB', bg: '#8BA8C4' }] },
    { count: shortlisted, label: 'SHORTLISTED YOU', screen: 'ShortlistedYou', highlighted: true,
      avatars: [{ label: 'AP', bg: '#C4956A' }, { label: 'NT', bg: '#8AC4A0' }] },
    { count: yourShort,   label: 'YOUR SHORTLIST',  screen: 'YourShortlist',  highlighted: false,
      avatars: [{ label: 'DK', bg: '#A8A0C4' }, { label: 'NK', bg: '#C4A870' }] },
  ];

  const accountRows = [
    { icon: <PersonIcon />, title: 'Edit profile',     subtitle: 'Photos, basics, prompts',       onPress: () => navigation.navigate('EditProfile') },
    { icon: <ShieldIcon />, title: 'Privacy & blocked', subtitle: 'Profile visibility',            onPress: () => navigation.navigate('Privacy') },
    { icon: <BellIcon />,   title: 'Notifications',    subtitle: 'Push · email',                  onPress: () => navigation.navigate('Notifications') },
    { icon: <LockIcon />,   title: 'Login & security', subtitle: 'Phone · email · passkey',       onPress: () => navigation.navigate('LoginSecurity') },
  ];
  const supportRows = [
    { icon: <HelpIcon />, title: 'Help & FAQs' },
    { icon: <ChatIcon />, title: 'Contact us' },
    { icon: <DocIcon />,  title: 'Terms & privacy' },
  ];

  return (
    <SafeAreaView style={ms.safe} edges={['top']}>
      <View style={ms.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={ms.topBtn} hitSlop={8}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={ms.topTitle}>SETTINGS</Text>
        <View style={ms.topBtn} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ms.scroll}>

        {/* Identity row */}
        <View style={ms.identityRow}>
          <View style={ms.avatarCircle}>
            <View style={[StyleSheet.absoluteFill, { backgroundColor: '#C4856A' }]} />
            <Text style={ms.avatarInitials}>{initials || '👤'}</Text>
          </View>
          <View style={ms.identityText}>
            <Text style={ms.identityName}>{fullName}</Text>
            {!!contactLine && <Text style={ms.identitySub}>{contactLine}</Text>}
          </View>
        </View>

        {/* Profile completeness */}
        {completePct < 100 && (
          <View style={ms.completeCard}>
            <View style={ms.completeHeader}>
              <Text style={ms.completeTitle}>Profile {completePct}% complete</Text>
              <Text style={ms.completeSub}>
                {missingFields.length > 0 ? `Add: ${missingFields.slice(0, 2).join(', ')}` : 'Almost there!'}
              </Text>
            </View>
            <View style={ms.completeTrack}>
              <View style={[ms.completeFill, { width: `${completePct}%` }]} />
            </View>
          </View>
        )}

        {/* Activity */}
        <Text style={ms.groupLabel}>MY ACTIVITY</Text>
        <View style={ms.activityRow}>
          {activityCards.map(card => (
            <TouchableOpacity
              key={card.label}
              style={[ms.activityCard, card.highlighted && ms.activityCardHighlight]}
              onPress={() => navigation.navigate(card.screen)}
              activeOpacity={0.8}
            >
              <View style={ms.activityTop}>
                <Text style={ms.activityCount}>{card.count}</Text>
                <ChevronRight color={card.highlighted ? T.accent : T.mute} />
              </View>
              <Text style={[ms.activityLabel, card.highlighted && ms.activityLabelHighlight]}>
                {card.label}
              </Text>
              <View style={ms.activityAvatars}>
                {card.avatars.map((av, i) => <MiniAvatar key={i} index={i} label={av.label} bg={av.bg} />)}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Premium banner — show only if not premium */}
        {!isPremium && (
          <View style={ms.premiumCard}>
            <View style={ms.premiumLeft}>
              <View style={ms.starCircle}><StarFilled /></View>
              <View style={ms.premiumTextBlock}>
                <Text style={ms.premiumTitle}>Try Talambralu Premium</Text>
                <Text style={ms.premiumSub}>
                  Unlimited discovery · verified details · voice intros · private browsing.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={ms.premiumBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Premium')}>
              <Text style={ms.premiumBtnText}>See plans  ›</Text>
            </TouchableOpacity>
          </View>
        )}

        <SettingsGroup label="ACCOUNT" rows={accountRows} />
        <SettingsGroup label="SUPPORT" rows={supportRows} />

        <TouchableOpacity style={ms.signOutBtn} activeOpacity={0.7} onPress={logout}>
          <Text style={ms.signOutText}>Sign out</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ms = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.hair },
  topBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  topTitle: { flex: 1, textAlign: 'center', fontFamily: FONTS.mono, fontSize: 12, letterSpacing: 1.5, color: T.ink },
  scroll: { paddingHorizontal: 20, paddingTop: 20 },

  identityRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  avatarInitials: { fontSize: 22, fontWeight: '700', color: '#fff', zIndex: 1 },
  identityText: { flex: 1 },
  identityName: { fontFamily: FONTS.display, fontSize: 22, color: T.ink, marginBottom: 3 },
  identitySub: { fontSize: 13, color: T.mute },

  activityRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  activityCard: { flex: 1, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: T.hair, padding: 12, gap: 4 },
  activityCardHighlight: { backgroundColor: '#FAEAE8', borderColor: '#F0C8C0' },
  activityTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activityCount: { fontFamily: FONTS.display, fontSize: 26, color: T.ink, lineHeight: 30 },
  activityLabel: { fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 0.6, color: T.mute },
  activityLabelHighlight: { color: T.accent },
  activityAvatars: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#fff' },
  miniAvatarText: { fontSize: 7, fontWeight: '800', color: '#fff' },

  premiumCard: { backgroundColor: GOLD_S, borderRadius: 16, padding: 16, marginBottom: 28, gap: 12 },
  premiumLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  starCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', flexShrink: 0,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  premiumTextBlock: { flex: 1 },
  premiumTitle: { fontFamily: FONTS.display, fontSize: 18, color: T.accent, marginBottom: 4 },
  premiumSub: { fontSize: 13, color: T.mute, lineHeight: 19 },
  premiumBtn: { backgroundColor: T.accent, borderRadius: 100, paddingVertical: 13, alignItems: 'center',
    shadowColor: T.accent, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.22, shadowRadius: 8, elevation: 4 },
  premiumBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  group: { marginBottom: 24 },
  groupLabel: { fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', color: T.mute, marginBottom: 10 },
  groupCard: { borderWidth: 1, borderColor: T.hair, borderRadius: 16, overflow: 'hidden', backgroundColor: T.bg },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 14, backgroundColor: T.bg },
  rowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: T.hair },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.field, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '500', color: T.ink, marginBottom: 2 },
  rowSub: { fontSize: 12, color: T.mute },

  signOutBtn: { alignItems: 'center', paddingVertical: 14 },
  signOutText: { fontSize: 15, color: '#E53E3E', fontWeight: '500' },

  completeCard: {
    borderWidth: 1, borderColor: T.hair, borderRadius: 16,
    padding: 16, marginBottom: 20, backgroundColor: T.bg,
  },
  completeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  completeTitle: { fontSize: 14, fontWeight: '600', color: T.ink },
  completeSub: { fontSize: 12, color: T.mute, flex: 1, textAlign: 'right', marginLeft: 8 },
  completeTrack: { height: 4, backgroundColor: T.hair2, borderRadius: 2, overflow: 'hidden' },
  completeFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
});
