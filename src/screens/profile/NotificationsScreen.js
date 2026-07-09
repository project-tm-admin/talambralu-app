import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';

// ─── Icons ───────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12L10 6M4 12L10 18"
        stroke={T.ink}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 3l5 5-5 5"
        stroke={T.mute}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ title }) {
  return <Text style={styles.sectionLabel}>{title}</Text>;
}

// ─── Row components ───────────────────────────────────────────────────────────

function ToggleRow({ title, subtitle, value, onValueChange, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: T.hair, true: T.accent }}
        thumbColor="#fff"
        ios_backgroundColor={T.hair}
      />
    </View>
  );
}

function ChevronRow({ title, value, onPress, isLast }) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.rowTitle, { flex: 1 }]}>{title}</Text>
      <View style={styles.chevronRight}>
        <Text style={styles.chevronValue}>{value}</Text>
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
  const navigation = useNavigation();

  // CHANNELS
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  // NOTIFY ME ABOUT
  const [newInterests, setNewInterests] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [newMatches, setNewMatches] = useState(true);
  const [profileVisitors, setProfileVisitors] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <View style={styles.backRow}>
            <BackArrow />
            <Text style={styles.backText}>Back</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.topTitle}>NOTIFICATIONS</Text>

        <View style={styles.topBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── CHANNELS ── */}
        <SectionLabel title="CHANNELS" />
        <Card>
          <ToggleRow
            title="Push notifications"
            subtitle="On this device"
            value={pushEnabled}
            onValueChange={setPushEnabled}
          />
          <ToggleRow
            title="Email"
            subtitle="anika@gmail.com"
            value={emailEnabled}
            onValueChange={setEmailEnabled}
          />
          <ToggleRow
            title="WhatsApp"
            subtitle="+1 415 ••• 2419"
            value={whatsappEnabled}
            onValueChange={setWhatsappEnabled}
            isLast
          />
        </Card>

        {/* ── NOTIFY ME ABOUT ── */}
        <SectionLabel title="NOTIFY ME ABOUT" />
        <Card>
          <ToggleRow
            title="New interests received"
            value={newInterests}
            onValueChange={setNewInterests}
          />
          <ToggleRow
            title="New messages"
            value={newMessages}
            onValueChange={setNewMessages}
          />
          <ToggleRow
            title="New matches for you"
            value={newMatches}
            onValueChange={setNewMatches}
          />
          <ToggleRow
            title="Profile visitors"
            value={profileVisitors}
            onValueChange={setProfileVisitors}
          />
          <ToggleRow
            title="Promotions & tips"
            value={promotions}
            onValueChange={setPromotions}
            isLast
          />
        </Card>

        {/* ── QUIET HOURS ── */}
        <SectionLabel title="QUIET HOURS" />
        <Card>
          <ChevronRow
            title="Pause notifications"
            value="10:00 PM – 7:00 AM"
            onPress={() => {}}
            isLast
          />
        </Card>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Top bar ────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  topBtn: {
    width: 72,
    height: 40,
    justifyContent: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backText: {
    fontSize: 15,
    color: T.ink,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: T.ink,
  },

  // ── Scroll content ─────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  // ── Section label ──────────────────────────────────────────────────────────
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: T.mute,
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── Card ───────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.hair,
    overflow: 'hidden',
  },

  // ── Row ────────────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: T.ink,
  },
  rowSubtitle: {
    fontSize: 12,
    color: T.mute,
    marginTop: 2,
  },

  // ── Chevron row ────────────────────────────────────────────────────────────
  chevronRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chevronValue: {
    fontSize: 14,
    color: T.mute,
  },
});
