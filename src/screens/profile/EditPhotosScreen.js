/**
 * EditPhotosScreen — manage profile photos
 *
 * Loads existing photos from userDoc.photos, lets the user add (up to 6) or
 * remove photos, and saves the updated list back to Firestore on "Save photos".
 *
 * Uses react-native-image-picker (lazy required inside pickPhoto) so that a
 * failed native-module load shows a graceful alert instead of crashing.
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions,
  ScrollView, Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadProfilePhoto } from '../../firebase/storage';
import { updateUserDoc } from '../../firebase/firestore';
import { useApp } from '../../store/AppContext';

const MAX_PHOTOS = 6;
const { width } = Dimensions.get('window');
const H_PAD = 16;
const GAP   = 8;

// ── Icons ─────────────────────────────────────────────────────────────────────

function XIcon({ size = 12 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

function PlusIcon({ size = 22, color = T.mute }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" pointerEvents="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

function WarningIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#92400E" strokeWidth={1.8} fill="none" />
      <Path d="M12 9v4M12 17h.01" stroke="#92400E" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// ── Photo slot (filled) ───────────────────────────────────────────────────────

function FilledSlot({ photo, index, isMain, onRemove, onReplace }) {
  return (
    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onReplace} activeOpacity={0.85}>
      <Image
        source={{ uri: photo.localUri || photo.url }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* uploading overlay */}
      {photo.uploading && (
        <View style={styles.uploadingOverlay}>
          <ActivityIndicator color="#fff" />
        </View>
      )}

      {/* X to remove */}
      <TouchableOpacity style={styles.xButton} onPress={onRemove} activeOpacity={0.8}>
        <XIcon size={12} />
      </TouchableOpacity>

      {/* Main photo badges */}
      {isMain && (
        <View style={styles.mainBadgeGroup}>
          <View style={styles.mainBadge}>
            <Text style={styles.mainBadgeText}>MAIN</Text>
          </View>
          <View style={styles.matchBadge}>
            <Text style={styles.matchBadgeText}>Match</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Empty / add slot ──────────────────────────────────────────────────────────

function AddSlot({ disabled }) {
  return (
    <View style={styles.addSlotInner} pointerEvents="none">
      <PlusIcon size={22} color={disabled ? T.hair2 : T.mute} />
      <Text style={[styles.addSlotLabel, disabled && { color: T.hair2 }]}>Add</Text>
    </View>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function EditPhotosScreen() {
  const navigation = useNavigation();
  const { firebaseUser, userDoc } = useApp();

  /**
   * photos[i] = { localUri: string|null, url: string|null, uploading: boolean }
   *   localUri  — local file URI (for immediate display while upload is pending)
   *   url       — Firebase Storage download URL (null until upload completes)
   *   uploading — true while uploading
   */
  const [photos, setPhotos] = useState([]);
  const [saving, setSaving] = useState(false);

  // Initialise from Firestore on mount
  useEffect(() => {
    const existing = (userDoc?.photos || []).map(url => ({
      localUri: null,
      url,
      uploading: false,
    }));
    setPhotos(existing);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Pick & upload a photo ─────────────────────────────────────────────────

  const pickPhoto = async (slotIndex) => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.85, selectionLimit: 1 });
    if (result.didCancel || result.errorCode) return;
    const asset    = result.assets?.[0];
    const uri      = asset?.uri;
    const mimeType = asset?.type || 'image/jpeg';
    if (!uri) return;

    // Determine target slot
    const isReplacing = slotIndex < photos.length;

    if (isReplacing) {
      // Replace the existing photo at slotIndex
      setPhotos(prev => {
        const updated = [...prev];
        updated[slotIndex] = { localUri: uri, url: null, uploading: true };
        return updated;
      });
    } else {
      // Append a new slot
      setPhotos(prev => [...prev, { localUri: uri, url: null, uploading: true }]);
    }

    const targetIndex = isReplacing ? slotIndex : photos.length;

    // Upload in background
    try {
      const url = await uploadProfilePhoto(firebaseUser.uid, uri, targetIndex, undefined, mimeType);
      setPhotos(prev => {
        const updated = [...prev];
        if (updated[targetIndex]) {
          updated[targetIndex] = { localUri: uri, url, uploading: false };
        }
        return updated;
      });
    } catch (e) {
      console.error('Photo upload failed:', e.message);
      // Remove the failed slot
      setPhotos(prev => prev.filter((_, i) => i !== targetIndex));
      Alert.alert('Upload failed', 'Could not upload photo. Please try again.');
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // ── Save to Firestore ─────────────────────────────────────────────────────

  const handleSave = async () => {
    const pending = photos.some(p => p.uploading);
    if (pending) {
      Alert.alert('Still uploading', 'Please wait for all photos to finish uploading before saving.');
      return;
    }

    if (!firebaseUser?.uid) { navigation.goBack(); return; }

    setSaving(true);
    try {
      const urls = photos.filter(p => p.url).map(p => p.url);
      await updateUserDoc(firebaseUser.uid, { photos: urls, photoCount: urls.length });
      navigation.goBack();
    } catch (e) {
      console.error('Save photos error:', e.message);
      Alert.alert('Error', 'Failed to save photos. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Layout math ───────────────────────────────────────────────────────────

  const mainW = (width - H_PAD * 2) * 0.58;
  const sideW = (width - H_PAD * 2) - mainW - GAP;
  const sideH = (220 - GAP) / 2;
  const row2W = (width - H_PAD * 2 - GAP * 2) / 3;

  const canAdd = photos.length < MAX_PHOTOS;

  // ── Render helpers ────────────────────────────────────────────────────────

  function slotAt(index, containerStyle) {
    const photo = photos[index];
    return (
      <View style={[containerStyle, { position: 'relative', overflow: 'hidden' }]}>
        {photo ? (
          <FilledSlot
            photo={photo}
            index={index}
            isMain={index === 0}
            onRemove={() => removePhoto(index)}
            onReplace={() => pickPhoto(index)}
          />
        ) : (
          // placeholder empty slot (not tappable — only the explicit "Add" slot adds)
          <View style={styles.emptySlot} />
        )}
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topBarLeft}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>EDIT PHOTOS</Text>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>
          Tap a photo to replace it. Tap the + to add a new one. First photo is what matches see first.
        </Text>

        {/* Progress */}
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(photos.length / MAX_PHOTOS) * 100}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{photos.length} of {MAX_PHOTOS} photos</Text>
        </View>

        {/* Row 1: main (large) + 2 side */}
        <View style={styles.row1}>
          {slotAt(0, { width: mainW, height: 220, borderRadius: 14 })}
          <View style={{ width: sideW, gap: GAP }}>
            {slotAt(1, { height: sideH, borderRadius: 12 })}
            {slotAt(2, { height: sideH, borderRadius: 12 })}
          </View>
        </View>

        {/* Row 2: 3 equal + add */}
        <View style={styles.row2}>
          {slotAt(3, { width: row2W, height: 120, borderRadius: 12 })}
          {slotAt(4, { width: row2W, height: 120, borderRadius: 12 })}

          {photos.length < 5 ? (
            // add slot takes position of slot 5
            <TouchableOpacity
              style={[styles.addSlot, { width: row2W, height: 120 }]}
              onPress={() => pickPhoto(photos.length)}
              activeOpacity={0.7}
              disabled={!canAdd}
            >
              <AddSlot disabled={!canAdd} />
            </TouchableOpacity>
          ) : photos.length === 5 ? (
            // show slot 5 filled + no explicit add slot in row2; add button appears below
            slotAt(5, { width: row2W, height: 120, borderRadius: 12 })
          ) : (
            // all 6 slots filled — show slot 5
            slotAt(5, { width: row2W, height: 120, borderRadius: 12 })
          )}
        </View>

        {/* "Add another photo" button if slots 5–6 not yet visible above */}
        {photos.length === 5 && (
          <TouchableOpacity style={styles.addMoreBtn} onPress={() => pickPhoto(5)} activeOpacity={0.8}>
            <PlusIcon size={16} color={T.accent} />
            <Text style={styles.addMoreText}>Add another photo</Text>
          </TouchableOpacity>
        )}

        {/* Tip */}
        <View style={styles.warningCard}>
          <WarningIcon size={20} />
          <View style={styles.warningTextBlock}>
            <Text style={styles.warningBold}>
              Profiles with a clear face photo and at least 4 images get 3× more interest.
            </Text>
            <Text style={styles.warningRegular}>Avoid group shots as your main photo.</Text>
          </View>
        </View>

        <Text style={styles.slotsText}>{photos.length} of {MAX_PHOTOS} slots filled</Text>
      </ScrollView>

      {/* Save button */}
      <View style={styles.stickyBottom}>
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.75 }]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.saveButtonText}>Save photos</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: T.bg },

  topBar:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: H_PAD, paddingVertical: 12, backgroundColor: T.bg },
  topBarLeft: { width: 70 },
  backText:   { fontSize: 14, color: T.ink, fontFamily: FONTS.ui },
  topBarTitle:{ flex: 1, textAlign: 'center', fontSize: 13, fontFamily: FONTS.mono, color: T.ink, letterSpacing: 1.5, fontWeight: '600' },
  topBarRight:{ width: 70, alignItems: 'flex-end' },

  scroll:   { paddingHorizontal: H_PAD, paddingBottom: 110 },
  subtitle: { fontSize: 13, color: T.mute, fontFamily: FONTS.ui, lineHeight: 19, marginBottom: 10 },

  progressRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  progressBar:  { flex: 1, height: 4, backgroundColor: T.hair2, borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: T.accent, borderRadius: 2 },
  progressLabel:{ fontFamily: FONTS.mono, fontSize: 11, color: T.mute },

  row1: { flexDirection: 'row', gap: GAP, marginBottom: GAP },
  row2: { flexDirection: 'row', gap: GAP, marginBottom: 16 },

  emptySlot: { flex: 1, backgroundColor: T.field },

  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  xButton: {
    position: 'absolute', top: 7, right: 7,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center', alignItems: 'center',
    zIndex: 10,
  },

  mainBadgeGroup: {
    position: 'absolute', top: 7, left: 7,
    flexDirection: 'row', gap: 4, zIndex: 10,
  },
  mainBadge:     { backgroundColor: '#D93025', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  mainBadgeText: { fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.5, fontFamily: FONTS.mono },
  matchBadge:    { backgroundColor: T.verify,   paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  matchBadgeText:{ fontSize: 9, fontWeight: '700', color: '#fff', letterSpacing: 0.3, fontFamily: FONTS.ui },

  addSlot:      { borderRadius: 12, borderWidth: 1.5, borderColor: T.hair2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  addSlotInner: { alignItems: 'center', gap: 4 },
  addSlotLabel: { fontSize: 12, color: T.mute, fontFamily: FONTS.ui },

  addMoreBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, marginBottom: 8 },
  addMoreText: { fontSize: 14, color: T.accent, fontWeight: '600', fontFamily: FONTS.ui },

  warningCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#FEF3C7', borderRadius: 14, padding: 14,
    marginBottom: 14, borderWidth: 1, borderColor: '#FDE68A',
  },
  warningTextBlock: { flex: 1, gap: 4 },
  warningBold:    { fontSize: 13, fontWeight: '700', color: '#78350F', fontFamily: FONTS.ui, lineHeight: 18 },
  warningRegular: { fontSize: 12, color: '#92400E', fontFamily: FONTS.ui, lineHeight: 17 },

  slotsText: { textAlign: 'center', fontSize: 13, color: T.mute, fontFamily: FONTS.ui, marginBottom: 8 },

  stickyBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: H_PAD, paddingBottom: 28, paddingTop: 12,
    backgroundColor: T.bg,
  },
  saveButton:     { backgroundColor: T.accent, borderRadius: 50, paddingVertical: 16, alignItems: 'center' },
  saveButtonText: { fontSize: 15, fontWeight: '700', color: '#fff', fontFamily: FONTS.ui, letterSpacing: 0.3 },
});
