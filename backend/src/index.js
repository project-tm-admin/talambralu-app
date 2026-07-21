/**
 * Talambralu API — Express entry point
 * Deployed to Cloud Run via Dockerfile
 */
const express    = require('express');
const helmet     = require('helmet');
const cors       = require('cors');
const requireAuth = require('./middleware/auth');

const discoveryRouter  = require('./routes/discovery');
const interestsRouter  = require('./routes/interests');
const webhooksRouter   = require('./routes/webhooks');
const adminRouter      = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 8080;

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  // In production, restrict to your app's domain / RN bundle
  origin: process.env.ALLOWED_ORIGIN || '*',
}));
app.use(express.json());

// ─── Health check (no auth) ──────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Webhooks (no user auth — verified by shared secret) ─────────────────────
app.use('/webhooks', webhooksRouter);

// ─── Admin routes (secret-protected, no user token needed) ───────────────────
app.use('/admin', adminRouter);

// ─── Authenticated routes ────────────────────────────────────────────────────
app.use('/discovery', requireAuth, discoveryRouter);
app.use('/interests', requireAuth, interestsRouter);

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Error handler ────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Talambralu API listening on port ${PORT}`);
});

module.exports = app;
