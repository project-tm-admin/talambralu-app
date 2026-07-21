/**
 * Face Verification — live selfie via expo-camera → Firebase Storage → Firestore
 */
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle } from 'react-native-svg';
import { T, FONTS } from '../../theme';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { uploadVerificationDoc } from '../../firebase/storage';
import { useApp } from '../../store/AppContext';
import { submitVerification } from '../../firebase/firestore';

// expo-camera may not be available in Expo Go — lazy load
let CameraView, useCameraPermissions;
try {
  const cam = require('expo-camera');
  CameraView = cam.CameraView;
  useCameraPermissions = cam.useCameraPermissions;
} catch {
  CameraView = null;
  useCameraPermissions = () => [{ granted: false, canAskAgain: false }, () => {}];
}

function ShieldIcon() {
  return (
    <Svg width={40} height={40} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={T.accent} strokeWidth={1.5} fill={T.accentSoft} />
      <Path d="M9 12l2 2 4-4" stroke={T.accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
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

export default function FaceVerificationScreen() {
  const navigation = useNavigation();
  const { firebaseUser } = useApp();

  // Only call the hook if available
  const [permission, requestPermission] = useCameraPermissions
    ? useCameraPermissions()
    : [{ granted: false, canAskAgain: false }, () => {}];

  const cameraRef       = useRef(null);
  const isCapturingRef  = useRef(false);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | failed

  // ── No expo-camera available (Expo Go dev) ────────────────────────────────
  if (!CameraView) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack label="Face Verification" />
        <View style={styles.centerState}>
          <ShieldIcon />
          <Text style={styles.heading}>Camera not available</Text>
          <Text style={styles.sub}>Face verification requires a production build (EAS). Your profile will be marked as pending verification.</Text>
          <Primary
            label="Mark as Pending & Go Back"
            onPress={async () => {
              try {
                await submitVerification(firebaseUser.uid, 'face', null);
              } catch {}
              navigation.goBack();
            }}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Permission not granted yet ────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack label="Face Verification" />
        <View style={styles.centerState}>
          <ShieldIcon />
          <Text style={styles.heading}>Camera access needed</Text>
          <Text style={styles.sub}>
            We need camera access to take a selfie for verification. Your photo is only used to confirm your identity.
          </Text>
          {permission?.canAskAgain !== false ? (
            <Primary label="Allow Camera Access" onPress={requestPermission} style={{ marginTop: 24 }} />
          ) : (
            <>
              <Text style={[styles.sub, { marginTop: 12 }]}>Camera access was permanently denied. Enable it in Settings.</Text>
              <Primary label="Open Settings" onPress={() => Linking.openSettings()} style={{ marginTop: 16 }} />
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  // ── Uploading ─────────────────────────────────────────────────────────────
  if (status === 'uploading') {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack label="Face Verification" />
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={styles.heading}>Uploading selfie…</Text>
          <Text style={styles.sub}>Please don't close the app.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  if (status === 'done') {
    return (
      <SafeAreaView style={styles.safe}>
        <TopBar showBack label="Face Verification" />
        <View style={styles.centerState}>
          <CheckIcon />
          <Text style={styles.heading}>Selfie submitted!</Text>
          <Text style={styles.sub}>
            Your face verification is under review. You'll be notified once it's approved (usually within a few hours).
          </Text>
          <Primary label="Back to Verifications" onPress={() => navigation.goBack()} style={{ marginTop: 24 }} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Camera view ───────────────────────────────────────────────────────────
  async function handleCapture() {
    if (isCapturingRef.current || !cameraRef.current) return;
    isCapturingRef.current = true;
    setStatus('uploading');

    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.6, base64: false });

      // Upload to Firebase Storage: users/{uid}/verification/FACE_SELFIE.jpg
      const downloadUrl = await uploadVerificationDoc(
        firebaseUser.uid,
        photo.uri,
        'FACE_SELFIE'
      );

      // Submit to verificationQueue
      await submitVerification(firebaseUser.uid, 'face', downloadUrl);

      setStatus('done');
    } catch (err) {
      console.error('FaceVerification error:', err);
      Alert.alert('Error', err.message || 'Failed to upload selfie. Please try again.');
      setStatus('failed');
    } finally {
      isCapturingRef.current = false;
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <TopBar showBack label="Face Verification" />
      <View style={styles.cameraContent}>
        <Text style={styles.instruction}>
          Align your face in the oval frame and tap Capture. Ensure good lighting.
        </Text>

        <View style={styles.cameraWrap}>
          <CameraView style={styles.camera} facing="front" ref={cameraRef}>
            <View style={styles.overlay}>
              <View style={styles.faceOval} />
            </View>
          </CameraView>
        </View>

        <View style={styles.tipsRow}>
          {['Good lighting', 'No sunglasses', 'Look directly at camera'].map((tip, i) => (
            <View key={i} style={styles.tipChip}>
              <Text style={styles.tipChipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <Primary
          label={status === 'failed' ? 'Retry Capture' : 'Capture Selfie'}
          onPress={handleCapture}
          style={{ marginTop: 16 }}
        />

        <Text style={styles.privacyNote}>
          🔒  Your selfie is encrypted and only used for identity verification.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: T.bg },
  centerState: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 32, gap: 12,
  },
  heading: { fontFamily: FONTS.display, fontSize: 24, color: T.ink, textAlign: 'center' },
  sub:     { fontSize: 14, color: T.mute, textAlign: 'center', lineHeight: 22 },

  cameraContent: { flex: 1, paddingHorizontal: 20, paddingBottom: 20 },
  instruction: {
    fontSize: 14, color: T.mute, textAlign: 'center', lineHeight: 22,
    marginTop: 8, marginBottom: 16,
  },
  cameraWrap: {
    flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: '#000',
    marginBottom: 14,
  },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  faceOval: {
    width: 220, height: 290,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 110, borderStyle: 'dashed',
  },
  tipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tipChip: {
    backgroundColor: T.field, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  tipChipText: { fontSize: 12, color: T.mute, fontWeight: '500' },
  privacyNote: {
    fontSize: 12, color: T.mute, textAlign: 'center',
    marginTop: 12, lineHeight: 18,
  },
});
