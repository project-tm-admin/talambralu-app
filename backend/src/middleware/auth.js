/**
 * requireAuth middleware
 * Verifies the Firebase ID token in the Authorization header.
 * Attaches decoded token to req.user.
 */
const { auth } = require('../firebase');

module.exports = async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed Authorization header' });
  }

  const idToken = header.slice(7);
  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded; // { uid, email, phone_number, ... }
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
