/**
 * Admin routes — protected by ADMIN_SECRET env var
 *
 * These are temporary admin tools until the full admin panel (Phase 8) is built.
 * Call them with: Authorization: Bearer <ADMIN_SECRET>
 *
 * POST /admin/verification/:docId/approve
 * POST /admin/verification/:docId/reject
 * GET  /admin/verification/queue          — list pending submissions
 */
const express = require('express');
const router  = express.Router();
const { db }  = require('../firebase');

// ─── Admin secret middleware ──────────────────────────────────────────────────

function requireAdmin(req, res, next) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    console.warn('[admin] ADMIN_SECRET not set — admin routes disabled');
    return res.status(503).json({ error: 'Admin routes not configured' });
  }
  const header = req.headers['authorization'] || '';
  if (header !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

router.use(requireAdmin);

// ─── GET /admin/verification/queue ───────────────────────────────────────────

router.get('/verification/queue', async (req, res) => {
  try {
    const snap = await db.collection('verificationQueue')
      .where('status', '==', 'pending')
      .limit(50)
      .get();

    // Sort in-memory by submittedAt (avoids needing a composite index)
    const items = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const aMs = a.submittedAt?.toMillis?.() ?? 0;
        const bMs = b.submittedAt?.toMillis?.() ?? 0;
        return aMs - bMs;
      });
    return res.json({ items });
  } catch (err) {
    console.error('GET /admin/verification/queue error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /admin/verification/:docId/approve ─────────────────────────────────

router.post('/verification/:docId/approve', async (req, res) => {
  const { docId } = req.params;
  const { note }  = req.body;

  try {
    const ref  = db.collection('verificationQueue').doc(docId);
    const snap = await ref.get();

    if (!snap.exists) return res.status(404).json({ error: 'Verification doc not found' });

    await ref.update({
      status:     'approved',
      reviewedAt: new Date(),
      reviewNote: note || null,
    });

    // The Cloud Function onVerificationStatusChanged will handle
    // updating the user doc and sending the push notification.

    return res.json({ success: true, docId, status: 'approved' });
  } catch (err) {
    console.error(`POST /admin/verification/${docId}/approve error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── POST /admin/verification/:docId/reject ──────────────────────────────────

router.post('/verification/:docId/reject', async (req, res) => {
  const { docId } = req.params;
  const { note }  = req.body;

  try {
    const ref  = db.collection('verificationQueue').doc(docId);
    const snap = await ref.get();

    if (!snap.exists) return res.status(404).json({ error: 'Verification doc not found' });

    await ref.update({
      status:     'rejected',
      reviewedAt: new Date(),
      reviewNote: note || 'Please resubmit with a clearer image.',
    });

    return res.json({ success: true, docId, status: 'rejected' });
  } catch (err) {
    console.error(`POST /admin/verification/${docId}/reject error:`, err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
