/**
 * Firestore helpers — all DB reads/writes go through here
 *
 * Schema:
 *  users/{uid}            — profile + settings
 *  interests/{uid}        — sent/received interests, shortlisted, passed
 *  conversations/{convId} — chat metadata
 *  conversations/{convId}/messages/{msgId} — individual messages
 */
import {
  doc, getDoc, setDoc, updateDoc, deleteField,
  collection, query, where, orderBy, limit, getDocs,
  onSnapshot, addDoc, serverTimestamp, arrayUnion, arrayRemove,
  writeBatch, increment,
} from 'firebase/firestore';
import { db } from './config';

// ─── Users ────────────────────────────────────────────────────────────────────

export async function createUserDoc(uid, data) {
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    uid,
    createdAt: serverTimestamp(),
    onboardingComplete: false,
    isPremium: false,
    premiumExpiry: null,
    profile: {},
    ...data,
  }, { merge: true });
}

export async function getUserDoc(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, profileData) {
  const ref = doc(db, 'users', uid);
  // Merge nested profile fields
  const updates = {};
  for (const [key, val] of Object.entries(profileData)) {
    updates[`profile.${key}`] = val;
  }
  await updateDoc(ref, updates);
}

export async function updateUserDoc(uid, data) {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function markOnboardingComplete(uid) {
  await updateDoc(doc(db, 'users', uid), { onboardingComplete: true });
}

export function subscribeToUser(uid, callback) {
  return onSnapshot(doc(db, 'users', uid), snap => {
    callback(snap.exists() ? snap.data() : null);
  });
}

// ─── Matches / Discovery ──────────────────────────────────────────────────────

/**
 * Fetch potential matches for a user.
 * Filters: opposite gender, onboardingComplete, not already passed/interested
 * Scoring happens client-side in matchScore.js
 */
export async function fetchPotentialMatches(currentUser, alreadySeen = [], limitN = 20) {
  const myProfile    = currentUser.profile || {};
  // Gender values: 'Man' | 'Woman'. Show opposite gender by default.
  const targetGender = myProfile.gender === 'Woman' ? 'Man' : 'Woman';

  const q = query(
    collection(db, 'users'),
    where('onboardingComplete', '==', true),
    where('profile.gender', '==', targetGender),
    limit(limitN + alreadySeen.length + 1)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => d.data())
    .filter(u => u.uid !== currentUser.uid && !alreadySeen.includes(u.uid));
}

export async function fetchUsersByIds(uids) {
  if (!uids.length) return [];
  const chunks = [];
  for (let i = 0; i < uids.length; i += 10) chunks.push(uids.slice(i, i + 10));
  const results = [];
  for (const chunk of chunks) {
    const q = query(collection(db, 'users'), where('uid', 'in', chunk));
    const snap = await getDocs(q);
    snap.docs.forEach(d => results.push(d.data()));
  }
  return results;
}

// ─── Interests (Pass / Shortlist / Send Interest) ─────────────────────────────

export async function getInterestsDoc(uid) {
  const snap = await getDoc(doc(db, 'interests', uid));
  return snap.exists() ? snap.data() : { sent: [], received: [], shortlisted: [], passed: [] };
}

export async function passProfile(myUid, theirUid) {
  await updateDoc(doc(db, 'interests', myUid), {
    passed: arrayUnion(theirUid),
  });
}

export async function shortlistProfile(myUid, theirUid) {
  await updateDoc(doc(db, 'interests', myUid), {
    shortlisted: arrayUnion(theirUid),
  });
}

export async function removeShortlist(myUid, theirUid) {
  await updateDoc(doc(db, 'interests', myUid), {
    shortlisted: arrayRemove(theirUid),
  });
}

export async function sendInterest(myUid, theirUid) {
  const batch = writeBatch(db);
  // Record that I sent interest
  batch.update(doc(db, 'interests', myUid), {
    sent: arrayUnion({ toUid: theirUid, timestamp: Date.now(), status: 'pending' }),
  });
  // Record that they received interest
  batch.update(doc(db, 'interests', theirUid), {
    received: arrayUnion({ fromUid: myUid, timestamp: Date.now(), status: 'pending' }),
  });
  await batch.commit();
}

export async function respondToInterest(myUid, fromUid, accept) {
  const batch = writeBatch(db);
  const status = accept ? 'accepted' : 'declined';

  // Update my received list
  const myDoc = await getInterestsDoc(myUid);
  const updatedReceived = (myDoc.received || []).map(r =>
    r.fromUid === fromUid ? { ...r, status } : r
  );
  batch.update(doc(db, 'interests', myUid), { received: updatedReceived });

  // Update their sent list
  const theirDoc = await getInterestsDoc(fromUid);
  const updatedSent = (theirDoc.sent || []).map(s =>
    s.toUid === myUid ? { ...s, status } : s
  );
  batch.update(doc(db, 'interests', fromUid), { sent: updatedSent });

  // If accepted, create a conversation
  if (accept) {
    const convRef = doc(collection(db, 'conversations'));
    batch.set(convRef, {
      participants: [myUid, fromUid],
      createdAt: serverTimestamp(),
      acceptedAt: serverTimestamp(),
      lastMessage: null,
    });
  }

  await batch.commit();
}

export function subscribeToInterests(uid, callback) {
  return onSnapshot(doc(db, 'interests', uid), snap => {
    callback(snap.exists() ? snap.data() : { sent: [], received: [], shortlisted: [], passed: [] });
  });
}

// Ensure interests doc exists for a user
export async function ensureInterestsDoc(uid) {
  const ref = doc(db, 'interests', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { sent: [], received: [], shortlisted: [], passed: [] });
  }
}

