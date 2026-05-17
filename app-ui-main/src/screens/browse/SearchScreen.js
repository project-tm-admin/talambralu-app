import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';
import { VerifyDot } from '../../components/VerifyBadge';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

function SearchIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={T.mute} strokeWidth={1.8} />
      <Path d="M21 21l-4.35-4.35" stroke={T.mute} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function FilterIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6h16M7 12h10M10 18h4" stroke={T.ink} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

const FILTER_CHIPS = ['All', 'Verified', 'USA', 'Telugu', 'Premium', 'Family', 'Active'];

const PROFILES = [
  { name: 'Priya M.', age: 27, city: 'New Jersey', premium: true, verified: true, new: false, family: false },
  { name: 'Swathi K.', age: 29, city: 'Houston, TX', premium: false, verified: true, new: true, family: false },
  { name: 'Divya N.', age: 26, city: 'Chicago, IL', premium: true, verified: false, new: false, family: true },
  { name: 'Kavya P.', age: 31, city: 'Seattle, WA', premium: false, verified: true, new: false, family: false },
  { name: 'Meena R.', age: 28, city: 'Atlanta, GA', premium: false, verified: false, new: true, family: false },
  { name: 'Sruthi V.', age: 30, city: 'Dallas, TX', premium: true, verified: true, new: false, family: true },
];

function ProfileCard({ profile, large }) {
  const cardH = large ? 220 : 180;
  return (
    <View style={[styles.profileCard, { width: large ? width - 32 : CARD_W }]}>
      <PhotoPlaceholder width={large ? width - 32 : CARD_W} height={cardH} label={profile.name} style={{ borderRadius: 0 }} />
      <View style={styles.cardBadges}>
        {profile.premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>★ PREMIUM</Text>
          </View>
        )}
        {profile.new && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        {profile.family && (
          <View style={styles.familyBadge}>
            <Text style={styles.familyText}>FAMILY</Text>
          </View>
        )}
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardNameRow}>
          <Text style={styles.cardName}>{profile.name}, {profile.age}</Text>
          {profile.verified && <VerifyDot size={12} />}
        </View>
        <Text style={styles.cardCity}>{profile.city}</Text>
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [activeChip, setActiveChip] = useState('All');
  const [alertsOn, setAlertsOn] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
        </View>

        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <SearchIcon />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Name, city, profession..."
              placeholderTextColor={T.mute}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate('Filters')}
          >
            <FilterIcon />
          </TouchableOpacity>
        </View>

        {/* Quick filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsScroll}
        >
          {FILTER_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              style={[styles.filterChip, activeChip === chip && styles.filterChipActive]}
              onPress={() => setActiveChip(chip)}
            >
              <Text style={[styles.filterChipText, activeChip === chip && styles.filterChipTextActive]}>
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Saved search */}
        <View style={styles.savedBar}>
          <View>
            <Text style={styles.savedTitle}>Telugu · Bay Area · 25–32 · Vegetarian</Text>
            <Text style={styles.savedSub}>Saved search · 28 new profiles</Text>
          </View>
          <Switch
            value={alertsOn}
            onValueChange={setAlertsOn}
            trackColor={{ false: T.hair2, true: T.accent }}
            thumbColor="#fff"
            style={{ transform: [{ scale: 0.85 }] }}
          />
        </View>

        {/* Highly Compatible */}
        <Text style={styles.sectionTitle}>Highly Compatible</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {PROFILES.slice(0, 3).map((p, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('MatchDetail')} activeOpacity={0.8}>
              <ProfileCard profile={p} large={false} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Browse */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Quick Browse</Text>
        <View style={styles.gridWrap}>
          {PROFILES.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('MatchDetail')} activeOpacity={0.8}>
              <ProfileCard profile={p} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Recently Joined */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Recently Joined</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {PROFILES.filter(p => p.new).map((p, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate('MatchDetail')} activeOpacity={0.8}>
              <ProfileCard profile={p} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: T.ink,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: T.ink,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: T.field,
    borderWidth: 1,
    borderColor: T.hair,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipsScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: T.hair2,
    backgroundColor: T.surface,
  },
  filterChipActive: {
    backgroundColor: T.accent,
    borderColor: T.accent,
  },
  filterChipText: {
    fontSize: 13,
    color: T.ink2,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  savedBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: T.field,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  savedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: T.ink,
  },
  savedSub: {
    fontSize: 11,
    color: T.mute,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: T.ink,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  gridWrap: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  profileCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: T.field,
  },
  cardBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    gap: 4,
  },
  premiumBadge: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D4A017',
    letterSpacing: 0.3,
  },
  newBadge: {
    backgroundColor: T.verify,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  newText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  familyBadge: {
    backgroundColor: T.accent,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  familyText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  cardInfo: {
    padding: 10,
    backgroundColor: T.bg,
  },
  cardNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: T.ink,
  },
  cardCity: {
    fontSize: 11,
    color: T.mute,
    marginTop: 2,
  },
});
