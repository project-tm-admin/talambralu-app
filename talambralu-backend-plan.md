# Talambralu — Backend Architecture Plan

> Last updated: 2026-06-18

---

## Stack Overview

| Layer | Technology |
|---|---|
| Primary API | Node.js (Express) on Google Cloud Run |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| File storage | Firebase Storage |
| Event triggers | Firebase Cloud Functions |
| Full-text search | Algolia (or Typesense) |
| Voice / video calls | Agora RTC |
| Subscriptions / IAP | RevenueCat |
| Push notifications | Firebase Cloud Messaging (FCM) |
| Email | SendGrid |
| WhatsApp | Twilio |
| Photo moderation | Google Cloud Vision API |

---

## Firestore Data Model

### `users/{uid}`
```
// Identity
name, dob, age, gender, email, phone

// Location
usState, usCity, nativeState, nativeCity

// Background
religion, community, caste, gotra, motherTongue

// Career & Education
education, fieldOfWork, employer, jobTitle,
income, relocate, workHistory[]

// Immigration
visaStatus   // H-1B | L-1 | GC | Citizen | F-1 | Other

// Lifestyle
diet, smoking, drinking, height

// Horoscope
horoscope: { rasi, nakshatra, lagna, birthDate, birthTime,
             birthPlace, mangalDosha, kujaDosha }

// Family
family: { type, fatherName, fatherOccupation, motherName,
          motherOccupation, siblings[], familyInUS }

// Content
photos: string[]         ← Firebase Storage URLs
about: string
personality: string[]

// Profile manager
managedBy: 'self' | 'family'
familyContact: { name, relationship, phone }

// Preferences (what I'm looking for)
preferences: { ageMin, ageMax, heightMin, heightMax,
               religion[], community[], visaStatus[],
               diet[], usOnly, education[] }

// Privacy settings
privacy: { profileVisibility, photoVisibility,
           showOnlineStatus, showLastSeen,
           readReceipts, incognitoMode }

// Notification preferences
notificationPrefs: { push, email, whatsapp,
                     newInterests, newMessages,
                     newMatches, profileVisitors,
                     promotions, quietHoursStart, quietHoursEnd }

// Verification
verification: {
  phone: bool,
  face: bool,       facePending: bool,      faceUrl: string,
  visa: bool,       visaPending: bool,      visaDocUrl: string,
  income: bool,     incomePending: bool,    incomeDocUrl: string,
  education: bool,  educationPending: bool, educationDocUrl: string,
  workEmail: bool,  workEmailPending: bool,
  linkedin: bool,   govId: bool,
  trustScore: number   ← 0–100, computed from above
}

// Stats & meta
visitorCount, profileCompleteness, lastActive,
onboardingComplete, isActive, isBanned, reportCount,
createdAt, updatedAt

// Premium
isPremium, premiumTier, premiumExpiry, rcCustomerId

// Auth
fcmTokens: string[]   ← one per device
```

### `interests/{uid}`
```
sent:        [{ toUid, status: pending|accepted|rejected, sentAt, updatedAt }]
received:    [{ fromUid, status, receivedAt }]
shortlisted: [uid]
passed:      [uid]
dailySentCount: number
dailySentDate:  string   ← YYYY-MM-DD, reset by daily cron
```

### `conversations/{convId}`
```
participants:      [uid1, uid2]
participantNames:  { uid1: name, uid2: name }
participantPhotos: { uid1: url, uid2: url }
lastMessage:       { text, from, timestamp, read, type }
status:            active | archived | blocked
initiator:         uid
createdAt, unlockedAt
```

### `conversations/{convId}/messages/{msgId}`
```
text, from, timestamp, read, readAt,
type: text | call_voice | call_video | system,
callDuration (for call types)
```

### `notifications/{uid}/items/{notifId}`
```
type: interest_received | interest_accepted | new_message
    | profile_visitor | match_suggestion
    | verification_approved | verification_rejected
fromUid, fromName, fromPhoto, message,
timestamp, read, data: {}
```

### `profileVisitors/{uid}/visitors/{visitorUid}`
```
visitedAt, visitorName, visitorPhoto, visitorAge, visitorLocation
```

### `blockedUsers/{uid}`
```
blocked: [{ uid, name, blockedAt }]
```

### `reports/{reportId}`
```
reporterUid, reportedUid, reason, description,
createdAt, status: pending | reviewed | resolved
```

### `verificationQueue/{docId}`
```
uid, type: face | visa | income | education | id,
docUrl, submittedAt, status: pending | approved | rejected,
reviewedBy, reviewNote
```

### `savedSearches/{uid}/searches/{searchId}`
```
filters: {}, name, alertsEnabled, createdAt, newProfilesCount
```

### `sessions/{uid}/devices/{deviceId}`
```
deviceName, platform, lastActive, fcmToken
```

---

## Node.js API Endpoints (Cloud Run)

All endpoints require Firebase Auth ID token in `Authorization: Bearer <token>` header.

