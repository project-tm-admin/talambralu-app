/**
 * AppContext — global state powered by Firebase
 *
 * Provides: user auth state, profile, matches, conversations,
 * interests (shortlist/sent/received), premium status, notifications count
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { subscribeToAuth, signOut } from '../firebase/auth';
import {
  getUserDoc, createUserDoc, updateUserDoc, updateUserProfile,
  subscribeToUser, subscribeToConversations, subscribeToInterests,
  ensureInterestsDoc, markOnboardingComplete,
  saveFCMToken, recordProfileVisit, fetchUsersByIds,
} from '../firebase/firestore';
import {
  fetchFeed,
  apiSendInterest, apiRespondToInterest,
  apiPassProfile, apiShortlist,
} from '../firebase/api';
import { setupNotifications } from '../services/notifications';
import { initializePurchases, subscribeToPurchaseUpdates } from '../services/purchases';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const [firebaseUser,  setFirebaseUser]  = useState(undefined); // undefined = loading
  const [userDoc,       setUserDoc]       = useState(null);
  const [authLoading,   setAuthLoading]   = useState(true);

  // ── Matches ───────────────────────────────────────────────────────────────
  const [matches,       setMatches]       = useState([]);
  const [matchesLoading,setMatchesLoading]= useState(false);
  const [seenUids,      setSeenUids]      = useState([]);

  // ── Interests ─────────────────────────────────────────────────────────────
  const [interests,     setInterests]     = useState({ sent: [], received: [], shortlisted: [], passed: [] });

  // ── Conversations ─────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState([]);
  const [convParticipants, setConvParticipants] = useState({}); // uid → userDoc cache

  // ── Misc ──────────────────────────────────────────────────────────────────
  const [unreadCount,   setUnreadCount]   = useState(0);

  const unsubConv = useRef(null);
  const unsubInt  = useRef(null);
  const unsubUser = useRef(null);

  // ── Auth state observer ───────────────────────────────────────────────────
  useEffect(() => {
    // Hard timeout — if Firebase doesn't resolve in 8s, unblock navigation
    const timeout = setTimeout(() => setAuthLoading(false), 8000);

    const unsub = subscribeToAuth(async fbUser => {
      clearTimeout(timeout);
      try {
        setFirebaseUser(fbUser);
        if (fbUser) {
          // Ensure user doc exists in Firestore
          let doc = await getUserDoc(fbUser.uid);
          if (!doc) {
            await createUserDoc(fbUser.uid, {
              email: fbUser.email || null,
              phone: fbUser.phoneNumber || null,
            });
            await ensureInterestsDoc(fbUser.uid);
            doc = await getUserDoc(fbUser.uid);
          }
          setUserDoc(doc);
          subscribeToRealtime(fbUser.uid);

          // Register for push notifications
          try {
            const token = await setupNotifications();
            if (token) await saveFCMToken(fbUser.uid, token);
          } catch (e) {
            console.warn('Push notification setup failed:', e.message);
          }

          // Initialize RevenueCat with Firebase UID so webhook payloads carry it
          try {
            await initializePurchases(fbUser.uid);
            // Listen for real-time purchase updates (e.g. after restore)
            subscribeToPurchaseUpdates(async (info) => {
              const active = !!info?.entitlements?.active?.['premium'];
              // Optimistically update local state; webhook will confirm server-side
              setUserDoc(prev => prev ? { ...prev, isPremium: active } : prev);
            });
          } catch (e) {
            console.warn('RevenueCat init failed:', e.message);
          }
        } else {
          // Signed out — clean up
          setUserDoc(null);
          setMatches([]);
          setInterests({ sent: [], received: [], shortlisted: [], passed: [] });
          setConversations([]);
          unsubConv.current?.();
          unsubInt.current?.();
          unsubUser.current?.();
        }
      } catch (e) {
        console.error('AppContext auth handler error:', e.message);
      } finally {
        setAuthLoading(false);
      }
    });

    return () => {
      clearTimeout(timeout);
      unsub();
    };
  }, []);

  function subscribeToRealtime(uid) {
    // User doc (keeps isPremium, profile edits etc. live)
    unsubUser.current?.();
    unsubUser.current = subscribeToUser(uid, doc => {
      if (doc) setUserDoc(doc);
    });

    // Conversations
    unsubConv.current?.();
    unsubConv.current = subscribeToConversations(uid, convs => {
      setConversations(convs);
      // Count unread
      const unread = convs.filter(c =>
        c.lastMessage && c.lastMessage.from !== uid && !c.lastMessage.read
      ).length;
      setUnreadCount(unread);
    });

    // Interests
    unsubInt.current?.();
    unsubInt.current = subscribeToInterests(uid, data => {
      setInterests(data);
    });
  }

  // ── Load matches ──────────────────────────────────────────────────────────
  const loadMatches = useCallback(async () => {
    if (!userDoc) return;
    setMatchesLoading(true);
    try {
      const alreadySeen = [...seenUids, ...(interests.passed || [])];
      // Backend returns pre-scored profiles — no client-side scoring needed
      const { profiles } = await fetchFeed(alreadySeen, 20);
      // Normalise field name: backend returns matchScore, UI reads matchPct
      const normalised = profiles.map(u => ({ ...u, matchPct: u.matchScore }));
      setMatches(normalised);
    } catch (e) {
      console.error('loadMatches error', e);
    } finally {
      setMatchesLoading(false);
    }
  }, [userDoc, seenUids, interests.passed]);

  useEffect(() => {
    if (userDoc?.onboardingComplete) loadMatches();
  }, [userDoc?.onboardingComplete]);

  // ── Preload conversation participants ─────────────────────────────────────
  useEffect(() => {
    if (!firebaseUser || !conversations.length) return;
    const unknownUids = conversations
      .flatMap(c => c.participants)
      .filter(uid => uid !== firebaseUser.uid && !convParticipants[uid]);
    const unique = [...new Set(unknownUids)];
    if (!unique.length) return;
    fetchUsersByIds(unique).then(users => {
      const map = {};
      users.forEach(u => { map[u.uid] = u; });
      setConvParticipants(prev => ({ ...prev, ...map }));
    });
  }, [conversations, firebaseUser]);

  // ── Actions ───────────────────────────────────────────────────────────────

  async function passMatch(uid) {
    if (!firebaseUser) return;
    setSeenUids(prev => [...prev, uid]);
    setMatches(prev => prev.filter(m => m.uid !== uid));
    await apiPassProfile(uid).catch(e => console.warn('passProfile API error:', e.message));
    if (matches.length <= 2) loadMatches();
  }

  async function shortlist(uid) {
    if (!firebaseUser) return;
    await apiShortlist(uid, true).catch(e => console.warn('shortlist API error:', e.message));
  }

  async function removeFromShortlist(uid) {
    if (!firebaseUser) return;
    await apiShortlist(uid, false).catch(e => console.warn('removeShortlist API error:', e.message));
  }

  /**
   * Send interest via backend (enforces daily limit).
   * Returns { success } or throws { status: 429, data: { upgradeRequired: true } }
   * for free-tier limit reached — callers should catch and show paywall.
   */
  async function sendInterest(uid) {
    if (!firebaseUser) return;
    setSeenUids(prev => [...prev, uid]);
    setMatches(prev => prev.filter(m => m.uid !== uid));
    await apiSendInterest(uid); // may throw 429
    if (matches.length <= 2) loadMatches();
  }

  async function acceptInterest(fromUid) {
    if (!firebaseUser) return;
    return apiRespondToInterest(fromUid, true); // returns { conversationId }
  }

  async function declineInterest(fromUid) {
    if (!firebaseUser) return;
    return apiRespondToInterest(fromUid, false);
  }

  async function updateProfile(data) {
    if (!firebaseUser) return;
    await updateUserProfile(firebaseUser.uid, data);
    setUserDoc(prev => ({ ...prev, profile: { ...(prev?.profile || {}), ...data } }));
  }

  async function completeOnboarding() {
    if (!firebaseUser) return;
    await markOnboardingComplete(firebaseUser.uid);
    setUserDoc(prev => ({ ...prev, onboardingComplete: true }));
    await loadMatches();
  }

  async function visitProfile(profileUid) {
    if (!firebaseUser) return;
    await recordProfileVisit(firebaseUser.uid, profileUid);
  }

  async function logout() {
    await signOut();
  }

  // ── Derived helpers ───────────────────────────────────────────────────────

  const isPremium = userDoc?.isPremium === true;

  function getConvPeer(conv) {
    if (!firebaseUser) return null;
    const peerUid = conv.participants?.find(u => u !== firebaseUser.uid);
    return peerUid ? convParticipants[peerUid] : null;
  }

  const pendingRequests = (interests.received || []).filter(r => r.status === 'pending');

  return (
    <AppCtx.Provider value={{
      // Auth
      firebaseUser,
      userDoc,
      authLoading,
      isAuthenticated: !!firebaseUser,
      isOnboarded: userDoc?.onboardingComplete === true,
      isPremium,

      // Profile
      updateProfile,
      completeOnboarding,

      // Matches
      matches,
      matchesLoading,
      loadMatches,
      passMatch,
      shortlist,
      removeFromShortlist,
      sendInterest,

      // Interests
      interests,
      pendingRequests,
      acceptInterest,
      declineInterest,

      // Conversations
      conversations,
      convParticipants,
      getConvPeer,
      unreadCount,

      // Misc
      visitProfile,
      logout,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
