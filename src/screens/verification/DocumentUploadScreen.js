/**
 * Document Upload — Firebase Storage upload + Firestore profile update
 * documentType: 'VISA' | 'INCOME' | 'EDUCATION'
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { uploadVerificationDoc } from '../../firebase/storage';
import { useApp } from '../../store/AppContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const DOC_CONFIG = {
  VISA: {
    title:       'Visa Verification',
    instruction: 'Upload your I-797, visa stamp, or EAD card. Accepted: PDF, JPG, PNG.',
    profileKey:  'visaUrl',
    storageType: 'VISA',
    successMsg:  'Visa document uploaded! Our team will verify it within 24 hours.',
  },
  INCOME: {
    title:       'Income Verification',
    instruction: 'Upload a recent pay stub or offer letter. Accepted: PDF, JPG, PNG.',
    profileKey:  'incomeUrl',
    storageType: 'INCOME',
    successMsg:  'Income document uploaded! Our team will verify it within 24 hours.',
  },
  EDUCATION: {
    title:       'Education Verification',
    instruction: 'Upload your degree certificate or official transcript. Accepted: PDF, JPG, PNG.',
    profileKey:  'eduUrl',
    storageType: 'EDUCATION',
    successMsg:  'Education document uploaded! Our team will verify it within 24 hours.',
  },
};

function FileIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={T.accent} strokeWidth={1.5} fill="none" />
      <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke={T.accent} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
function CheckIcon() {
  return (
    <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" fill={T.accentSoft} />
      <Path d="M9 12l2 2 4-4" stroke={T.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export default function DocumentUploadScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { documentType = 'VISA' } = route.params || {};
  const { firebaseUser } = useApp();

  const config = DOC_CONFIG[documentType] || DOC_CONFIG.VISA;

  const [selectedFile, setSelectedFile]   = useState(null);
  const [status, setStatus]               = useState('idle'); // idle | uploading | done | failed
  const isUploadingRef                    = useRef(false);

  async function pickDocument() {
    let DocumentPicker;
    try { DocumentPicker = require('expo-document-picker'); } catch {
      Alert.alert('Not available', 'Document picker requires a production build.'); return;
    }
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document.');
    }
  }

  async function handleUpload() {
    if (!selectedFile || isUploadingRef.current || !firebaseUser) return;
    isUploadingRef.current = true;
    setStatus('uploading');

    try {
      // Upload to Firebase Storage: users/{uid}/verification/{VISA|INCOME|EDUCATION}.ext
      const downloadUrl = await uploadVerificationDoc(
        firebaseUser.uid,
        selectedFile.uri,
        config.storageType
      );

      // Update Firestore profile with document URL
      await updateDoc(doc(db, 'profiles', firebaseUser.uid), {
        [`profile.${config.profileKey}`]: downloadUrl,
      });

      setStatus('done');
    } catch (err) {
      console.error('DocumentUpload error:', err);
      setStatus('failed');
      Alert.alert('Upload Failed', err.message || 'Please try again.');
    } finally {
      isUploadingRef.current = false;
    }
  }

  // ── Done state ─────────────────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack />
        <View style={styles.doneState}>
          <CheckIcon />
          <Text style={styles.doneTitle}>Document submitted!</Text>
          <Text style={styles.doneSub}>{config.successMsg}</Text>
          <Primary label="Back to Verifications" onPress={() => navigation.goBack()} style={{ marginTop: 24, width: '100%' }} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Uploading state ────────────────────────────────────────────────────────
  if (status === 'uploading') {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={styles.statusText}>Uploading securely…</Text>
          <Text style={styles.statusSub}>Please don't close the app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main idle/failed state ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack label={config.title} />
      <View style={styles.content}>
        <Text style={styles.title}>{config.title}</Text>
        <Text style={styles.instruction}>{config.instruction}</Text>

        {/* File picker zone */}
        <TouchableOpacity style={styles.dropZone} onPress={pickDocument} activeOpacity={0.7}>
          {selectedFile ? (
            <View style={styles.filePreview}>
              <FileIcon />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileName} numberOfLines={2}>{selectedFile.name}</Text>
                {selectedFile.size != null && (
                  <Text style={styles.fileSize}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.dropHint}>
              <FileIcon />
              <Text style={styles.dropTitle}>Tap to select document</Text>
              <Text style={styles.dropSub}>PDF, JPG, or PNG · max 10 MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {selectedFile && (
          <TouchableOpacity style={styles.changeLink} onPress={pickDocument}>
            <Text style={styles.changeLinkText}>Change file</Text>
          </TouchableOpacity>
        )}

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒  Documents are encrypted and only used for identity verification. They are never shared with other users.
          </Text>
        </View>

        <View style={{ flex: 1 }} />

        <Primary
          label={status === 'failed' ? 'Retry Upload' : 'Upload & Submit'}
          onPress={handleUpload}
          disabled={!selectedFile}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: T.bg },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  title: {
    fontFamily: FONTS.display, fontSize: 28, color: T.ink, marginBottom: 8,
  },
  instruction: {
    fontSize: 14, color: T.mute, lineHeight: 22, marginBottom: 24,
  },
  dropZone: {
    borderWidth: 1.5, borderColor: T.hair2, borderStyle: 'dashed',
    borderRadius: 16, padding: 24, minHeight: 160,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: T.field, marginBottom: 8,
  },
  dropHint:  { alignItems: 'center', gap: 10 },
  dropTitle: { fontSize: 15, fontWeight: '600', color: T.ink },
  dropSub:   { fontSize: 12, color: T.mute },
  filePreview: { flexDirection: 'row', alignItems: 'center', gap: 14, width: '100%' },
  fileName:  { fontSize: 14, fontWeight: '600', color: T.ink, lineHeight: 20 },
  fileSize:  { fontSize: 12, color: T.mute, marginTop: 3 },
  changeLink: { alignSelf: 'center', paddingVertical: 8 },
  changeLinkText: { fontSize: 13, color: T.accent, textDecorationLine: 'underline' },
  privacyNote: {
    backgroundColor: T.accentSoft, borderRadius: 12, padding: 14,
    marginTop: 20, marginBottom: 8,
  },
  privacyText: { fontSize: 13, color: T.accent, lineHeight: 20 },
  centerState: {
    flex: 1, justifyContent: 'center', alignItems: 'center', gap: 14,
  },
  statusText: { fontSize: 16, fontWeight: '600', color: T.ink },
  statusSub:  { fontSize: 13, color: T.mute },
  doneState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 12,
  },
  doneTitle: { fontFamily: FONTS.display, fontSize: 26, color: T.ink, textAlign: 'center' },
  doneSub:   { fontSize: 14, color: T.mute, textAlign: 'center', lineHeight: 22 },
});
