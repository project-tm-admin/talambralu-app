import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';

const { width } = Dimensions.get('window');
const THUMB_SIZE = (width - 48 - 12) / 3;

function PlusIcon({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={T.accent} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function LockIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M5 11V7a7 7 0 0114 0v4" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M3 11h18v10H3V11z" stroke={T.accent} strokeWidth={1.8} rx={2} fill="none" />
    </Svg>
  );
}

function CameraIcon({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke={T.mute} strokeWidth={1.5} fill="none" />
      <Circle cx="12" cy="13" r="4" stroke={T.mute} strokeWidth={1.5} />
    </Svg>
  );
}

function HeroPhotoSlot() {
  return (
    <View style={styles.heroSlot}>
      <LinearGradient
        colors={['#F7E8D4', '#E8C9A8', '#D4A574']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.heroOverlay}>
        <CameraIcon size={36} />
        <Text style={styles.heroHint}>Tap to add main photo</Text>
      </View>
      <View style={styles.heroBadgeRow}>
        <View style={styles.primaryBadge}>
          <Text style={styles.primaryBadgeText}>PRIMARY</Text>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>AI VERIFIED</Text>
        </View>
      </View>
    </View>
  );
}

function ThumbSlot({ filled }) {
  if (filled) {
    return (
      <View style={styles.thumbSlot}>
        <LinearGradient
          colors={['#E8C9A8', '#C4946A', '#A87044']}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.thumbDashed} activeOpacity={0.7}>
      <PlusIcon size={20} />
    </TouchableOpacity>
  );
}

export default function PhotosScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('About')} skipLabel="Skip" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={11} total={14} />
        <Text style={styles.title}>Add your{'\n'}photos</Text>

        {/* Progress indicator */}
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
          <Text style={styles.progressLabel}>4 of 6 photos</Text>
        </View>

        <HeroPhotoSlot />

        <View style={styles.thumbRow}>
          {[true, true, true, false, false].map((filled, i) => (
            <ThumbSlot key={i} filled={filled} />
          ))}
        </View>

        {/* Tips card */}
        <View style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Photo tips</Text>
          {[
            'Use a clear face photo as your main photo',
            'Show your personality — travel, hobbies, celebrations',
            'At least 3 photos get 60% more responses',
          ].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Privacy lock */}
        <View style={styles.privacyCard}>
          <LockIcon />
          <Text style={styles.privacyText}>
            Your photos are only visible to verified members. You control who sees them.
          </Text>
        </View>

        <Primary
          label="Continue"
          onPress={() => navigation.navigate('About')}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: T.ink,
    lineHeight: 44,
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: T.hair2,
    borderRadius: 2,
  },
  progressFill: {
    width: '67%',
    height: '100%',
    backgroundColor: T.accent,
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: T.mute,
  },
  heroSlot: {
    height: 260,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  heroHint: {
    fontSize: 14,
    color: T.mute,
    fontWeight: '500',
  },
  heroBadgeRow: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    gap: 6,
  },
  primaryBadge: {
    backgroundColor: T.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  aiBadge: {
    backgroundColor: T.verify,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  thumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  thumbSlot: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
  },
  thumbDashed: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.hair2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsCard: {
    backgroundColor: T.field,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.accent,
    marginTop: 5,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: T.mute,
    lineHeight: 20,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: T.hair2,
    borderRadius: 14,
    padding: 14,
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: T.mute,
    lineHeight: 20,
  },
});
