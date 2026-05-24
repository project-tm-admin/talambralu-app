import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';
import { VerifyDot } from '../../components/VerifyBadge';
import { useDiscoveryFilters } from '../../hooks/useDiscoveryFilters';

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
const UNIMPLEMENTED_CHIPS = new Set(['USA', 'Telugu', 'Premium', 'Family', 'Active']);

function getAge(dob) {
  if (!dob) return '';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

function ProfileCard({ profile, large }) {
  const cardH = large ? 220 : 180;
  const age = profile.dob ? getAge(profile.dob) : profile.age || '';
  const name = profile.fullName || profile.name || 'Unknown';
  
  return (
    <View style={[styles.profileCard, { width: large ? width - 32 : CARD_W }]}>
      <PhotoPlaceholder width={large ? width - 32 : CARD_W} height={cardH} label={name} style={{ borderRadius: 0 }} />
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
          <Text style={styles.cardName}>{name}{age ? `, ${age}` : ''}</Text>
          {(profile.isFaceVerified || profile.verified) && <VerifyDot size={12} />}
        </View>
        <Text style={styles.cardCity}>{profile.city || 'United States'}</Text>
      </View>
    </View>
  );
}

export default function SearchScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { filters, applyFilters, results, shortlist, loading } = useDiscoveryFilters();
  const [activeChip, setActiveChip] = useState('All');
  const [alertsOn, setAlertsOn] = useState(true);

  // Apply filters coming back from FiltersScreen
  useEffect(() => {
    if (route.params?.appliedFilters != null) {
      applyFilters(route.params.appliedFilters);
      navigation.setParams({ appliedFilters: null });
    }
  }, [route.params?.appliedFilters, applyFilters, navigation]);

  const handleSearchChange = (text) => {
    applyFilters({ keywords: text });
  };

  const handleChipPress = (chip) => {
    setActiveChip(chip);
    applyFilters({ isVerified: chip === 'Verified' });
  };

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
              value={filters.keywords || ''}
              onChangeText={handleSearchChange}
              placeholder="Name, city, profession..."
              placeholderTextColor={T.mute}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate('Filters', { currentFilters: filters })}
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
          {FILTER_CHIPS.map(chip => {
            const isDisabled = UNIMPLEMENTED_CHIPS.has(chip);
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.filterChip,
                  activeChip === chip && !isDisabled && styles.filterChipActive,
                  isDisabled && styles.filterChipDisabled,
                ]}
                onPress={() => handleChipPress(chip)}
                disabled={isDisabled}
              >
                <Text style={[
                  styles.filterChipText,
                  activeChip === chip && !isDisabled && styles.filterChipTextActive,
                  isDisabled && styles.filterChipTextDisabled,
                ]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Saved search */}
        <View style={styles.savedBar}>
          <View>
            <Text style={styles.savedTitle}>Telugu · Bay Area · 25–32 · Vegetarian</Text>
            <Text style={styles.savedSub}>Saved search · {results.length} results</Text>
          </View>
          <Switch
            value={alertsOn}
            onValueChange={setAlertsOn}
            trackColor={{ false: T.hair2, true: T.accent }}
            thumbColor="#fff"
            style={{ transform: [{ scale: 0.85 }] }}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={T.accent} style={{ marginTop: 40 }} />
        ) : (
          <>
            {shortlist.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Your Shortlist ({shortlist.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12, marginBottom: 24 }}>
                  {shortlist.map((p, i) => (
                    <TouchableOpacity key={p.id || i} onPress={() => navigation.navigate('MatchDetail')} activeOpacity={0.8}>
                      <ProfileCard profile={p} large={false} />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={styles.sectionTitle}>Search Results ({results.length})</Text>
            <View style={styles.gridWrap}>
              {results.map((p, i) => (
                <TouchableOpacity key={p.id || i} onPress={() => navigation.navigate('MatchDetail')} activeOpacity={0.8}>
                  <ProfileCard profile={p} />
                </TouchableOpacity>
              ))}
              {results.length === 0 && (
                <Text style={{ padding: 20, color: T.mute }}>No profiles found matching your criteria.</Text>
              )}
            </View>
          </>
        )}

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
  filterChipDisabled: {
    opacity: 0.4,
  },
  filterChipTextDisabled: {
    color: T.mute,
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