// ─── Conversations ────────────────────────────────────────────────────────────

export function subscribeToConversations(uid, callback) {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function getOrCreateConversation(uid1, uid2) {
  // Check if one already exists
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid1)
  );
  const snap = await getDocs(q);
  const existing = snap.docs.find(d => {
    const p = d.data().participants;
    return p.includes(uid1) && p.includes(uid2);
  });
  if (existing) return { id: existing.id, ...existing.data() };

  // Create new
  const ref = await addDoc(collection(db, 'conversations'), {
    participants: [uid1, uid2],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  });
  return { id: ref.id, participants: [uid1, uid2] };
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export function subscribeToMessages(conversationId, callback) {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('timestamp', 'asc')
  );
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function sendMessage(conversationId, fromUid, text, type = 'text') {
  const batch = writeBatch(db);

  // Add message
  const msgRef = doc(collection(db, 'conversations', conversationId, 'messages'));
  batch.set(msgRef, {
    from: fromUid,
    text,
    type,
    timestamp: serverTimestamp(),
    read: false,
  });

  // Update conversation lastMessage + updatedAt
  batch.update(doc(db, 'conversations', conversationId), {
    lastMessage: { from: fromUid, text, type, timestamp: Date.now() },
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

export async function markMessagesRead(conversationId, myUid) {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    where('from', '!=', myUid),
    where('read', '==', false)
  );
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.update(d.ref, { read: true }));
  await batch.commit();
}

// ─── Profile Visitors ─────────────────────────────────────────────────────────

export async function recordProfileVisit(viewerUid, profileUid) {
  if (viewerUid === profileUid) return;
  const ref = doc(db, 'users', profileUid);
  await updateDoc(ref, {
    'stats.profileViews': increment(1),
    visitors: arrayUnion({ uid: viewerUid, timestamp: Date.now() }),
  });
}

// ─── User Settings ────────────────────────────────────────────────────────────

export async function saveNotificationSettings(uid, settings) {
  const updates = {};
  for (const [key, val] of Object.entries(settings)) {
    updates[`settings.notifications.${key}`] = val;
  }
  await updateDoc(doc(db, 'users', uid), updates);
}

export async function savePrivacySettings(uid, settings) {
  const updates = {};
  for (const [key, val] of Object.entries(settings)) {
    updates[`settings.privacy.${key}`] = val;
  }
  await updateDoc(doc(db, 'users', uid), updates);
}

// ─── Blocked Users ────────────────────────────────────────────────────────────

export async function getBlockedUsers(uid) {
  const snap = await getDoc(doc(db, 'blockedUsers', uid));
  if (!snap.exists()) return [];
  const blocked = snap.data().blocked || [];
  // Normalise: support both plain-UID strings and object entries
  return blocked.map(b => (typeof b === 'string' ? { uid: b } : b)).filter(b => b?.uid);
}

export async function unblockUser(myUid, theirUid) {
  const ref  = doc(db, 'blockedUsers', myUid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const blocked = (snap.data().blocked || []).filter(b =>
    typeof b === 'string' ? b !== theirUid : b.uid !== theirUid
  );
  await updateDoc(ref, { blocked });
}

// ─── Verification Queue ───────────────────────────────────────────────────────

/**
 * Submit a verification request to verificationQueue.
 * @param {string}      uid    Firebase user UID
 * @param {string}      type   'face' | 'govId' | 'visa' | 'income' | 'education'
 * @param {string|null} docUrl Download URL of the uploaded document
 */
export async function submitVerification(uid, type, docUrl) {
  const ref = doc(collection(db, 'verificationQueue'));
  await setDoc(ref, {
    uid,
    type,
    docUrl:      docUrl || null,
    status:      'pending',
    submittedAt: serverTimestamp(),
  });
  // Mark pending on user doc so UI reflects it immediately
  await updateDoc(doc(db, 'users', uid), {
    [`verification.${type}Pending`]: true,
  });
}

// ─── FCM Token ────────────────────────────────────────────────────────────────

export async function saveFCMToken(uid, token) {
  await updateDoc(doc(db, 'users', uid), { fcmToken: token, lastActive: serverTimestamp() });
}
