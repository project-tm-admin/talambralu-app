/**
 * DocVerificationScreen — document upload for Gov ID / Visa / Income / Education
 *
 * Route params:
 *   type        'govId' | 'visa' | 'income' | 'education'
 *   title       Display title, e.g. "Verify Government ID"
 *   hint        Helper text shown below the upload button
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Alert, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path, Rect } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { uploadVerificationDoc } from '../../firebase/storage';
import { submitVerification } from '../../firebase/firestore';
import { useApp } from '../../store/AppContext';

const DOC_CONFIG = {
  govId:     { label: 'Government ID',  accept: "Images (passport, driver's licence, state ID)" },
  visa:      { label: 'Visa / Status',  accept: 'Images or PDF (H-1B, Green Card, stamp)' },
  income:    { label: 'Income Proof',   accept: 'Pay stub, offer letter, or bank statement' },
  education: { label: 'Degree / Certificate', accept: 'Diploma or transcript' },
};

function UploadIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="3" stroke={T.accent} strokeWidth={1.6} />
      <Path d="M12 16V8M8 12l4-4 4 4" stroke={T.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke={T.verify} strokeWidth={1.6} strokeLinecap="round" />
      <Path d="M22 4L12 14.01l-3-3" stroke={T.verify} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function DocVerificationScreen() {
  const navigation        = useNavigation();
  const route             = useRoute();
  const { firebaseUser }  = useApp();

  const {
    type  = 'govId',
    title = 'Verify Document',
    hint  = '',
  } = route.params || {};

  const config = DOC_CONFIG[type] || DOC_CONFIG.govId;

  const [imageUri,  setImageUri]  = useState(null);
  const [imageMime, setImageMime] = useState('image/jpeg');
  const [status,    setStatus]    = useState('idle'); // idle | uploading | done | error

  async function pickDocument() {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 1,
    });
    if (!result.didCancel && !result.errorCode && result.assets?.[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageMime(asset.type || 'image/jpeg');
    }
  }

  async function handleSubmit() {
    if (!imageUri) return;
    setStatus('uploading');
    try {
      const downloadUrl = await uploadVerificationDoc(
        firebaseUser.uid,
        imageUri,
        type.toUpperCase(),
        imageMime,
      );
      await submitVerification(firebaseUser.uid, type, downloadUrl);
      setStatus('done');
    } catch (err) {
      console.error('DocVerification error:', err);
      Alert.alert('Upload failed', err.message || 'Please try again.');
      setStatus('error');
    }
  }

  // ── Done state ────────────────────────────────────────────────────────────

  if (status === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack label={title} />
        <View style={styles.centerState}>
          <CheckIcon />
          <Text style={styles.heading}>Document submitted!</Text>
          <Text style={styles.sub}>
            Your {config.label.toLowerCase()} is under review. We'll notify you once it's approved (usually within 24 hours).
          </Text>
          <Primary
            label="Back to Verifications"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Upload state ──────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack label={title} />

      <View style={styles.content}>
        <Text style={styles.sub}>{hint || `Upload a clear photo of your ${config.label.toLowerCase()}.`}</Text>
        <Text style={styles.accepts}>Accepted: {config.accept}</Text>

        {/* Upload area */}
        <TouchableOpacity style={styles.uploadArea} onPress={pickDocument} activeOpacity={0.7}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="contain" />
          ) : (
            <>
              <UploadIcon />
              <Text style={styles.uploadLabel}>Tap to select image</Text>
              <Text style={styles.uploadSub}>JPEG or PNG · max 10 MB</Text>
            </>
          )}
        </TouchableOpacity>

        {imageUri && (
          <TouchableOpacity onPress={pickDocument} style={styles.changeLink}>
            <Text style={styles.changeLinkText}>Choose a different image</Text>
          </TouchableOpacity>
        )}

        <View style={styles.privacyBox}>
          <Text style={styles.privacyText}>
            🔒  Your document is encrypted, stored securely, and only seen by our verification team. It will never be shared with other users.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {status === 'uploading' ? (
          <View style={styles.uploadingRow}>
            <ActivityIndicator color={T.accent} />
            <Text style={styles.uploadingText}>Uploading…</Text>
          </View>
        ) : (
          <Primary
            label="Submit for Review"
            onPress={handleSubmit}
            disabled={!imageUri}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: T.bg },
  content:      { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  centerState:  { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 12 },
  heading:      { fontFamily: FONTS.display, fontSize: 24, color: T.ink, textAlign: 'center' },
  sub:          { fontSize: 14, color: T.mute, lineHeight: 22, marginBottom: 4 },
  accepts:      { fontSize: 12, color: T.mute, marginBottom: 20, fontStyle: 'italic' },
  uploadArea:   {
    height: 220,
    borderWidth: 2,
    borderColor: T.hair2,
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: T.field,
    gap: 10,
    overflow: 'hidden',
  },
  preview:      { width: '100%', height: '100%' },
  uploadLabel:  { fontSize: 15, fontWeight: '600', color: T.ink2 },
  uploadSub:    { fontSize: 12, color: T.mute },
  changeLink:   { alignItems: 'center', marginTop: 10 },
  changeLinkText: { fontSize: 13, color: T.accent, fontWeight: '500' },
  privacyBox:   {
    backgroundColor: T.verifySoft,
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
  },
  privacyText:  { fontSize: 12, color: '#2D6B48', lineHeight: 19 },
  footer:       { paddingHorizontal: 24, paddingBottom: 28, paddingTop: 12 },
  uploadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  uploadingText:{ fontSize: 15, color: T.mute },
});
