const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

admin.initializeApp();

const db = admin.firestore();

// ─── Helper: send FCM to a single user ───────────────────────────────────────

async function sendPushToUser(uid, { title, body, data = {} }) {
  try {
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return;

    const fcmToken = snap.data().fcmToken;
    if (!fcmToken) return;

    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
      data: { ...data, click_action: 'FLUTTER_NOTIFICATION_CLICK' },
      apns: {
        payload: {
          aps: { badge: 1, sound: 'default' },
        },
      },
      android: {
        priority: 'high',
        notification: { sound: 'default' },
      },
    });
  } catch (err) {
    // Stale token or user deleted — log and move on
    console.error(`sendPushToUser(${uid}) failed:`, err.message);
  }
}

// ─── Helper: write a notification doc ────────────────────────────────────────

async function writeNotification(uid, { type, title, body, fromUid, meta = {} }) {
  await db
    .collection('notifications')
    .doc(uid)
    .collection('items')
    .add({
      type,
      title,
      body,
      fromUid: fromUid || null,
      meta,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
}

// ─── Trigger 1: Interest received ────────────────────────────────────────────
//
// Fires whenever interests/{uid} is written.
// Detects newly-added items in the `received` array and notifies the owner.

exports.onInterestReceived = functions.firestore
  .document('interests/{uid}')
  .onWrite(async (change, context) => {
    const uid = context.params.uid;

    // Document deleted — nothing to do
    if (!change.after.exists) return;

    const before = change.before.exists ? (change.before.data().received || []) : [];
    const after  = change.after.data().received || [];

    // Find newly added pending interests
    const beforeFromUids = new Set(before.map(r => r.fromUid));
    const newInterests   = after.filter(
      r => r.status === 'pending' && !beforeFromUids.has(r.fromUid)
    );

    if (!newInterests.length) return;

    for (const interest of newInterests) {
      const fromUid = interest.fromUid;

      // Fetch sender's name
      let senderName = 'Someone';
      try {
        const senderSnap = await db.collection('users').doc(fromUid).get();
        if (senderSnap.exists) {
          const p = senderSnap.data().profile || {};
          senderName = p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Someone';
        }
      } catch (_) {}

      const title = 'New Interest!';
      const body  = `${senderName} sent you an interest.`;

      await Promise.all([
        sendPushToUser(uid, { title, body, data: { type: 'interest', fromUid } }),
        writeNotification(uid, { type: 'interest', title, body, fromUid }),
      ]);
    }
  });

// ─── Trigger 2: Message sent ──────────────────────────────────────────────────
//
// Fires whenever a new message is created in a conversation.
// Notifies the other participant.

exports.onMessageSent = functions.firestore
  .document('conversations/{convId}/messages/{msgId}')
  .onCreate(async (snap, context) => {
    const { convId } = context.params;
    const message    = snap.data();
    const fromUid    = message.from;

    // Load conversation to find the recipient
    const convSnap = await db.collection('conversations').doc(convId).get();
    if (!convSnap.exists) return;

    const participants = convSnap.data().participants || [];
    const toUid        = participants.find(uid => uid !== fromUid);
    if (!toUid) return;

    // Fetch sender's name
    let senderName = 'Someone';
    try {
      const senderSnap = await db.collection('users').doc(fromUid).get();
      if (senderSnap.exists) {
        const p = senderSnap.data().profile || {};
        senderName = p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Someone';
      }
    } catch (_) {}

    // Truncate long messages in the notification body
    const preview = message.text
      ? message.text.length > 80 ? message.text.slice(0, 77) + '…' : message.text
      : message.type === 'image' ? '📷 Photo' : 'New message';

    const title = senderName;
    const body  = preview;

    await Promise.all([
      sendPushToUser(toUid, {
        title,
        body,
        data: { type: 'message', convId, fromUid },
      }),
      writeNotification(toUid, {
        type:    'message',
        title,
        body,
        fromUid,
        meta:    { convId },
      }),
    ]);
  });

// ─── Trigger 3: Interest accepted → notify sender ─────────────────────────────
//
// Fires when interests/{uid} is updated and a sent interest changes to 'accepted'.

exports.onInterestAccepted = functions.firestore
  .document('interests/{uid}')
  .onWrite(async (change, context) => {
    const uid = context.params.uid;
    if (!change.before.exists || !change.after.exists) return;

    const before = change.before.data().sent || [];
    const after  = change.after.data().sent  || [];

    // Find interests that just flipped to 'accepted'
    const newlyAccepted = after.filter(s => {
      const toUid = s.toUid || s;
      const prev  = before.find(b => (b.toUid || b) === toUid);
      return s.status === 'accepted' && prev && prev.status !== 'accepted';
    });

    if (!newlyAccepted.length) return;

    for (const interest of newlyAccepted) {
      const accepterUid = interest.toUid || interest;

      let accepterName = 'Someone';
      try {
        const aSnap = await db.collection('users').doc(accepterUid).get();
        if (aSnap.exists) {
          const p = aSnap.data().profile || {};
          accepterName = p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || 'Someone';
        }
      } catch (_) {}

      const title = 'Interest Accepted! 🎉';
      const body  = `${accepterName} accepted your interest. Say hello!`;

      await Promise.all([
        sendPushToUser(uid, { title, body, data: { type: 'interest_accepted', fromUid: accepterUid } }),
        writeNotification(uid, { type: 'interest_accepted', title, body, fromUid: accepterUid }),
      ]);
    }
  });

// ─── Agora RTC token (existing) ───────────────────────────────────────────────

exports.generateAgoraToken = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be logged in to start a call.');
  }

  const { channelName, uid } = data;
  if (!channelName || uid === undefined) {
    throw new functions.https.HttpsError('invalid-argument', 'channelName and uid are required.');
  }

  const appId   = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERT;

  if (!appId || !appCert) {
    throw new functions.https.HttpsError('failed-precondition', 'Agora credentials missing in functions/.env');
  }

  const expirationTimeInSeconds = Math.floor(Date.now() / 1000) + 3600;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId, appCert, channelName, uid, RtcRole.PUBLISHER, expirationTimeInSeconds
  );

  return { token };
});