### Auth `/auth`
| Method | Path | Description |
|---|---|---|
| POST | `/complete-signup` | Create userDoc, send welcome email |
| DELETE | `/account` | Delete Firebase Auth user + full Firestore cleanup |
| POST | `/change-phone` | Verify new number, update doc |
| POST | `/change-email` | Verify new email, update doc |
| GET | `/sessions` | List active devices |
| DELETE | `/sessions/:deviceId` | Revoke device session |
| POST | `/work-email/send` | Send OTP to work email |
| POST | `/work-email/verify` | Verify OTP → mark workEmail: true |

### Users `/users`
| Method | Path | Description |
|---|---|---|
| GET | `/me` | Own profile |
| PATCH | `/me` | Update any profile field |
| PATCH | `/me/photos/reorder` | Reorder photos array |
| DELETE | `/me/photos/:index` | Remove one photo |
| PATCH | `/me/preferences` | Update search preferences |
| PATCH | `/me/privacy` | Privacy settings |
| PATCH | `/me/notification-prefs` | Notification settings |
| PATCH | `/me/manager` | Self vs family managed |
| GET | `/me/completeness` | Profile completeness score (0–100%) |
| POST | `/me/visit/:targetUid` | Record visit + increment visitorCount (skip if incognito) |
| GET | `/:uid` | Other user's profile (enforces privacy + premium gates) |

### Discovery `/discovery`
| Method | Path | Description |
|---|---|---|
| GET | `/feed` | Curated personalized match feed. Excludes passed/blocked/same gender. Applies preferences + filters. Scores by compatibility. Free: 3 profiles/day cap. Premium: unlimited. |
| GET | `/search?q=&filters=` | Text search (Algolia) + multi-filter. Filters: age, religion, community, visa, diet, usOnly, hasPhotos, hasHoroscope, isFaceVerified, sameCaste, nonSmoker, nonDrinker, active7days |
| POST | `/searches` | Save current search config |
| GET | `/searches` | List saved searches |
| DELETE | `/searches/:id` | Delete saved search |
| PATCH | `/searches/:id/alerts` | Toggle new-profile alerts |
| POST | `/searches/:id/run` | Re-run saved search for new profiles |

### Interests `/interests`
| Method | Path | Description |
|---|---|---|
| POST | `/send` | Send interest. Enforce dailySentCount limit (free: 3, premium: ∞). Trigger FCM to receiver. |
| POST | `/accept` | Accept interest. Create conversation doc. Trigger FCM to sender. |
| POST | `/reject` | Reject interest, update status |
| POST | `/shortlist` | Add uid to shortlisted[] |
| DELETE | `/shortlist/:uid` | Remove from shortlist |
| GET | `/sent` | List sent interests (with populated name/photo) |
| GET | `/received` | List received interests (premium gate: full list; free: last 3) |
| GET | `/shortlisted` | List shortlisted profiles |

### Conversations `/conversations`
| Method | Path | Description |
|---|---|---|
| POST | `/:convId/archive` | Archive conversation |
| POST | `/:convId/unarchive` | Unarchive |
| POST | `/:convId/block` | Block conversation + user |
| PATCH | `/:convId/read` | Mark all messages read |

### Calls `/calls`
| Method | Path | Description |
|---|---|---|
| POST | `/token` | Generate Agora RTC token. Params: channelId, uid, role. Validates both users are in active conversation. Expires in 1 hour. |

### Premium `/premium`
| Method | Path | Description |
|---|---|---|
| POST | `/webhook` | RevenueCat webhook. Handles: INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION, REFUND. Updates isPremium, premiumTier, premiumExpiry. |
| GET | `/status` | Verify current entitlements via RevenueCat API |
| POST | `/restore` | Trigger restore purchases via RevenueCat |

### Verification `/verification`
| Method | Path | Description |
|---|---|---|
| POST | `/face` | Upload selfie URL, create verificationQueue entry, set facePending: true |
| POST | `/document` | Upload doc URL (visa/income/education), create queue entry, set *Pending: true |
| POST | `/work-email/send` | Send OTP to work email address |
| POST | `/work-email/verify` | Verify OTP, mark workEmail: true, recalculate trustScore |
| GET | `/status` | All verification statuses for current user |

### Notifications `/notifications`
| Method | Path | Description |
|---|---|---|
| GET | `/` | List notifications (paginated, last 50) |
| PATCH | `/read-all` | Mark all as read |
| PATCH | `/:id/read` | Mark one as read |
| POST | `/register-device` | Save FCM token to sessions + fcmTokens[] |
| DELETE | `/deregister-device` | Remove FCM token on logout |

### Privacy `/privacy`
| Method | Path | Description |
|---|---|---|
| POST | `/block/:targetUid` | Add to blocked list + remove from each other's feeds |
| DELETE | `/block/:targetUid` | Unblock |
| GET | `/blocked` | List blocked users |
| POST | `/report` | Create report entry + increment reportCount |

