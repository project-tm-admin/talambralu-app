/**
 * Firebase Auth helpers
 *
 * Phone OTP flow:
 *   1. @react-native-firebase/auth triggers SafetyNet/Play Integrity on Android
 *      so Firebase can send the SMS natively — no Twilio or backend needed.
 *   2. The verificationId returned by the native SDK is a plain server-side string
 *      that the Firebase JS SDK can consume directly via PhoneAuthProvider.credential.
 *   3. signInWithCredential on the JS SDK auth instance keeps Firestore/Storage
 *      auth state in sync — no token exchange or bridging required.
 */
import {
  PhoneAuthProvider,
  signInWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';
import rnfbAuth from '@react-native-firebase/auth';

// auth is initialized once in config.js with getReactNativePersistence(AsyncStorage)
// All functions below use that single auth instance — never call getAuth() elsewhere

// ─── Phone Auth ───────────────────────────────────────────────────────────────

// Module-level store for the verificationId so it never travels through
// React Navigation params.
let _pendingVerificationId = null;
export function getPendingConfirmation() { return _pendingVerificationId; }
export function clearPendingConfirmation() { _pendingVerificationId = null; }

/**
 * Step 1: Send OTP to phone number.
 * Native SDK triggers SafetyNet → Firebase sends SMS.
 * Stores verificationId in memory; navigate to OTP screen after calling this.
 * @param {string} phoneNumber  e.g. "+14155551234"
 * @returns {Promise<string>} verificationId
 */
export async function sendPhoneOTP(phoneNumber) {
  const confirmation = await rnfbAuth().signInWithPhoneNumber(phoneNumber);
  _pendingVerificationId = confirmation.verificationId;
  return _pendingVerificationId;
}

/**
 * Step 2: Verify OTP code and complete sign-in via the JS SDK.
 * @param {string} verificationId  From sendPhoneOTP / getPendingConfirmation
 * @param {string} otp  6-digit SMS code
 */
export async function verifyPhoneOTP(verificationId, otp) {
  const credential = PhoneAuthProvider.credential(verificationId, otp);
  return signInWithCredential(auth, credential);
}

// ─── Google Sign-In ───────────────────────────────────────────────────────────

/**
 * Sign in with Google using an id_token from expo-auth-session
 * @param {string} idToken  Google ID token
 * @param {string} accessToken  Google access token
 */
export async function signInWithGoogle(idToken, accessToken) {
  const credential = GoogleAuthProvider.credential(idToken, accessToken);
  return signInWithCredential(auth, credential);
}

// ─── Apple Sign-In ────────────────────────────────────────────────────────────

/**
 * Sign in with Apple using credentials from expo-apple-authentication
 * @param {string} identityToken
 * @param {string} nonce
 */
export async function signInWithApple(identityToken, nonce) {
  const provider  = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });
  return signInWithCredential(auth, credential);
}

// ─── Sign Out ─────────────────────────────────────────────────────────────────

export async function signOut() {
  return fbSignOut(auth);
}

// ─── Password Reset ───────────────────────────────────────────────────────────

export async function forgotPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

// ─── Auth State Observer ──────────────────────────────────────────────────────

export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}
