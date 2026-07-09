/**
 * Firebase Admin SDK — single initialisation
 * Cloud Run: uses the service account attached to the Cloud Run service (ADC).
 * Local dev: set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
 */
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'talambralu-matrimony-e15c2',
  });
}

const db   = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