### Admin `/admin` *(separate middleware — service account only)*
| Method | Path | Description |
|---|---|---|
| GET | `/users` | List users (filters: banned, unverified, flagged) |
| PATCH | `/users/:uid` | Ban / suspend / verify / override fields |
| GET | `/verification-queue` | Pending verifications (face + docs) |
| PATCH | `/verification/:id/approve` | Approve → update user flags, recalculate trustScore, send FCM + email |
| PATCH | `/verification/:id/reject` | Reject → notify user with reason |
| GET | `/reports` | List open user reports |
| PATCH | `/reports/:id/resolve` | Resolve report, action reported user |
| POST | `/notifications/broadcast` | Send FCM to all users or a segment |

---

## Cloud Functions (Firebase-triggered)

| Function | Trigger | Action |
|---|---|---|
| `onUserCreated` | Firebase Auth: new user | Creates userDoc skeleton in Firestore |
| `onInterestWritten` | Firestore write on `interests/{uid}` | Sends FCM push when new interest received |
| `onMessageCreated` | Firestore write on `messages/{msgId}` | FCM push to other participant; updates `lastMessage` on conversation |
| `onPhotoUploaded` | Storage: `photos/{uid}/*` | Runs Cloud Vision API for moderation; auto-rejects explicit content |
| `onVerificationDocUploaded` | Storage: `verification/{uid}/*` | Adds to verificationQueue; notifies admin |
| `dailyInterestReset` | Cron: midnight UTC | Resets `dailySentCount` to 0 for all users |
| `dailyMatchFeedRefresh` | Cron: 6 AM UTC | Pre-computes and caches match feeds for users active in last 7 days |
| `premiumExpiryCheck` | Cron: hourly | Queries expired premiums, sets `isPremium: false`, sends "renew" FCM |
| `savedSearchAlerts` | Cron: daily | Runs each user's saved searches, sends "N new profiles" FCM if alertsEnabled |

---

## Match Score Algorithm

Inputs: `currentUser.preferences` vs candidate profile

```
Religion match                →  20 pts
Community match               →  15 pts
Age within preferred range    →  15 pts
US state match                →  10 pts
Education level compatible    →  10 pts
Visa / immigration match      →  10 pts
Diet compatible               →   5 pts
Horoscope Gunamilan ≥ 18      →  10 pts
Preferences alignment         →   5 pts
────────────────────────────────────────
Total → normalize to 0–100%
```

---

## Premium Feature Gates (server-enforced)

| Feature | Free | Premium |
|---|---|---|
| Daily interests | 3 | Unlimited |
| Match feed profiles / day | 3 | Unlimited |
| Received interests list | Last 3 only | Full list |
| Profile visitors | Count only | Full list with names + photos |
| Shortlisted you | Blurred | Full |
| Full verified details on profiles | Hidden | Visible |
| Voice intros / private messaging | Gated | Unlocked |
| Advanced filters (visa, community, gotra) | Off | On |
| Incognito browsing | Off | On |
| Search result depth | Limited | Full |

> **Critical:** Premium gates must be enforced on the server. Never trust the client's `isPremium` claim.

---

## Third-party Services

| Service | Purpose |
|---|---|
| **Agora** | Voice + video calls (RTC token generation) |
| **RevenueCat** | Subscription lifecycle (purchase, renewal, expiry, refund) |
| **FCM** | All push notifications |
| **SendGrid** | Transactional emails (welcome, interest received, weekly digest) |
| **Twilio** | WhatsApp notification channel |
| **Google Cloud Vision** | Photo moderation on upload |
| **Algolia / Typesense** | Full-text search in discovery (name, city, profession) |
| **Jumio / Onfido** *(optional)* | Automated document KYC vs manual admin review |

---

## Build Phases

### Phase 1 — Foundation *(nothing else works without this)*
- Onboarding data save (all 14 screens → Firestore)
- Photo upload to Firebase Storage + URL save
- Profile completeness score calculation
- `onUserCreated` Cloud Function

### Phase 2 — Discovery
- `/discovery/feed` with compatibility scoring
- Algolia setup for `/discovery/search`
- Filter enforcement (all FiltersScreen options)
- Free-tier daily limit logic (3 profiles/day)

### Phase 3 — Interests & Conversations
- Full `/interests` flow (send, accept, reject, shortlist)
- `/interests/accept` creating conversation doc
- FCM triggers for interest received + message received
- `dailyInterestReset` cron

### Phase 4 — Calls
- `/calls/token` Agora token generation
- Validate both participants in active conversation before issuing token

### Phase 5 — Premium
- RevenueCat webhook handler
- All server-side premium gates enforced
- `premiumExpiryCheck` cron

### Phase 6 — Verification
- Document + selfie upload flow
- verificationQueue management
- Admin review API
- trustScore recalculation on approval/rejection

### Phase 7 — Notifications & Privacy
- Full FCM fanout for all event types
- Email via SendGrid
- WhatsApp via Twilio
- Block / report flow
- Saved search alerts cron

### Phase 8 — Admin Panel
- Full admin API
- Moderation dashboard (verification queue + reports)
- Broadcast notifications
