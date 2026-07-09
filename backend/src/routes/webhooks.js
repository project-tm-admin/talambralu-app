/**
 * POST /webhooks/revenuecat
 *
 * Receives subscription lifecycle events from RevenueCat and syncs
 * isPremium + premiumExpiry to the user's Firestore document.
 *
 * Security: RevenueCat sends the secret in the Authorization header.
 * Set REVENUECAT_WEBHOOK_SECRET as a Cloud Run env var and in RevenueCat's
 * dashboard under Project → Webhooks → Authorization header.
 *
 * RevenueCat event docs:
 * https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
 */
const express    = require('express');
const router     = express.Router();
const { db }     = require('../firebase');

// ─── Event type groups ────────────────────────────────────────────────────────

// Events that mean the user is (or has become) premium
const PREMIUM_ACTIVE_EVENTS = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'BILLING_ISSUE_RESOLVED',
  'UNCANCELLATION',
  'TRANSFER',              // subscription transferred to this user
  'NON_RENEWING_PURCHASE', // one-time lifetime purchase
]);

// Events that mean the user is no longer premium
const PREMIUM_LAPSED_EVENTS = new Set([
  'EXPIRATION',
  'CANCELLATION',
  'BILLING_ISSUE',
  'SUBSCRIBER_ALIAS',      // alias merge — no action needed but safe to demote
]);

// ─── Webhook secret verification ─────────────────────────────────────────────

function verifySecret(req, res) {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;

  // If no secret is configured, skip verification (development only)
  if (!secret) {
    console.warn('[webhook] REVENUECAT_WEBHOOK_SECRET not set — skipping verification');
    return true;
  }

  const authHeader = req.headers['authorization'] || '';
  if (authHeader !== secret) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

router.post('/revenuecat', async (req, res) => {
  if (!verifySecret(req, res)) return;

  const payload = req.body;
  const event   = payload?.event;

  if (!event) {
    return res.status(400).json({ error: 'Missing event object' });
  }

  const {
    type,
    app_user_id:     firebaseUid,
    expiration_at_ms: expirationMs,
    product_id,
    store,
  } = event;

  if (!firebaseUid) {
    console.warn('[webhook] Missing app_user_id in event:', type);
    return res.status(400).json({ error: 'Missing app_user_id' });
  }

  console.log(`[webhook] ${type} → uid=${firebaseUid} product=${product_id}`);

  try {
    const userRef = db.collection('users').doc(firebaseUid);

    if (PREMIUM_ACTIVE_EVENTS.has(type)) {
      // Grant premium
      const premiumExpiry = expirationMs ? new Date(expirationMs) : null;

      await userRef.update({
        isPremium:          true,
        premiumExpiry:      premiumExpiry,
        premiumProductId:   product_id   || null,
        premiumStore:       store         || null,
        premiumUpdatedAt:   new Date(),
      });

      console.log(`[webhook] ✅ Premium granted → ${firebaseUid} (expires ${premiumExpiry?.toISOString() ?? 'never'})`);

    } else if (PREMIUM_LAPSED_EVENTS.has(type)) {
      // Revoke premium
      await userRef.update({
        isPremium:        false,
        premiumExpiry:    null,
        premiumUpdatedAt: new Date(),
      });

      console.log(`[webhook] ❌ Premium revoked → ${firebaseUid} (reason: ${type})`);

    } else {
      // Unknown / unhandled event — log and acknowledge
      console.log(`[webhook] Unhandled event type: ${type}`);
    }

    // Always return 200 so RevenueCat doesn't retry
    return res.json({ received: true, type });

  } catch (err) {
    console.error('[webhook] Firestore update error:', err.message);
    // Return 500 — RevenueCat will retry
    return res.status(500).json({ error: 'Failed to update user' });
  }
});

module.exports = router;
