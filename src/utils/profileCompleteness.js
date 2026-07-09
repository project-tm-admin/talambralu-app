/**
 * profileCompleteness
 *
 * Returns a 0–100 score based on how many fields the user has filled in.
 * Used by MyProfileScreen to show the completeness progress bar.
 *
 * All profile fields live under userDoc.profile.*
 * Top-level fields (photos, verification) live directly on userDoc.
 */

const REQUIRED = [
  // Field path (dot-separated from profile root), weight
  { path: 'name',        weight: 10, label: 'Name' },
  { path: 'dob',         weight: 8,  label: 'Date of birth' },
  { path: 'gender',      weight: 8,  label: 'Gender' },
  { path: 'country',     weight: 6,  label: 'Location' },
  { path: 'religion',    weight: 6,  label: 'Religion' },
  { path: 'education',   weight: 6,  label: 'Education' },
  { path: 'jobTitle',    weight: 6,  label: 'Job title' },
  { path: 'visaStatus',  weight: 6,  label: 'Visa status' },
  { path: 'diet',        weight: 4,  label: 'Diet' },
  { path: 'about',       weight: 8,  label: 'About me' },
  { path: 'managedBy',   weight: 2,  label: 'Profile manager' },
];

const BONUS = [
  { path: 'nativeState',  weight: 4,  label: 'State of origin' },
  { path: 'community',    weight: 4,  label: 'Community' },
  { path: 'gothram',      weight: 2,  label: 'Gothram' },
  { path: 'employer',     weight: 4,  label: 'Company' },
  { path: 'income',       weight: 2,  label: 'Income range' },
  { path: 'family',       weight: 4,  label: 'Family details',
    check: (v) => v && v.fatherProfession },
  { path: 'horoscope',    weight: 4,  label: 'Horoscope',
    check: (v) => v && v.birthTime },
  { path: 'preferences',  weight: 4,  label: 'Partner preferences',
    check: (v) => v && v.ageMin },
];

// Top-level fields (not under profile.*)
const TOP_LEVEL = [
  { key: 'photos',       weight: 10, label: 'Photos',
    check: (userDoc) => userDoc?.photos?.length > 0 || userDoc?.photoCount > 0 },
  { key: 'verification', weight: 6,  label: 'Verified',
    check: (userDoc) => {
      const v = userDoc?.verification || {};
      return v.face || v.phone || v.visa || v.income || v.education;
    }},
];

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function isFilledIn(value) {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
}

/**
 * @param {object} userDoc  The full Firestore user document
 * @returns {{ score: number, missing: string[], pct: number }}
 */
export function computeProfileCompleteness(userDoc) {
  const profile = userDoc?.profile || {};
  let earned = 0;
  let total  = 0;
  const missing = [];

  // Required profile fields
  for (const field of REQUIRED) {
    total += field.weight;
    const val = getNestedValue(profile, field.path);
    const filled = field.check ? field.check(val) : isFilledIn(val);
    if (filled) {
      earned += field.weight;
    } else {
      missing.push(field.label);
    }
  }

  // Bonus profile fields
  for (const field of BONUS) {
    total += field.weight;
    const val = getNestedValue(profile, field.path);
    const filled = field.check ? field.check(val) : isFilledIn(val);
    if (filled) earned += field.weight;
    else missing.push(field.label);
  }

  // Top-level fields
  for (const field of TOP_LEVEL) {
    total += field.weight;
    if (field.check(userDoc)) earned += field.weight;
    else missing.push(field.label);
  }

  const pct = total > 0 ? Math.round((earned / total) * 100) : 0;
  return { score: pct, pct, missing };
}

/**
 * Quick helper — just returns the percentage (0–100).
 */
export function getProfileCompleteness(userDoc) {
  return computeProfileCompleteness(userDoc).pct;
}
