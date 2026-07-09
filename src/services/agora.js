/**
 * Agora RTC service — voice and video calls
 * Uses react-native-agora SDK
 *
 * NOTE: Requires EAS build (native module — not available in Expo Go).
 * The CallScreen will show a "build required" message in Expo Go.
 */

let RtcEngine = null;

// Lazy-load Agora only in native builds
async function getEngine() {
  if (RtcEngine) return RtcEngine;
  try {
    const Agora = require('react-native-agora');
    const engine = Agora.default.create
      ? await Agora.default.create(process.env.EXPO_PUBLIC_AGORA_APP_ID)
      : await Agora.createAgoraRtcEngine();
    RtcEngine = engine;
    return engine;
  } catch (e) {
    console.warn('[Agora] SDK not available (Expo Go?)', e.message);
    return null;
  }
}

/**
 * Fetch a short-lived Agora token from our Firebase Cloud Function.
 */
export async function fetchAgoraToken(channelName, uid) {
  const url = process.env.EXPO_PUBLIC_AGORA_TOKEN_URL;
  if (!url) throw new Error('EXPO_PUBLIC_AGORA_TOKEN_URL not set');

  const { getFunctions, httpsCallable } = await import('firebase/functions');
  const { default: app } = await import('../firebase/config');
  const functions = getFunctions(app);
  const generateToken = httpsCallable(functions, 'generateAgoraToken');
  const result = await generateToken({ channelName, uid });
  return result.data.token;
}

/**
 * Join a voice call channel.
 * @param {string} channelName  Unique per conversation
 * @param {string} token        Short-lived Agora token
 * @param {number} uid          Local user integer UID
 */
export async function joinVoiceCall(channelName, token, uid) {
  const engine = await getEngine();
  if (!engine) throw new Error('Agora not available');

  await engine.enableAudio();
  await engine.disableVideo();
  await engine.joinChannel(token, channelName, null, uid);
  return engine;
}

/**
 * Join a video call channel.
 */
export async function joinVideoCall(channelName, token, uid) {
  const engine = await getEngine();
  if (!engine) throw new Error('Agora not available');

  await engine.enableVideo();
  await engine.joinChannel(token, channelName, null, uid);
  return engine;
}

export async function leaveCall() {
  const engine = await getEngine();
  if (!engine) return;
  await engine.leaveChannel();
}

export async function toggleMute(muted) {
  const engine = await getEngine();
  if (!engine) return;
  await engine.muteLocalAudioStream(muted);
}

export async function toggleVideo(enabled) {
  const engine = await getEngine();
  if (!engine) return;
  await engine.muteLocalVideoStream(!enabled);
}

export async function switchCamera() {
  const engine = await getEngine();
  if (!engine) return;
  await engine.switchCamera();
}

export async function enableSpeaker(enabled) {
  const engine = await getEngine();
  if (!engine) return;
  await engine.setEnableSpeakerphone(enabled);
}

/**
 * Check if Agora is available (returns false in Expo Go)
 */
export async function isAgoraAvailable() {
  try {
    require('react-native-agora');
    return true;
  } catch {
    return false;
  }
}
