const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Firebase JS SDK v11 has a "react-native" field in each sub-package's
// package.json, so Metro picks up the correct RN bundle via
// resolverMainFields: ['react-native', 'browser', 'main'] (Expo default).
// Do NOT set unstable_enablePackageExports globally — it causes
// expo-modules-core to resolve to a non-native bundle, breaking all
// Expo native modules (ExpoWebBrowser, etc.).

module.exports = config;
