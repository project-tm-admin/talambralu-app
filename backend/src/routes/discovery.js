/**
 * GET /discovery/feed
 *
 * Returns a scored, filtered list of potential matches for the calling user.
 *
 * Query params:
 *   limit   — number of profiles to return (default: 20, max: 50)
 *   seen    — comma-separated UIDs to exclude (already swiped)
 *
 * Response:
 *   { profiles: [ { uid, profile, photos, verification, matchScore }, ... ] }
 */
const express  = require('express');
const router   = express.Router();
const { db }   = require('../firebase');
const { scoreMatch } = require('../utils/matchScore');

const FEED_PAGE_SIZE     = parseInt(process.env.FEED_PAGE_SIZE     || '20', 10);
const MAX_FETCH_OVERHEAD = 100; // fetch extra to allow filtering

router.get('/feed', async (req, res) => {
  try {
    const myUid = req.user.uid;

    // ── 1. Load caller's user doc ──────────────────────────────────────────
    const mySnap = await db.collection('users').doc(myUid).get();
    if (!mySnap.exists) {
      return res.status(404).json({ error: 'Your user profile was not found' });
    }
    const myUser = mySnap.data();

    if (!myUser.onboardingComplete) {
      return res.status(403).json({ error: 'Onboarding not complete' });
    }

    // ── 2. Parse request params ────────────────────────────────────────────
    const requestedLimit = Math.min(
      parseInt(req.query.limit || FEED_PAGE_SIZE, 10),
      50
    );
    const seenUids = req.query.seen
      ? req.query.seen.split(',').filter(Boolean)
      : [];

    // ── 3. Load caller's interests doc (to exclude passed / already sent) ─
    const interestsSnap = await db.collection('interests').doc(myUid).get();
    const interests      = interestsSnap.exists ? interestsSnap.data() : {};
    const passedUids     = (interests.passed       || []);
    const sentUids       = (interests.sent         || []).map(s => s.toUid || s);
    const shortlistedUids = (interests.shortlisted || []);

    const excludeUids = new Set([
      myUid,
      ...seenUids,
      ...passedUids,
      ...sentUids,
    ]);

    // ── 4. Determine target gender ─────────────────────────────────────────
    const myProfile    = myUser.profile || {};
    const targetGender = myProfile.gender === 'Woman' ? 'Man' : 'Woman';

    // ── 5. Query Firestore ─────────────────────────────────────────────────
    const snap = await db.collection('users')
      .where('onboardingComplete', '==', true)
      .where('profile.gender', '==', targetGender)
      .limit(requestedLimit + excludeUids.size + MAX_FETCH_OVERHEAD)
      .get();

    // ── 6. Filter + score ──────────────────────────────────────────────────
    const scored = [];
    for (const docSnap of snap.docs) {
      const candidate = docSnap.data();
      if (excludeUids.has(candidate.uid)) continue;

      const matchScore = scoreMatch(myUser, candidate);

      scored.push({
        uid:          candidate.uid,
        profile:      candidate.profile      || {},
        photos:       candidate.photos       || [],
        photoCount:   candidate.photoCount   || 0,
        verification: candidate.verification || {},
        age:          candidate.age          || null,
        matchScore,
        isShortlisted: shortlistedUids.includes(candidate.uid),
      });

      if (scored.length >= requestedLimit) break;
    }

    // ── 7. Sort by score descending ────────────────────────────────────────
    scored.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({ profiles: scored });

  } catch (err) {
    console.error('GET /discovery/feed error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
