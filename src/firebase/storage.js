/**
 * Firebase Storage helpers — photo uploads for user profiles
 */
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

/**
 * Convert a local URI to a Blob using XMLHttpRequest.
 *
 * WHY XHR instead of fetch():
 *   react-native-image-picker on Android 13+ returns content:// URIs from the
 *   system media picker. React Native's fetch() polyfill does NOT support the
 *   content:// scheme, so fetch(contentUri).blob() throws "Network request failed".
 *   XMLHttpRequest handles both file:// and content:// URIs correctly.
 */
function uriToBlob(uri) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new Error(`Failed to read image from device (URI: ${uri.slice(0, 60)})`));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });
}

/**
 * Upload a profile photo from a local URI (from react-native-image-picker).
 *
 * @param {string}   uid        User's Firebase UID
 * @param {string}   localUri   file:// or content:// URI from image picker
 * @param {number}   index      Photo slot index (0–5)
 * @param {Function} onProgress Optional (0–100) progress callback
 * @param {string}   mimeType   Optional MIME type e.g. 'image/jpeg' — pass
 *                              asset.type from the picker result for accuracy.
 *                              Defaults to 'image/jpeg'.
 * @returns {Promise<string>} Firebase Storage download URL
 */
export async function uploadProfilePhoto(uid, localUri, index, onProgress, mimeType) {
  const blob = await uriToBlob(localUri);

  const mime = mimeType || 'image/jpeg';
  // normalise jpeg → jpg for the file extension
  const ext  = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  // Path must match Storage rules: profilePhotos/{uid}/{filename}
  const path = `profilePhotos/${uid}/photo_${index}.${ext}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: mime });

    task.on(
      'state_changed',
      snap => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}

/**
 * Delete a profile photo by its download URL.
 */
export async function deleteProfilePhoto(downloadUrl) {
  try {
    const storageRef = ref(storage, downloadUrl);
    await deleteObject(storageRef);
  } catch (err) {
    console.warn('deleteProfilePhoto:', err.message);
  }
}

/**
 * Upload a verification document (ID, pay stub, visa copy, selfie).
 *
 * @param {string} uid       User's Firebase UID
 * @param {string} localUri  file:// or content:// URI
 * @param {string} docType   e.g. 'GOVID', 'VISA', 'INCOME', 'EDUCATION', 'FACE_SELFIE'
 * @param {string} mimeType  Optional MIME type — defaults to 'image/jpeg'
 * @returns {Promise<string>} Firebase Storage download URL
 */
export async function uploadVerificationDoc(uid, localUri, docType, mimeType) {
  const blob = await uriToBlob(localUri);

  const mime = mimeType || 'image/jpeg';
  const ext  = mime.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
  // Path must match Storage rules: verification/{uid}/{filename}
  const path = `verification/${uid}/${docType}.${ext}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, blob, { contentType: mime });
    task.on(
      'state_changed',
      null,
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (e) {
          reject(e);
        }
      },
    );
  });
}
