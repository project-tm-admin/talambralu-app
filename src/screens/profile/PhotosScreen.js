import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Dimensions, Image, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';
import { uploadProfilePhoto } from '../../firebase/storage';
import { updateUserDoc } from '../../firebase/firestore';
import { useApp } from '../../store/AppContext';

const { width } = Dimensions.get('window');
const THUMB_SIZE = (width - 48 - 12) / 3;
const MAX_PHOTOS = 6;

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
      <Path d="M3 11h18v10H3V11z" stroke={T.accent} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}

function CameraIcon({ size = 24 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
        stroke={T.mute} strokeWidth={1.5} fill="none" />
      <Circle cx="12" cy="13" r="4" stroke={T.mute} strokeWidth={1.5} />
    </Svg>
  );
}

function RemoveIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.55)" />
      <Path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export default function PhotosScreen() {
  const navigation = useNavigation();
  const { firebaseUser } = useApp();

  // photos[i] = { uri: localUri, url: storageUrl | null, uploading: bool }
  const [photos,     setPhotos]     = useState([]);
  const [saving,     setSaving]     = useState(false);

  const pickPhoto = async (slotIndex) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });
    if (result.canceled) return;

    const uri = result.assets[0].uri;
    const newPhotos = [...photos];
    if (slotIndex < newPhotos.length) {
      newPhotos[slotIndex] = { uri, url: null, uploading: true };
    } else {
      newPhotos.push({ uri, url: null, uploading: true });
    }
    setPhotos(newPhotos);

    // Upload in background
    try {
      const url = await uploadProfilePhoto(firebaseUser.uid, uri, slotIndex);
      setPhotos(prev => {
        const updated = [...prev];
        updated[slotIndex] = { uri, url, uploading: false };
        return updated;
      });
    } catch (e) {
      console.error('Photo upload failed:', e.message);
      setPhotos(prev => prev.filter((_, i) => i !== slotIndex));
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (!firebaseUser?.uid) { navigation.navigate('About'); return; }
    setSaving(true);
    try {
      const urls = photos.filter(p => p.url).map(p => p.url);
      if (urls.length) {
        await updateUserDoc(firebaseUser.uid, { photos: urls, photoCount: urls.length });
      }
    } catch (e) {
      console.error('Save photos error:', e.message);
    } finally {
      setSaving(false);
      navigation.navigate('About');
    }
  };

  const filled = photos.length;
  const progress = Math.min(filled / MAX_PHOTOS, 1);

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('About')} skipLabel="Skip" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={11} total={14} />
        <Text style={styles.title}>Add your{'\n'}photos</Text>

        {/* Progress bar */}
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{filled} of {MAX_PHOTOS} photos</Text>
        </View>

        {/* Hero slot */}
        <TouchableOpacity
          style={styles.heroSlot}
          onPress={() => pickPhoto(0)}
          activeOpacity={0.8}
        >
          {photos[0] ? (
            <>
              <Image source={{ uri: photos[0].uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
              {photos[0].uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                </View>
              )}
              <TouchableOpacity style={styles.heroRemove} onPress={() => removePhoto(0)}>
                <RemoveIcon />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.heroOverlay}>
              <CameraIcon size={36} />
              <Text style={styles.heroHint}>Tap to add main photo</Text>
            </View>
          )}
          <View style={styles.heroBadgeRow}>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Thumbnail grid */}
        <View style={styles.thumbRow}>
          {[1, 2, 3, 4, 5].map(i => {
            const photo = photos[i];
            if (photo) {
              return (
                <TouchableOpacity key={i} style={styles.thumbSlot} onPress={() => pickPhoto(i)} activeOpacity={0.8}>
                  <Image source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  {photo.uploading && (
                    <View style={styles.uploadingOverlay}>
                      <ActivityIndicator color="#fff" size="small" />
                    </View>
                  )}
                  <TouchableOpacity style={styles.thumbRemove} onPress={() => removePhoto(i)}>
                    <RemoveIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }
            return (
              <TouchableOpacity key={i} style={styles.thumbDashed} onPress={() => pickPhoto(i)} activeOpacity={0.7}>
                <PlusIcon size={20} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tips */}
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

        <View style={styles.privacyCard}>
          <LockIcon />
          <Text style={styles.privacyText}>
            Your photos are only visible to verified members. You control who sees them.
          </Text>
        </View>

        <Primary
          label="Continue"
          loading={saving}
          onPress={handleContinue}
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
    fontFamily: FONTS.display, fontSize: 36, color: T.ink,
    lineHeight: 44, marginBottom: 16,
  },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  progressBar: { flex: 1, height: 4, backgroundColor: T.hair2, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
  progressLabel: { fontFamily: FONTS.mono, fontSize: 11, color: T.mute },
  heroSlot: {
    height: 260, borderRadius: 20, overflow: 'hidden',
    marginBottom: 12, backgroundColor: '#F7E8D4',
    justifyContent: 'center', alignItems: 'center',
  },
  heroOverlay: { justifyContent: 'center', alignItems: 'center', gap: 8 },
  heroHint: { fontSize: 14, color: T.mute, fontWeight: '500' },
  heroBadgeRow: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 6 },
  primaryBadge: { backgroundColor: T.accent, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  primaryBadgeText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  heroRemove: { position: 'absolute', top: 10, right: 10 },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center', alignItems: 'center',
  },
  thumbRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  thumbSlot: {
    width: THUMB_SIZE, height: THUMB_SIZE,
    borderRadius: 14, overflow: 'hidden', backgroundColor: '#E8C9A8',
  },
  thumbDashed: {
    width: THUMB_SIZE, height: THUMB_SIZE, borderRadius: 14,
    borderWidth: 1.5, borderColor: T.hair2, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center',
  },
  thumbRemove: { position: 'absolute', top: 4, right: 4 },
  tipsCard: { backgroundColor: T.field, borderRadius: 16, padding: 16, marginBottom: 12 },
  tipsTitle: { fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.accent, marginTop: 5 },
  tipText: { flex: 1, fontSize: 13, color: T.mute, lineHeight: 20 },
  privacyCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    borderWidth: 1, borderColor: T.hair2, borderRadius: 14, padding: 14,
  },
  privacyText: { flex: 1, fontSize: 13, color: T.mute, lineHeight: 20 },
});
