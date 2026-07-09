/**
 * Firebase Storage helpers — photo uploads for user profiles
 */
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a profile photo from a local URI (from expo-image-picker)
 * @param {string} uid         User's Firebase UID
 * @param {string} localUri    e.g. file:///...  from ImagePicker
 * @param {number} index       Photo slot index (0-5)
 * @param {Function} onProgress  (0-100) progress callback
 * @returns {string} Download URL
 */
export async function uploadProfilePhoto(uid, localUri, index, onProgress) {
  const response = await fetch(localUri);
  const blob = await response.blob();

  const ext = localUri.split('.').pop()?.split('?')[0] || 'jpg';
  const path = `users/${uid}/photos/photo_${index}.${ext}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, {
      contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    });

    task.on('state_changed',
      snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

/**
 * Delete a photo at a given download URL from Firebase Storage.
 * (Reconstructs the storage ref from the URL)
 */
export async function deleteProfilePhoto(downloadUrl) {
  try {
    const storageRef = ref(storage, downloadUrl);
    await deleteObject(storageRef);
  } catch (err) {
    // Already deleted or URL not a storage URL — ignore
    console.warn('deleteProfilePhoto:', err.message);
  }
}

/**
 * Upload a verification document (ID, pay stub, visa copy)
 */
export async function uploadVerificationDoc(uid, localUri, docType) {
  const response = await fetch(localUri);
  const blob = await response.blob();
  const ext = localUri.split('.').pop()?.split('?')[0] || 'jpg';
  const path = `users/${uid}/verification/${docType}.${ext}`;
  const storageRef = ref(storage, path);
  await uploadBytesResumable(storageRef, blob);
  return getDownloadURL(storageRef);
}
