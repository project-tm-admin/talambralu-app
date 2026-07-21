import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useApp } from '../../store/AppContext';
import {
  savePrivacySettings,
  getBlockedUsers,
  unblockUser,
  fetchUsersByIds,
} from '../../firebase/firestore';

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULTS = {
  showOnlineStatus: true,
  showLastSeen:     false,
  readReceipts:     true,
  incognito:        false,
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function BackArrow() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 12H4M4 12l6-6M4 12l6 6"
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
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={T.mute}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function InitialAvatar({ initial, bg }) {
  return (
    <View style={[styles.avatar, { backgroundColor: bg || T.hair, justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={styles.avatarInitial}>{initial || '?'}</Text>
    </View>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, right }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {right}
    </View>
  );
}

// ─── Visibility row ───────────────────────────────────────────────────────────

function VisibilityRow({ label, value, borderBottom }) {
  return (
    <TouchableOpacity style={[styles.row, borderBottom && styles.rowBorder]} activeOpacity={0.7}>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Text style={styles.rowValue}>{value}</Text>
        <ChevronRight />
      </View>
    </TouchableOpacity>
  );
}

// ─── Toggle row ───────────────────────────────────────────────────────────────

function ToggleRow({ label, subtitle, value, onValueChange, borderBottom }) {
  return (
    <View style={[styles.row, borderBottom && styles.rowBorder]}>
      <View style={styles.toggleLabelWrap}>
        <Text style={styles.rowLabel}>{label}</Text>
        {subtitle ? <Text style={styles.toggleSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: T.hair, true: T.accent }}
        thumbColor="#FFFFFF"
        ios_backgroundColor={T.hair}
      />
    </View>
  );
}

// ─── Blocked user row ─────────────────────────────────────────────────────────

// Derive initials + a consistent bg colour from a name string
const BG_PALETTE = ['#C4856A', '#8BA8C4', '#8AC4A0', '#C4A88B', '#A88BC4'];
function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % BG_PALETTE.length;
  return BG_PALETTE[h];
}

function BlockedRow({ user, onUnblock, borderBottom }) {
  const name = user.profile?.firstName
    ? `${user.profile.firstName} ${(user.profile.lastName || '').slice(0, 1)}.`.trim()
    : 'Unknown';
  const age  = user.profile?.age  || user.profile?.dob ? '' : '';
  const city = user.profile?.city || '';
  const meta = [age, city].filter(Boolean).join(' · ');

  return (
    <View style={[styles.row, styles.blockedRow, borderBottom && styles.rowBorder]}>
      <InitialAvatar initial={name[0]} bg={nameColor(name)} />
      <View style={styles.blockedInfo}>
        <Text style={styles.blockedName}>{name}</Text>
        {meta ? <Text style={styles.blockedMeta}>{meta}</Text> : null}
      </View>
      <TouchableOpacity style={styles.unblockBtn} activeOpacity={0.7} onPress={onUnblock}>
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PrivacyScreen() {
  const navigation = useNavigation();
  const { userDoc, firebaseUser } = useApp();
  const isPremium = userDoc?.isPremium || false;

  const [prefs, setPrefs]               = useState({ ...DEFAULTS });
  const [blocked, setBlocked]           = useState([]);
  const [blockedLoading, setBLoading]   = useState(true);
  const saveTimer                       = useRef(null);

  // Hydrate prefs from Firestore on mount
  useEffect(() => {
    const saved = userDoc?.settings?.privacy;
    if (saved) setPrefs(prev => ({ ...prev, ...saved }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load blocked users
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) { setBLoading(false); return; }
    (async () => {
      try {
        const entries = await getBlockedUsers(uid); // returns [{ uid, ... }]
        if (entries.length > 0) {
          const uids  = entries.map(e => e.uid);
          const users = await fetchUsersByIds(uids);
          setBlocked(users);
        }
      } catch (e) {
        console.error('Failed to load blocked users:', e);
      } finally {
        setBLoading(false);
      }
    })();
  }, [firebaseUser?.uid]);

  // Cleanup debounce on unmount
  useEffect(() => () => clearTimeout(saveTimer.current), []);

  const updatePref = useCallback((key, value) => {
    // Premium gate for incognito
    if (key === 'incognito' && value && !isPremium) {
      Alert.alert(
        'Premium Required',
        'Incognito browsing is a Talambralu Premium feature. Upgrade to browse profiles invisibly.',
        [{ text: 'OK' }]
      );
      return;
    }
    setPrefs(prev => {
      const next = { ...prev, [key]: value };
      clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        const uid = firebaseUser?.uid;
        if (uid) savePrivacySettings(uid, next).catch(console.error);
      }, 500);
      return next;
    });
  }, [firebaseUser, isPremium]);

  const handleUnblock = useCallback(async (theirUid) => {
    Alert.alert('Unblock user?', 'They will be able to find and send you interests again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        style: 'destructive',
        onPress: async () => {
          try {
            await unblockUser(firebaseUser.uid, theirUid);
            setBlocked(prev => prev.filter(u => u.uid !== theirUid));
          } catch (e) {
            console.error('Unblock failed:', e);
            Alert.alert('Error', 'Could not unblock this user. Please try again.');
          }
        },
      },
    ]);
  }, [firebaseUser?.uid]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <BackArrow />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.topTitle}>PRIVACY &amp; BLOCKED</Text>

        <View style={styles.topSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROFILE VISIBILITY ── */}
        <SectionHeader label="PROFILE VISIBILITY" />
        <View style={styles.card}>
          <VisibilityRow
            label="Who can see my profile"
            value="Verified only"
            borderBottom
          />
          <VisibilityRow
            label="Photo visibility"
            value="Blur until accepted"
          />
        </View>

        {/* ── PRIVACY ── */}
        <SectionHeader label="PRIVACY" />
        <View style={styles.card}>
          <ToggleRow
            label="Show online status"
            value={prefs.showOnlineStatus}
            onValueChange={v => updatePref('showOnlineStatus', v)}
            borderBottom
          />
          <ToggleRow
            label="Show last seen"
            value={prefs.showLastSeen}
            onValueChange={v => updatePref('showLastSeen', v)}
            borderBottom
          />
          <ToggleRow
            label="Read receipts"
            value={prefs.readReceipts}
            onValueChange={v => updatePref('readReceipts', v)}
            borderBottom
          />
          <ToggleRow
            label="Incognito browsing"
            subtitle={
              isPremium
                ? 'Visit profiles without being seen'
                : 'Visit profiles without being seen · Premium'
            }
            value={prefs.incognito}
            onValueChange={v => updatePref('incognito', v)}
          />
        </View>

        {/* ── BLOCKED ── */}
        <SectionHeader
          label={`BLOCKED · ${blocked.length}`}
          right={
            blocked.length > 3 ? (
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            ) : null
          }
        />
        <View style={styles.card}>
          {blockedLoading ? (
            <View style={styles.emptyBlocked}>
              <ActivityIndicator size="small" color={T.mute} />
            </View>
          ) : blocked.length === 0 ? (
            <View style={styles.emptyBlocked}>
              <Text style={styles.emptyBlockedText}>No blocked users</Text>
            </View>
          ) : (
            blocked.slice(0, 3).map((u, i) => (
              <BlockedRow
                key={u.uid}
                user={u}
                onUnblock={() => handleUnblock(u.uid)}
                borderBottom={i < Math.min(blocked.length, 3) - 1}
              />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: 72,
  },
  backText: {
    fontSize: 15,
    color: T.ink,
    marginLeft: 4,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.mono,
    fontSize: 12,
    letterSpacing: 1.2,
    color: T.ink,
  },
  topSpacer: {
    minWidth: 72,
  },

  // ── Scroll ───────────────────────────────────────────────────────────────────
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ── Section header ───────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1.1,
    color: T.mute,
  },
  seeAll: {
    fontSize: 13,
    color: T.accent,
    fontWeight: '500',
  },

  // ── Card ─────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.hair,
    overflow: 'hidden',
  },

  // ── Generic row ──────────────────────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: T.hair,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: T.ink,
    fontWeight: '400',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    color: T.mute,
    marginRight: 2,
  },

  // ── Toggle row extras ─────────────────────────────────────────────────────────
  toggleLabelWrap: {
    flex: 1,
    marginRight: 12,
  },
  toggleSubtitle: {
    fontSize: 12,
    color: T.mute,
    marginTop: 2,
    lineHeight: 16,
  },

  // ── Blocked row ───────────────────────────────────────────────────────────────
  blockedRow: {
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    flexShrink: 0,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  blockedInfo: {
    flex: 1,
  },
  blockedName: {
    fontSize: 15,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 2,
  },
  blockedMeta: {
    fontSize: 12,
    color: T.mute,
    lineHeight: 16,
  },
  unblockBtn: {
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexShrink: 0,
  },
  unblockText: {
    fontSize: 13,
    color: T.ink,
    fontWeight: '500',
  },

  // ── Empty blocked state ───────────────────────────────────────────────────────
  emptyBlocked: {
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptyBlockedText: {
    fontSize: 14,
    color: T.mute,
  },
});
