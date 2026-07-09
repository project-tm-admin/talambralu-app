/**
 * Firebase Auth helpers
 * All auth via Firebase JS SDK v10 — no @react-native-firebase dependency.
 * Phone OTP uses signInWithPhoneNumber with a lightweight custom ApplicationVerifier.
 * For production: swap the verifier for a WebView-based reCAPTCHA implementation.
 * For development/testing: add test phone numbers in Firebase Console →
 *   Authentication → Sign-in method → Phone → Test phone numbers.
 */
import {
  signInWithPhoneNumber,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from './config';

// auth is initialized once in config.js with getReactNativePersistence(AsyncStorage)
// All functions below use that single auth instance — never call getAuth() elsewhere

// ─── Phone Auth ───────────────────────────────────────────────────────────────

/**
 * Minimal ApplicationVerifier — satisfies Firebase JS SDK's interface.
 * Firebase skips real reCAPTCHA validation for test phone numbers added
 * in the Firebase Console. For production phone numbers, replace verify()
 * with a real reCAPTCHA token from a WebView widget.
 */
const silentVerifier = {
  type: 'recaptcha',
  verify: () => Promise.resolve(''),
  reset: () => {},    // Firebase calls reset() after verify() — must exist
  _reset: () => {},   // Firebase v11 internal alias
};

// Module-level store for the ConfirmationResult so it never travels
// through React Navigation params (which can't serialize class instances).
let _pendingConfirmation = null;
export function getPendingConfirmation() { return _pendingConfirmation; }
export function clearPendingConfirmation() { _pendingConfirmation = null; }

/**
 * Step 1: Send OTP to phone number.
 * Stores the ConfirmationResult in memory; navigate to OTP screen after.
 * @param {string} phoneNumber  e.g. "+14155551234"
 */
export async function sendPhoneOTP(phoneNumber) {
  const confirmation = await signInWithPhoneNumber(auth, phoneNumber, silentVerifier);
  _pendingConfirmation = confirmation;
  return confirmation; // still returned so callers that don't use the singleton also work
}

/**
 * Step 2: Verify OTP code.
 * @param {ConfirmationResult} confirmation  Returned from sendPhoneOTP
 * @param {string} otp  6-digit code
 */
export async function verifyPhoneOTP(confirmation, otp) {
  return confirmation.confirm(otp);
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
