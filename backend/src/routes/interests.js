/**
 * Interests routes
 *
 * POST /interests/send         — send interest (enforces daily free-tier limit)
 * POST /interests/respond      — accept or decline a received interest
 * POST /interests/pass         — pass on a profile
 * POST /interests/shortlist    — shortlist / un-shortlist a profile
 */
const express  = require('express');
const router   = express.Router();
const { db, admin } = require('../firebase');

const DAILY_INTEREST_LIMIT = parseInt(process.env.DAILY_INTEREST_LIMIT || '3', 10);

// ─── Helpers ────────────────────────────────────────────────────────────────

function todayKey() {
  // YYYY-MM-DD in UTC
  return new Date().toISOString().slice(0, 10);
}

async function getInterestsDoc(uid) {
  const snap = await db.collection('interests').doc(uid).get();
  return snap.exists ? snap.data() : { sent: [], received: [], shortlisted: [], passed: [], dailyCounts: {} };
}

// ─── POST /interests/send ────────────────────────────────────────────────────

router.post('/send', async (req, res) => {
  const myUid    = req.user.uid;
  const { toUid } = req.body;

  if (!toUid || typeof toUid !== 'string') {
    return res.status(400).json({ error: 'toUid is required' });
  }
  if (toUid === myUid) {
    return res.status(400).json({ error: 'Cannot send interest to yourself' });
  }

  try {
    // Load caller's user doc to check premium status
    const mySnap = await db.collection('users').doc(myUid).get();
    if (!mySnap.exists) return res.status(404).json({ error: 'User not found' });
    const myUser = mySnap.data();

    // Load interests doc
    const myInterests = await getInterestsDoc(myUid);

    // Check for duplicate
    const alreadySent = (myInterests.sent || []).some(s => (s.toUid || s) === toUid);
    if (alreadySent) {
      return res.status(409).json({ error: 'Interest already sent to this user' });
    }

    // Enforce daily limit for free users
    if (!myUser.isPremium) {
      const today      = todayKey();
      const dailyCounts = myInterests.dailyCounts || {};
      const todayCount  = dailyCounts[today] || 0;

      if (todayCount >= DAILY_INTEREST_LIMIT) {
        return res.status(429).json({
          error: 'Daily interest limit reached',
          limit: DAILY_INTEREST_LIMIT,
          upgradeRequired: true,
        });
      }
    }

    // Ensure target user exists
    const theirSnap = await db.collection('users').doc(toUid).get();
    if (!theirSnap.exists) return res.status(404).json({ error: 'Target user not found' });

    // Atomic batch write
    const batch     = db.batch();
    const timestamp = Date.now();
    const today     = todayKey();

    // My sent list
    batch.set(db.collection('interests').doc(myUid), {
      sent: admin.firestore.FieldValue.arrayUnion({
        toUid,
        timestamp,
        status: 'pending',
      }),
      [`dailyCounts.${today}`]: admin.firestore.FieldValue.increment(1),
    }, { merge: true });

    // Their received list
    batch.set(db.collection('interests').doc(toUid), {
      received: admin.firestore.FieldValue.arrayUnion({
        fromUid: myUid,
        timestamp,
        status: 'pending',
      }),
    }, { merge: true });

    await batch.commit();

    return res.json({ success: true });

  } catch (err) {
    console.error('POST /interests/send error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /interests/respond ─────────────────────────────────────────────────

router.post('/respond', async (req, res) => {
  const myUid              = req.user.uid;
  const { fromUid, accept } = req.body;

  if (!fromUid || typeof accept !== 'boolean') {
    return res.status(400).json({ error: 'fromUid and accept (boolean) are required' });
  }

  try {
    const [myInterests, theirInterests] = await Promise.all([
      getInterestsDoc(myUid),
      getInterestsDoc(fromUid),
    ]);

    const status = accept ? 'accepted' : 'declined';

    // Update my received list
    const updatedReceived = (myInterests.received || []).map(r =>
      (r.fromUid === fromUid && r.status === 'pending') ? { ...r, status } : r
    );

    // Update their sent list
    const updatedSent = (theirInterests.sent || []).map(s =>
      ((s.toUid || s) === myUid && s.status === 'pending') ? { ...s, status } : s
    );

    const batch = db.batch();
    batch.set(db.collection('interests').doc(myUid),   { received: updatedReceived }, { merge: true });
    batch.set(db.collection('interests').doc(fromUid), { sent: updatedSent },         { merge: true });

    // If accepted, create conversation
    if (accept) {
      const convRef = db.collection('conversations').doc();
      batch.set(convRef, {
        participants:  [myUid, fromUid],
        createdAt:     admin.firestore.FieldValue.serverTimestamp(),
        updatedAt:     admin.firestore.FieldValue.serverTimestamp(),
        acceptedAt:    admin.firestore.FieldValue.serverTimestamp(),
        lastMessage:   null,
      });

      await batch.commit();
      return res.json({ success: true, conversationId: convRef.id });
    }

    await batch.commit();
    return res.json({ success: true });

  } catch (err) {
    console.error('POST /interests/respond error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /interests/pass ────────────────────────────────────────────────────

router.post('/pass', async (req, res) => {
  const myUid       = req.user.uid;
  const { theirUid } = req.body;

  if (!theirUid) return res.status(400).json({ error: 'theirUid is required' });

  try {
    await db.collection('interests').doc(myUid).set({
      passed: admin.firestore.FieldValue.arrayUnion(theirUid),
    }, { merge: true });

    return res.json({ success: true });
  } catch (err) {
    console.error('POST /interests/pass error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /interests/shortlist ───────────────────────────────────────────────

router.post('/shortlist', async (req, res) => {
  const myUid            = req.user.uid;
  const { theirUid, add } = req.body; // add: true = shortlist, false = remove

  if (!theirUid || typeof add !== 'boolean') {
    return res.status(400).json({ error: 'theirUid and add (boolean) are required' });
  }

  try {
    const op = add
      ? admin.firestore.FieldValue.arrayUnion(theirUid)
      : admin.firestore.FieldValue.arrayRemove(theirUid);

    await db.collection('interests').doc(myUid).set(
      { shortlisted: op },
      { merge: true }
    );

    return res.json({ success: true });
  } catch (err) {
    console.error('POST /interests/shortlist error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
