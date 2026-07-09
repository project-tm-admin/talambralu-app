/**
 * Server-side match scoring — mirrors src/utils/matchScore.js in the app.
 * Returns 45–99 so every card has a meaningful score shown.
 */

function getAgeFromDob(dobString) {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  const now  = new Date();
  let age    = now.getFullYear() - dob.getFullYear();
  const m    = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function scoreMatch(myUser, theirUser) {
  const me    = myUser.profile    || {};
  const them  = theirUser.profile || {};
  const prefs = me.preferences    || {};

  let score    = 0;
  let maxScore = 0;

  function add(points, condition) {
    maxScore += points;
    if (condition) score += points;
  }

  // Age match (20 pts)
  if (them.dob || theirUser.age) {
    const theirAge = theirUser.age || getAgeFromDob(them.dob);
    const ageMin   = prefs.ageMin || 22;
    const ageMax   = prefs.ageMax || 40;
    add(20, theirAge >= ageMin && theirAge <= ageMax);
  }

  // Native state (15 pts)
  add(15, me.nativeState && them.nativeState && me.nativeState === them.nativeState);

  // Religion (15 pts)
  add(15, me.religion && them.religion && me.religion === them.religion);

  // Community (10 pts)
  if (prefs.community?.length) {
    add(10, prefs.community.includes(them.community));
  } else {
    add(10, true);
  }

  // Education (10 pts)
  if (prefs.education?.length) {
    add(10, prefs.education.includes(them.education));
  } else {
    add(10, true);
  }

  // Visa status (10 pts)
  if (prefs.visaStatus?.length) {
    add(10, prefs.visaStatus.includes(them.visaStatus));
  } else {
    add(10, true);
  }

  // Diet (5 pts)
  if (me.diet && them.diet) {
    add(5, me.diet === them.diet);
  }

  // Location hub (5 pts)
  add(5, me.locationHub && them.locationHub && me.locationHub === them.locationHub);

  // Verification bonus (10 pts)
  const theirVerif = theirUser.verification || {};
  if (theirVerif.face || theirVerif.govId) score += 10;
  maxScore += 10;

  const raw = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
  return Math.min(99, Math.max(45, raw));
}

module.exports = { scoreMatch };
