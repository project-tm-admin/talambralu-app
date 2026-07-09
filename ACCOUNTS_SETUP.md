# Talambralu — Accounts & Credentials Setup

Complete this before running `npm install` on the new codebase.
Follow each section in order — each service depends on the previous ones being ready.

---

## 1. Firebase (Google) — FREE

**What it covers:** Authentication (Phone, Google, Apple), Firestore database, Cloud Storage (photos), Push Notifications (FCM)

### Steps
1. Go to https://console.firebase.google.com
2. Click **Add project** → name it `talambralu` → disable Google Analytics (optional) → Create
3. In the project dashboard:

### Enable Authentication
- Sidebar → **Authentication** → Get started
- **Sign-in method** tab → Enable:
  - ✅ **Phone** (no extra config needed)
  - ✅ **Google** → enter support email → Save
  - ✅ **Apple** → you need Apple Developer account first (Section 4 below) → then come back and enter: Service ID = `com.talambralu.app.signin`, Team ID from your Apple account
  - ✅ **Email/Password** (for admin/test purposes)

### Enable Firestore
- Sidebar → **Firestore Database** → Create database
- Choose **Production mode** → pick region `us-central1` → Done
- After creation, go to **Rules** tab and paste:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /interests/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /conversations/{convId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
      allow create: if request.auth != null;
    }
    match /conversations/{convId}/messages/{msgId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Enable Cloud Storage
- Sidebar → **Storage** → Get started → Production mode → us-central1 → Done
- **Rules** tab → paste:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Get your config keys
- Project Settings (gear icon) → **General** → scroll to "Your apps"
- Click **</>** (Web app) → Register app name `talambralu-rn` → Copy the config object
- You'll get something like:
```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "talambralu.firebaseapp.com",
  projectId: "talambralu",
  storageBucket: "talambralu.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```
→ Copy each value into `.env` (see Section 6 below)

### Download native config files (for EAS Build)
- In **Your apps**, also add:
  - **Android app** → package name: `com.talambralu.app` → Download `google-services.json` → place at repo root
  - **iOS app** → bundle ID: `com.talambralu.app` → Download `GoogleService-Info.plist` → place at repo root

---

## 2. Agora — FREE (10,000 minutes/month)

**What it covers:** Voice and video calls

### Steps
1. Go to https://console.agora.io → Sign up
2. **Create Project** → name: `talambralu` → **Secured mode (App ID + Token)** → Submit
3. On the project page:
   - Copy **App ID** → goes into `.env` as `EXPO_PUBLIC_AGORA_APP_ID`
   - Click **Config** → copy **App Certificate** → goes into `.env` as `AGORA_APP_CERTIFICATE`

### Token Server (required for Secured mode)
Agora requires a short-lived token for each call (security). Deploy this as a Firebase Cloud Function:

```js
// functions/index.js
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
exports.generateAgoraToken = functions.https.onCall((data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Login required');
  const { channelName, uid } = data;
  const token = RtcTokenBuilder.buildTokenWithUid(
    process.env.AGORA_APP_ID,
    process.env.AGORA_APP_CERT,
    channelName, uid, RtcRole.PUBLISHER,
    Math.floor(Date.now() / 1000) + 3600
  );
  return { token };
});
```

Deploy with: `firebase deploy --only functions`
→ URL goes into `.env` as `EXPO_PUBLIC_AGORA_TOKEN_URL`

---

## 3. RevenueCat — FREE (up to $2,500/month revenue)

**What it covers:** In-app subscriptions (Premium tier) via Apple + Google native billing

### Steps
1. Go to https://app.revenuecat.com → Sign up
2. **+ New Project** → name: `Talambralu`
3. Add **iOS app**: 
   - Bundle ID: `com.talambralu.app`
   - App Store Connect API key (see Section 4 below)
   - Copy the iOS **Public SDK Key** → goes into `.env` as `EXPO_PUBLIC_RC_IOS_KEY`
4. Add **Android app**:
   - Package: `com.talambralu.app`
   - Google Play credentials (see Section 5 below)
   - Copy the Android **Public SDK Key** → goes into `.env` as `EXPO_PUBLIC_RC_ANDROID_KEY`

### Set up Products in RevenueCat
- Products → + New Product for each:
  | Product ID              | Type          | Price  |
  |-------------------------|---------------|--------|
  | `talambralu_premium_1m` | Subscription  | $14.99/month |
  | `talambralu_premium_3m` | Subscription  | $34.99/3 months |
  | `talambralu_premium_12m`| Subscription  | $99.99/year |

- Entitlements → + New Entitlement → ID: `premium` → attach all 3 products
- Offerings → + New Offering → ID: `default` → add all 3 as packages

---

## 4. Apple Developer Account — $99/year

**What it covers:** TestFlight, App Store, Apple Sign-In, iOS in-app purchases

### Steps
1. Go to https://developer.apple.com/programs/ → Enroll
   - Use your organization/individual Apple ID
   - Pay $99/year
   - Takes 24-48h to activate

2. Once active, in **Certificates, Identifiers & Profiles**:
   - **Identifiers** → + → App ID → Bundle: `com.talambralu.app`
   - Enable capabilities: ✅ Sign In with Apple, ✅ Push Notifications, ✅ In-App Purchase

3. **App Store Connect** (https://appstoreconnect.apple.com):
   - My Apps → + → New App → iOS, name: Talambralu, Bundle ID: `com.talambralu.app`
   - **In-App Purchases** → + for each subscription (same IDs as RevenueCat above)
   - **API Keys** → + → name: `revenuecat`, role: App Manager → download `.p8` file
   - Give RevenueCat: Issuer ID, Key ID, and the `.p8` file

4. **Apple Sign-In Service ID** (for Firebase):
   - Identifiers → + → Services ID → ID: `com.talambralu.app.signin`
   - Configure Sign in with Apple → Primary App ID: `com.talambralu.app`
   - Add domain: your Firebase authDomain (e.g. `talambralu.firebaseapp.com`)
   - Return URL: `https://talambralu.firebaseapp.com/__/auth/handler`

---

## 5. Google Play Console — $25 one-time

**What it covers:** Android Play Store, Google Play Billing (subscriptions)

### Steps
1. Go to https://play.google.com/console → Pay $25 one-time fee
2. **Create app** → Talambralu, Android, App, Paid → Create
3. **Monetize** → Products → Subscriptions → + for each (same IDs as RevenueCat)
4. **Setup** → API access → Link to a Google Cloud project (creates service account)
   - Download JSON credentials → give to RevenueCat under Android app settings

---

## 6. Expo EAS — FREE

**What it covers:** Building iOS + Android binaries from the cloud

### Steps
1. Go to https://expo.dev → Sign up
2. `npm install -g eas-cli`
3. In the repo: `eas login` → `eas build:configure`
4. Your EAS project ID will be added to `app.json` automatically

---

## 7. Create `.env` file

Copy `.env.example` to `.env` and fill in every value:

```bash
cp .env.example .env
```

```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=talambralu.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=talambralu
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=talambralu.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123:web:abc

# Agora
EXPO_PUBLIC_AGORA_APP_ID=abc123...
AGORA_APP_CERTIFICATE=abc123...  # server-side only, never expose to client
EXPO_PUBLIC_AGORA_TOKEN_URL=https://us-central1-talambralu.cloudfunctions.net/generateAgoraToken

# RevenueCat
EXPO_PUBLIC_RC_IOS_KEY=appl_...
EXPO_PUBLIC_RC_ANDROID_KEY=goog_...

# Google OAuth (for Google Sign-In via expo-auth-session)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123-abc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123-abc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=123-abc.apps.googleusercontent.com
```

**Where to get Google client IDs:**
- Firebase Console → Authentication → Sign-in method → Google → Web client ID shown there
- For iOS/Android client IDs: Google Cloud Console → APIs → Credentials

---

## Quick-start checklist

- [ ] Firebase project created with Auth + Firestore + Storage enabled
- [ ] `google-services.json` at repo root (Android)
- [ ] `GoogleService-Info.plist` at repo root (iOS)
- [ ] `.env` filled in with Firebase keys
- [ ] Agora project created, App ID in `.env`
- [ ] RevenueCat account, iOS + Android apps added, SDK keys in `.env`
- [ ] Apple Developer Account ($99) enrolled
- [ ] Google Play Console ($25) account created
- [ ] `npm install` (after updating package.json)
- [ ] `eas login` + `eas build:configure`

---

## Estimated costs

| Service | Cost |
|---------|------|
| Firebase | Free (Spark plan — generous limits) |
| Agora | Free up to 10,000 min/month calls |
| RevenueCat | Free up to $2,500/month in revenue |
| Apple Developer | $99/year |
| Google Play | $25 one-time |
| Expo EAS | Free (2 builds/month) or $99/month unlimited |
| **Total to launch** | **~$125 + $99/year** |
