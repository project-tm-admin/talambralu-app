import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Stepper from '../../components/Stepper';
import Primary from '../../components/Primary';
import { api } from '../../api/client';

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

function TrashIcon({ size = 16 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="#FFF" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function PhotoSlot({ photoUrl, isHero, isUploading, onAdd, onDelete }) {
  if (isUploading) {
    return (
      <View style={[isHero ? styles.heroSlot : styles.thumbSlot, styles.uploadingSlot]}>
        <ActivityIndicator size="large" color={T.accent} />
      </View>
    );
  }

  if (photoUrl) {
    return (
      <View style={isHero ? styles.heroSlot : styles.thumbSlot}>
        <Image source={{ uri: photoUrl }} style={StyleSheet.absoluteFill} />
        {isHero && (
          <View style={styles.heroBadgeRow}>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          </View>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} activeOpacity={0.7}>
          <TrashIcon />
        </TouchableOpacity>
      </View>
    );
  }

  if (isHero) {
    return (
      <TouchableOpacity style={styles.heroSlot} onPress={onAdd} activeOpacity={0.8}>
        <LinearGradient colors={['#F7E8D4', '#E8C9A8', '#D4A574']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
        <View style={styles.heroOverlay}>
          <CameraIcon size={36} />
          <Text style={styles.heroHint}>Tap to add main photo</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.thumbDashed} onPress={onAdd} activeOpacity={0.7}>
      <PlusIcon size={20} />
    </TouchableOpacity>
  );
}

export default function PhotosScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [photos, setPhotos] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      fetchProfile();
    }
  }, [isFocused]);

  const fetchProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const profile = await api.get('/v1/profiles/me');
      if (profile && profile.photos) {
        setPhotos(profile.photos);
      }
    } catch (error) {
      console.error('Failed to fetch profile photos:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePickAndUpload = async (targetIndex) => {
    if (isUploadingRef.current) return;
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadPhoto(result.assets[0], targetIndex);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick an image.');
    }
  };

  const uploadPhoto = async (asset, targetIndex) => {
    isUploadingRef.current = true;
    setUploadingIndex(targetIndex);

    try {
      const mimeType = asset.mimeType || 'image/jpeg';
      const presignedData = await api.createPresignedPost('PROFILE_PHOTO', mimeType);
      
      if (!presignedData?.url || !presignedData?.fields) {
        throw new Error('Failed to get upload credentials from server.');
      }

      const formData = new FormData();
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', { uri: asset.uri, type: mimeType, name: 'photo.jpg' });

      const uploadResponse = await fetch(presignedData.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed (${uploadResponse.status}). Please try again.`);
      }

      const photoUrl = `${presignedData.url}/${presignedData.fields.key}`;
      
      const newPhotos = [...photos];
      newPhotos[targetIndex] = photoUrl;
      const filteredPhotos = newPhotos.filter(Boolean);
      
      await api.patch('/v1/profiles/photos', { photos: filteredPhotos });
      setPhotos(filteredPhotos);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Something went wrong during upload.');
    } finally {
      isUploadingRef.current = false;
      setUploadingIndex(null);
    }
  };

  const handleDeletePhoto = async (indexToDelete) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const newPhotos = photos.filter((_, idx) => idx !== indexToDelete);
            await api.patch('/v1/profiles/photos', { photos: newPhotos });
            setPhotos(newPhotos);
          } catch (error) {
             Alert.alert('Error', 'Failed to delete photo.');
          }
        },
      },
    ]);
  };

  const filledCount = photos.length;
  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < MAX_PHOTOS; i++) {
      slots.push(
        <PhotoSlot
          key={i}
          isHero={i === 0}
          photoUrl={photos[i]}
          isUploading={uploadingIndex === i}
          onAdd={() => handlePickAndUpload(i)}
          onDelete={() => handleDeletePhoto(i)}
        />
      );
    }
    return slots;
  };

  const allSlots = renderSlots();

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar onSkip={() => navigation.navigate('About')} skipLabel="Skip" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Stepper current={11} total={14} />
        <Text style={styles.title}>Add your{'\n'}photos</Text>

        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(100, (filledCount / MAX_PHOTOS) * 100)}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{filledCount} of {MAX_PHOTOS} photos</Text>
        </View>

        {isLoadingProfile && photos.length === 0 ? (
           <View style={{ height: 260, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={T.accent} />
           </View>
        ) : (
          <>
            {allSlots[0]}
            <View style={styles.thumbRow}>
              {allSlots.slice(1)}
            </View>
          </>
        )}

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
    backgroundColor: T.field,
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
  thumbRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  thumbSlot: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: T.field,
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
  uploadingSlot: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    width: 24,
    height: 24,
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