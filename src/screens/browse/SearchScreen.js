/**
 * Search / Discovery Screen — new app-ui-main UI + Firebase backend
 */
import React, { useState, useMemo } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, Image, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { useDiscoveryFilters } from '../../hooks/useDiscoveryFilters';
import { getAgeFromDob } from '../../utils/matchScore';

const GOLD  = '#C8920A';
const GOLD_S = '#FEF3D4';

const CHIP_OPTIONS = ['All', 'US-based', 'Verified', 'Same Caste', 'Software', 'Finance', 'Medicine', 'H1B', 'GC/Citizen'];

// ─── Icons ────────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={T.mute} strokeWidth={1.8} />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
function FilterIcon() {
  return (
    <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
      <Line x1="4" y1="6" x2="20" y2="6" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
      <Line x1="12" y1="18" x2="12" y2="18" stroke={T.ink} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}
function VerifiedBadge() {
  return (
    <Svg width={15} height={15} viewBox="0 0 18 18">
      <Circle cx="9" cy="9" r="9" fill="#3D8A5C" />
      <Path d="M5 9l3 3 5-5" stroke="white" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function LocationIcon() {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke={T.mute} strokeWidth={1.6} />
      <Circle cx="12" cy="9" r="2.5" stroke={T.mute} strokeWidth={1.4} />
    </Svg>
  );
}

// ─── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({ item, onPress }) {
  const p = item.profile || item;
  const uid = item.uid || item.id;
  const age = getAgeFromDob(p.dob);
  const firstName = p.fullName?.split(' ')[0] || 'Profile';
  const location = [p.usCity, p.usState].filter(Boolean).join(', ') || p.nativeCity || '';
  const jobLine = p.jobTitle || p.occupation || '';
  const photo = p.photos?.[0];

  return (
    <TouchableOpacity style={cs.card} onPress={() => onPress(uid)} activeOpacity={0.88}>
      <View style={cs.cardPhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#D4A5A0', justifyContent: 'center', alignItems: 'center' }]}>
            <Text style={{ fontSize: 34 }}>👤</Text>
          </View>
        )}
        {p.isFaceVerified && (
          <View style={cs.verifiedBadge}><VerifiedBadge /></View>
        )}
      </View>
      <View style={cs.cardBody}>
        <Text style={cs.cardName}>{firstName}, {age}</Text>
        {!!location && (
          <View style={cs.infoRow}>
            <LocationIcon />
            <Text style={cs.infoText} numberOfLines={1}>{location}</Text>
          </View>
        )}
        {!!jobLine && (
          <Text style={cs.jobText} numberOfLines={1}>{jobLine}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function SearchScreen() {
  const navigation = useNavigation();
  const [query, setQuery]       = useState('');
  const [activeChip, setChip]   = useState('All');

  const filters = useMemo(() => {
    const base = {};
    if (activeChip === 'US-based')   base.country = 'United States';
    if (activeChip === 'Verified')   base.isFaceVerified = true;
    if (activeChip === 'Same Caste') base.sameCaste = true;
    if (activeChip === 'H1B')        base.visaStatus = 'H1B';
    if (activeChip === 'GC/Citizen') base.visaStatuses = ['GC', 'Citizen', 'Green Card'];
    if (['Software', 'Finance', 'Medicine'].includes(activeChip)) base.fieldOfWork = activeChip;
    return base;
  }, [activeChip]);

  const { profiles = [], loading } = useDiscoveryFilters(filters);

  const filtered = useMemo(() => {
    if (!query.trim()) return profiles;
    const q = query.toLowerCase();
    return profiles.filter(p => {
      const pr = p.profile || p;
      return (
        pr.fullName?.toLowerCase().includes(q) ||
        pr.jobTitle?.toLowerCase().includes(q) ||
        pr.occupation?.toLowerCase().includes(q) ||
        pr.usCity?.toLowerCase().includes(q) ||
        pr.nativeCity?.toLowerCase().includes(q) ||
        pr.education?.toLowerCase().includes(q)
      );
    });
  }, [profiles, query]);

  function openProfile(uid) {
    navigation.navigate('MatchDetail', { uid });
  }

  return (
    <SafeAreaView style={ss.safe} edges={['top']}>
      {/* Header */}
      <View style={ss.header}>
        <Text style={ss.headerTitle}>Find Matches</Text>
        <TouchableOpacity style={ss.filterBtn} onPress={() => navigation.navigate('Filters')} activeOpacity={0.75}>
          <FilterIcon />
          <Text style={ss.filterBtnText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={ss.searchRow}>
        <View style={ss.searchBar}>
          <SearchIcon />
          <TextInput
            style={ss.searchInput}
            placeholder="Search by name, city, job…"
            placeholderTextColor={T.mute}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={ss.chips}
        style={ss.chipScroll}
      >
        {CHIP_OPTIONS.map(chip => (
          <TouchableOpacity
            key={chip}
            style={[ss.chip, activeChip === chip && ss.chipActive]}
            onPress={() => setChip(chip)}
            activeOpacity={0.75}
          >
            <Text style={[ss.chipText, activeChip === chip && ss.chipTextActive]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      {loading ? (
        <View style={ss.loadWrap}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={ss.loadText}>Searching…</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={ss.emptyWrap}>
          <Text style={{ fontSize: 48 }}>🌸</Text>
          <Text style={ss.emptyTitle}>No results found</Text>
          <Text style={ss.emptyText}>Try adjusting your filters or search terms.</Text>
          <TouchableOpacity style={ss.clearBtn} onPress={() => { setQuery(''); setChip('All'); }}>
            <Text style={ss.clearBtnText}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.uid || item.id || Math.random().toString()}
          numColumns={2}
          columnWrapperStyle={ss.row}
          contentContainerStyle={ss.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={ss.halfWidth}>
              <ProfileCard item={item} onPress={openProfile} />
            </View>
          )}
          ListHeaderComponent={
            <Text style={ss.resultCount}>{filtered.length} profile{filtered.length !== 1 ? 's' : ''} found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const ss = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  headerTitle: { fontFamily: FONTS.display, fontSize: 24, color: T.accent },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1, borderColor: T.hair2 },
  filterBtnText: { fontSize: 13, color: T.ink, fontWeight: '500' },

  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: T.hair,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4,
  },
  searchInput: { flex: 1, fontSize: 15, color: T.ink, padding: 0 },

  chipScroll: { flexGrow: 0, marginBottom: 10 },
  chips: { paddingHorizontal: 14, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, borderWidth: 1, borderColor: T.hair, backgroundColor: '#fff' },
  chipActive: { backgroundColor: T.accent, borderColor: T.accent },
  chipText: { fontSize: 13, color: T.ink, fontWeight: '500' },
  chipTextActive: { color: '#fff' },

  loadWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 10 },
  loadText: { fontSize: 14, color: T.mute },

  emptyWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, padding: 40 },
  emptyTitle: { fontFamily: FONTS.display, fontSize: 22, color: T.ink, marginTop: 8 },
  emptyText: { fontSize: 14, color: T.mute, textAlign: 'center' },
  clearBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 100, borderWidth: 1.2, borderColor: T.accent },
  clearBtnText: { fontSize: 14, color: T.accent, fontWeight: '600' },

  resultCount: { fontSize: 12, color: T.mute, marginHorizontal: 14, marginBottom: 8, fontStyle: 'italic' },
  list: { paddingHorizontal: 12, paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 10 },
  halfWidth: { width: '48%' },
});

const cs = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardPhoto: { height: 160, position: 'relative' },
  verifiedBadge: { position: 'absolute', bottom: 7, right: 7 },
  cardBody: { padding: 10 },
  cardName: { fontFamily: FONTS.display, fontSize: 16, color: T.ink, marginBottom: 3 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  infoText: { fontSize: 11, color: T.mute, flex: 1 },
  jobText: { fontSize: 11, color: T.mute },
});
