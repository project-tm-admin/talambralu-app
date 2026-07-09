/**
 * RevenueCat in-app purchases service
 * Uses react-native-purchases SDK (requires EAS build — native module)
 *
 * Products:
 *  talambralu_premium_1m  — $14.99/month
 *  talambralu_premium_3m  — $34.99/3 months
 *  talambralu_premium_12m — $99.99/year
 *
 * Entitlement: "premium"
 */
import { Platform } from 'react-native';

let Purchases = null;

async function getSDK() {
  if (Purchases) return Purchases;
  try {
    Purchases = require('react-native-purchases').default;
    return Purchases;
  } catch (e) {
    console.warn('[Purchases] SDK not available (Expo Go?)', e.message);
    return null;
  }
}

export async function initializePurchases(userId) {
  const sdk = await getSDK();
  if (!sdk) return;

  const apiKey = Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_RC_IOS_KEY
    : process.env.EXPO_PUBLIC_RC_ANDROID_KEY;

  await sdk.configure({ apiKey });

  if (userId) {
    await sdk.logIn(userId);
  }
}

/**
 * Get available offerings from RevenueCat (fetches from App Store / Play Store).
 */
export async function getOfferings() {
  const sdk = await getSDK();
  if (!sdk) return null;
  try {
    const offerings = await sdk.getOfferings();
    return offerings.current;
  } catch (e) {
    console.error('[Purchases] getOfferings error', e);
    return null;
  }
}

/**
 * Purchase a package.
 * @param {object} pkg  A RevenueCat Package object from getOfferings()
 */
export async function purchasePackage(pkg) {
  const sdk = await getSDK();
  if (!sdk) throw new Error('Purchases SDK not available');
  const { customerInfo } = await sdk.purchasePackage(pkg);
  return customerInfo;
}

/**
 * Restore previous purchases (required by App Store guidelines).
 */
export async function restorePurchases() {
  const sdk = await getSDK();
  if (!sdk) throw new Error('Purchases SDK not available');
  const customerInfo = await sdk.restorePurchases();
  return customerInfo;
}

/**
 * Check if user has active premium entitlement.
 */
export async function checkPremiumStatus() {
  const sdk = await getSDK();
  if (!sdk) return false;
  try {
    const info = await sdk.getCustomerInfo();
    return !!info.entitlements.active['premium'];
  } catch {
    return false;
  }
}

/**
 * Subscribe to customer info updates.
 */
export function subscribeToPurchaseUpdates(callback) {
  getSDK().then(sdk => {
    if (sdk) sdk.addCustomerInfoUpdateListener(callback);
  });
}

/**
 * Is the SDK available (only in EAS builds)?
 */
export function isPurchasesAvailable() {
  try {
    require('react-native-purchases');
    return true;
  } catch {
    return false;
  }
}
