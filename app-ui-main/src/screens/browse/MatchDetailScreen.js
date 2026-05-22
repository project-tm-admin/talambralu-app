import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import PhotoPlaceholder from '../../components/PhotoPlaceholder';
import { VerifyDot } from '../../components/VerifyBadge';
import { api } from '../../api/client';

const { width } = Dimensions.get('window');

const WAVEFORM = [20, 32, 44, 28, 40, 24, 36, 48, 30, 22, 42, 34, 26, 38, 18, 44, 28, 36, 24, 40];

function BackIcon() {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path d="M20 12H4M4 12L10 6M4 12L10 18" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShareIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="white" strokeWidth={2} strokeLinecap="round" />
      <Path d="M16 6L12 2 8 6M12 2v13" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MoreIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="1.5" fill="white" />
      <Circle cx="19" cy="12" r="1.5" fill="white" />
      <Circle cx="5" cy="12" r="1.5" fill="white" />
    </Svg>
  );
}

function XIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke="#E53E3E" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

function BookmarkIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" stroke={T.ink} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function MicIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M9 2h6v11a3 3 0 01-6 0V2z" stroke={T.accent} strokeWidth={1.6} fill="none" />
      <Path d="M5 10a7 7 0 0014 0M12 19v3M8 22h8" stroke={T.accent} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

const calculateAge = (dobString) => {
  if (!dobString) return '';
  const dob = new Date(dobString);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export default function MatchDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileId = route.params?.profileId;

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      const data = await api.get(`/v1/profiles/${profileId}`);
      setProfile(data);
    } catch (err) {
      console.error('Fetch Profile Details Error', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={T.accent} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Profile not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{color: T.accent, marginTop: 10}}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const age = calculateAge(profile.dob);
  const basics = [
    { label: 'GENDER', value: profile.gender },
    { label: 'BIRTHDAY', value: new Date(profile.dob).toLocaleDateString() },
    { label: 'VERIFIED', value: profile.isFaceVerified ? 'YES' : 'NO' },
    { label: 'INCOME', value: profile.incomeBracket || 'Not shared' },
    { label: 'EDUCATION', value: 'Verified upon request' },
    { label: 'RELIGION', value: 'Not specified' },
  ];

  const handleAction = async (actionType) => {
    if (!profileId) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (actionType === 'LIKE') {
        await api.post('/v1/interests', { receiverId: profileId });
      } else if (actionType === 'PASS') {
        await api.post('/v1/matches/pass', { receiverId: profileId });
      } else if (actionType === 'SAVE') {
        await api.post('/v1/shortlist', { profileId: profileId });
      }
      navigation.goBack();
    } catch (error) {
      console.error(`Failed to ${actionType.toLowerCase()} profile:`, error);
      Alert.alert('Error', `Failed to ${actionType.toLowerCase()} profile. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero photo */}
        <View style={styles.heroWrap}>
          <PhotoPlaceholder width={width} height={380} label={profile.fullName} style={{ borderRadius: 0 }} />

          {/* Overlay buttons */}
          <SafeAreaView style={styles.overlaySafe} edges={['top']}>
            <View style={styles.overlayRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayBtn}>
                <BackIcon />
              </TouchableOpacity>
              <View style={styles.overlayRight}>
                <TouchableOpacity style={styles.overlayBtn}>
                  <ShareIcon />
                </TouchableOpacity>
                <TouchableOpacity style={styles.overlayBtn}>
                  <MoreIcon />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          {/* Photo dots */}
          <View style={styles.photoDots}>
            {[0].map(i => (
              <View key={i} style={[styles.photoDot, i === 0 && styles.photoDotActive]} />
            ))}
          </View>
        </View>

        <View style={styles.content}>
          {/* Name + verify */}
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.fullName}, {age}</Text>
            {profile.isFaceVerified && <VerifyDot size={16} />}
          </View>

          {/* Quote prompt - Placeholder since backend doesn't have prompts yet */}
          <View style={styles.promptCard}>
            <Text style={styles.promptQ}>About {profile.fullName.split(' ')[0]}</Text>
            <Text style={styles.promptA}>
              "Looking for a meaningful connection with someone who shares similar values and life goals. Feel free to reach out to learn more about me!"
            </Text>
          </View>

          {/* The basics */}
          <Text style={styles.sectionTitle}>The basics</Text>
          <View style={styles.basicsGrid}>
            {basics.map((b, i) => (
              <View key={i} style={styles.basicItem}>
                <Text style={styles.basicLabel}>{b.label}</Text>
                <Text style={styles.basicValue}>{b.value}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Sticky action bar */}
      <SafeAreaView style={styles.stickyBar} edges={['bottom']}>
        <TouchableOpacity style={styles.stickyPass} onPress={() => handleAction('PASS')}>
          <XIcon />
          <Text style={styles.stickyPassText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stickyBookmark} onPress={() => handleAction('SAVE')}>
          <BookmarkIcon />
          <Text style={styles.stickyBookmarkText}>Shortlist</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.stickyInterest, isSubmitting && { opacity: 0.6 }]} onPress={() => handleAction('LIKE')} disabled={isSubmitting}>
          <Text style={styles.stickyInterestText}>Send interest</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heroWrap: { position: 'relative' },
  overlaySafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  overlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  overlayRight: {
    flexDirection: 'row',
    gap: 8,
  },
  overlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoDots: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  photoDotActive: {
    width: 20,
    backgroundColor: '#fff',
  },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  name: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: T.ink,
  },
  promptCard: {
    backgroundColor: T.field,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  promptQ: {
    fontFamily: FONTS.display,
    fontSize: 13,
    fontStyle: 'italic',
    color: T.accent,
    marginBottom: 8,
  },
  promptA: {
    fontFamily: FONTS.display,
    fontSize: 16,
    fontStyle: 'italic',
    color: T.ink2,
    lineHeight: 26,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: T.ink,
    marginBottom: 12,
    marginTop: 4,
  },
  basicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  basicItem: {
    width: '47%',
    backgroundColor: T.field,
    borderRadius: 12,
    padding: 12,
  },
  basicLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: T.mute,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  basicValue: {
    fontSize: 13,
    fontWeight: '600',
    color: T.ink2,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderTopColor: T.hair,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  stickyPass: {
    width: 56,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  stickyPassText: {
    fontSize: 10,
    color: '#E53E3E',
    fontWeight: '600',
  },
  stickyBookmark: {
    width: 56,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.hair2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  },
  stickyBookmarkText: {
    fontSize: 10,
    color: T.ink,
    fontWeight: '600',
  },
  stickyInterest: {
    flex: 1,
    height: 52,
    backgroundColor: T.accent,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stickyInterestText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});