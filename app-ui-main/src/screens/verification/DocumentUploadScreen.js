import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Screen from '../../components/Screen';
import TopBar from '../../components/TopBar';
import Primary from '../../components/Primary';
import { T, FONTS } from '../../theme';
import { api } from '../../api/client';

export default function DocumentUploadScreen({ navigation, route }) {
  const { documentType } = route.params || { documentType: 'INCOME' }; // 'INCOME' or 'VISA'
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState('idle'); // 'idle', 'uploading', 'processing', 'verified', 'failed'

  const intervalRef = useRef(null);
  const isUploadingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const title = documentType === 'INCOME' ? 'Income Verification' : 'Visa Verification';
  const instruction = documentType === 'INCOME'
    ? 'Upload a recent paystub to verify your income bracket.'
    : 'Upload your I-797 or visa document to verify your status.';
  const purpose = documentType === 'INCOME' ? 'PAYSTUB' : 'VISA_DOCUMENT';

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document.');
    }
  };

  const pollVerificationStatus = (wasAlreadyVerified) => {
    setStatus('processing');
    let attempts = 0;
    const maxAttempts = 15; // 30 seconds total (2s * 15)

    intervalRef.current = setInterval(async () => {
      attempts++;
      try {
        const profile = await api.get('/v1/profiles/me');
        const isVerified = documentType === 'INCOME' ? profile.is_income_verified : !!profile.visa_status_id;

        if (isVerified && !wasAlreadyVerified) {
          clearInterval(intervalRef.current);
          setStatus('verified');
          Alert.alert('Success', 'Document verified successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else if (attempts >= maxAttempts) {
          clearInterval(intervalRef.current);
          setStatus('failed');
          Alert.alert(
            'Timeout',
            'Verification is taking longer than expected. We will notify you when it is complete.',
            [{ text: 'OK', onPress: () => navigation.goBack() }],
          );
        }
      } catch (err) {
        console.error('Polling error:', err);
        clearInterval(intervalRef.current);
        isUploadingRef.current = false;
        setStatus('failed');
        Alert.alert('Error', 'Lost connection while checking verification status. Please try again.');
      }
    }, 2000);
  };

  const handleUpload = async () => {
    if (!selectedFile || isUploadingRef.current) return;

    isUploadingRef.current = true;

    try {
      setIsUploading(true);
      setStatus('uploading');

      // Snapshot pre-upload verification state to avoid false-positive on first poll tick
      const profileBefore = await api.get('/v1/profiles/me');
      const wasAlreadyVerified = documentType === 'INCOME'
        ? profileBefore.is_income_verified
        : !!profileBefore.visa_status_id;

      const contentType = selectedFile.mimeType || 'application/octet-stream';

      // 1. Get presigned URL
      const presignedData = await api.createPresignedPost(purpose, contentType);

      if (!presignedData?.url || !presignedData?.fields) {
        throw new Error('Failed to get upload credentials.');
      }

      // 2. Prepare FormData
      const formData = new FormData();
      Object.entries(presignedData.fields).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('file', {
        uri: selectedFile.uri,
        type: contentType,
        name: selectedFile.name || 'document',
      });

      // 3. Upload to S3
      const uploadResponse = await fetch(presignedData.url, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed (${uploadResponse.status}).`);
      }

      // 4. Start polling for status update
      pollVerificationStatus(wasAlreadyVerified);
    } catch (err) {
      console.error('Upload Error:', err);
      Alert.alert('Error', err.message || 'Failed to upload document.');
      isUploadingRef.current = false;
      setStatus('failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setSelectedFile(null);
    isUploadingRef.current = false;
  };

  const renderContent = () => {
    if (status === 'uploading') {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={styles.statusText}>Uploading document securely...</Text>
        </View>
      );
    }

    if (status === 'processing') {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={T.accent} />
          <Text style={styles.statusText}>Analyzing document...</Text>
          <Text style={styles.subStatusText}>This usually takes a few seconds.</Text>
        </View>
      );
    }

    if (status === 'failed') {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.failedText}>Verification failed</Text>
          <Text style={styles.subStatusText}>Please select a document and try again.</Text>
          <Primary label="Try Again" onPress={handleRetry} style={styles.retryBtn} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.instruction}>{instruction}</Text>

        <View style={styles.filePickerContainer}>
          {selectedFile ? (
            <View style={styles.fileSelected}>
              <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                {selectedFile.name}
              </Text>
              <Text style={styles.fileSize}>
                {selectedFile.size != null
                  ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                  : 'Size unknown'}
              </Text>
              <Primary label="Change File" onPress={handlePickDocument} style={styles.changeBtn} />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Primary label="Select Document (PDF/Image)" onPress={handlePickDocument} />
            </View>
          )}
        </View>

        {selectedFile && (
          <Primary label="UPLOAD & VERIFY" onPress={handleUpload} disabled={isUploading} />
        )}
      </View>
    );
  };

  return (
    <Screen scroll={false}>
      <TopBar onBack={() => navigation.goBack()} label={title} />
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontFamily: FONTS.mono,
    fontSize: 14,
    color: T.mute,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  filePickerContainer: {
    borderWidth: 1,
    borderColor: T.hair,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    minHeight: 200,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
  },
  fileSelected: {
    alignItems: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: T.ink,
    marginBottom: 8,
  },
  fileSize: {
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: T.mute,
    marginBottom: 24,
  },
  changeBtn: {
    backgroundColor: T.field,
    width: '100%',
  },
  statusText: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    color: T.ink,
  },
  subStatusText: {
    marginTop: 8,
    fontFamily: FONTS.mono,
    fontSize: 12,
    color: T.mute,
    textAlign: 'center',
  },
  failedText: {
    fontSize: 18,
    fontWeight: '700',
    color: T.ink,
    marginBottom: 8,
  },
  retryBtn: {
    marginTop: 24,
  },
});
