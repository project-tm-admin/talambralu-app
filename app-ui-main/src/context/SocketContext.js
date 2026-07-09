import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { onIdTokenChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

// Same host as ApiClient (app-ui-main/src/api/client.js) — keep in sync.
const BASE_URL = 'http://192.168.1.2:3000';

// How long to wait before re-arming the connection after socket.io gives up
// on its own reconnection attempts (reconnectionAttempts exhausted).
const RECONNECT_RETRY_DELAY_MS = 15000;

// Module-level singleton: created once outside the React tree so every
// consumer shares one connection instead of opening a socket per render.
const socket = io(BASE_URL, {
  transports: ['websocket'], // long-polling is unreliable on React Native
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

// Latest Firebase ID token, read fresh by the Manager before every
// (re)connection attempt instead of a static snapshot captured at login —
// keeps automatic reconnects from replaying an expired token forever.
const tokenRef = { current: null };
socket.auth = (cb) => cb({ token: tokenRef.current });

let retryTimeout = null;

function armRetry() {
  if (retryTimeout) clearTimeout(retryTimeout);
  retryTimeout = setTimeout(() => {
    retryTimeout = null;
    if (tokenRef.current) socket.connect();
  }, RECONNECT_RETRY_DELAY_MS);
}

function clearRetry() {
  if (retryTimeout) {
    clearTimeout(retryTimeout);
    retryTimeout = null;
  }
}

// Manual retry, exposed via context — lets UI recover a connection that
// exhausted its automatic reconnection attempts without waiting for the
// cooldown in armRetry(), or without a full app restart.
function reconnect() {
  clearRetry();
  if (tokenRef.current) socket.connect();
}

function getErrorMessage(err) {
  if (err && typeof err.message === 'string') return err.message;
  return String(err);
}

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [socketError, setSocketError] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const handleConnect = () => {
      clearRetry();
      setConnected(true);
      setReconnecting(false);
      setSocketError(null);
    };
    const handleDisconnect = () => setConnected(false);
    const handleConnectError = (err) => setSocketError(getErrorMessage(err));
    const handleReconnectAttempt = () => setReconnecting(true);
    const handleReconnectFailed = () => {
      setReconnecting(false);
      setSocketError('Reconnect failed');
      armRetry();
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    // Reconnection lifecycle events are emitted by the Manager (socket.io),
    // not the Socket itself — https://socket.io/docs/v4/client-api/#manager
    socket.io.on('reconnect_attempt', handleReconnectAttempt);
    socket.io.on('reconnect_failed', handleReconnectFailed);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.io.off('reconnect_attempt', handleReconnectAttempt);
      socket.io.off('reconnect_failed', handleReconnectFailed);
      clearRetry();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // onIdTokenChanged (unlike onAuthStateChanged) also fires on Firebase's
    // periodic background token refresh, so tokenRef stays current for the
    // lifetime of the session, not just at sign-in.
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      // Guards against out-of-order resolution when auth state changes
      // rapidly (e.g. fast logout -> login): only the response matching the
      // latest request is allowed to touch tokenRef/socket/state.
      const thisRequestId = ++requestIdRef.current;

      if (!user) {
        tokenRef.current = null;
        clearRetry();
        socket.disconnect();
        if (!cancelled && thisRequestId === requestIdRef.current) {
          setSocketError(null);
          setReconnecting(false);
        }
        return;
      }

      try {
        const token = await user.getIdToken();
        if (cancelled || thisRequestId !== requestIdRef.current) return;
        tokenRef.current = token;
        if (!socket.connected) socket.connect();
      } catch (err) {
        if (cancelled || thisRequestId !== requestIdRef.current) return;
        setSocketError(getErrorMessage(err));
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
      clearRetry();
      socket.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({ socket, connected, reconnecting, socketError, reconnect }),
    [connected, reconnecting, socketError]
  );

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
