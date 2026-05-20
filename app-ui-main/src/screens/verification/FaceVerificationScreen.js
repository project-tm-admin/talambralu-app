import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { T, FONTS } from '../../theme';
import { api } from '../../api/client';

export default function FaceVerificationScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isUploading, setIsUploading] = useState(false);
  const cameraRef = useRef(null);
  const isCapturingRef = useRef(false);

  if (!permission) {
    return (
      <Screen>
        <TopBar onBack={() => navigation.goBack()} title="Face Verification" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={T.accent} />
        </View>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <TopBar onBack={() => navigation.goBack()} title="Face Verification" />
        <View style={styles.center}>
          <Text style={styles.permissionText}>
            We need your permission to show the camera to verify your face.
          </Text>
          {permission.canAskAgain ? (
            <Primary label="GRANT PERMISSION" onPress={requestPermission} />
          ) : (
            <>
              <Text style={styles.permissionText}>
                Camera access was permanently denied. Please enable it in your device settings.
              </Text>
              <Primary label="OPEN SETTINGS" onPress={() => Linking.openSettings()} />
            </>
          )}
        </View>
      </Screen>
    );
  }

  const handleCaptureAndUpload = async () => {
    if (isCapturingRef.current || !cameraRef.current) return;
    isCapturingRef.current = true;
    try {
      setIsUploading(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: false });

      const presignedData = await api.createPresignedPost('PROFILE_PHOTO', 'image/jpeg');
      if (!presignedData?.url || !presignedData?.fields) {
        throw new Error('Failed to get upload credentials from server.');
      }

      const formData = new FormData();
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', { uri: photo.uri, type: 'image/jpeg', name: 'selfie.jpg' });

      const uploadResponse = await fetch(presignedData.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed (${uploadResponse.status}). Please try again.`);
      }

      Alert.alert('Success', 'Your face verification selfie has been submitted successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Verify') },
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to capture or upload the photo. Please try again.');
    } finally {
      setIsUploading(false);
      isCapturingRef.current = false;
    }
  };

  return (
    <Screen>
      <TopBar onBack={() => navigation.goBack()} title="Face Verification" />
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Please align your face within the frame and capture a clear selfie.
        </Text>
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} facing="front" ref={cameraRef}>
            <View style={styles.overlay}>
              <View style={styles.faceGuideline} />
            </View>
          </CameraView>
        </View>
        {isUploading ? (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color={T.accent} />
            <Text style={styles.uploadingText}>Uploading securely...</Text>
          </View>
        ) : (
          <Primary label="CAPTURE" onPress={handleCaptureAndUpload} />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: T.mute,
    textAlign: 'center',
    marginBottom: 24,
  },
  instruction: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: T.mute,
    textAlign: 'center',
    marginBottom: 24,
  },
  cameraContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  faceGuideline: {
    width: 250,
    height: 350,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
    borderRadius: 125,
    borderStyle: 'dashed',
  },
  uploadingContainer: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  uploadingText: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: T.accent,
    marginLeft: 12,
  },
});
