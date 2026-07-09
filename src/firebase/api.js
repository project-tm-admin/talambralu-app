/**
 * Talambralu backend API client
 *
 * All calls go to the Cloud Run backend and include the user's Firebase ID
 * token for authentication. Falls back gracefully if the backend is unreachable.
 *
 * Set EXPO_PUBLIC_API_URL in your .env / EAS secrets:
 *   EXPO_PUBLIC_API_URL=https://talambralu-api-xxxx-uc.a.run.app
 */
import { auth } from './config';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';

async function getIdToken() {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return user.getIdToken();
}

async function apiFetch(path, options = {}) {
  if (!BASE_URL) throw new Error('EXPO_PUBLIC_API_URL is not set');

  const token = await getIdToken();
  const res   = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.error || 'API error'), { status: res.status, data });
  return data;
}

// ─── Discovery ───────────────────────────────────────────────────────────────

/**
 * Fetch a scored discovery feed from the backend.
 * @param {string[]} seenUids  UIDs already swiped (excluded server-side)
 * @param {number}   limit     How many profiles to return
 */
export async function fetchFeed(seenUids = [], limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (seenUids.length) params.set('seen', seenUids.join(','));
  return apiFetch(`/discovery/feed?${params}`);
  // Returns { profiles: [ { uid, profile, photos, verification, matchScore, isShortlisted } ] }
}

// ─── Interests ───────────────────────────────────────────────────────────────

export async function apiSendInterest(toUid) {
  return apiFetch('/interests/send', {
    method: 'POST',
    body: JSON.stringify({ toUid }),
  });
}

export async function apiRespondToInterest(fromUid, accept) {
  return apiFetch('/interests/respond', {
    method: 'POST',
    body: JSON.stringify({ fromUid, accept }),
  });
  // Returns { success, conversationId? }
}

export async function apiPassProfile(theirUid) {
  return apiFetch('/interests/pass', {
    method: 'POST',
    body: JSON.stringify({ theirUid }),
  });
}

export async function apiShortlist(theirUid, add) {
  return apiFetch('/interests/shortlist', {
    method: 'POST',
    body: JSON.stringify({ theirUid, add }),
  });
}
