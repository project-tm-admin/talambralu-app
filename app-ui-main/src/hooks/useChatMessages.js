import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../api/client';
import { useSocket } from '../context/SocketContext';
import { auth } from '../config/firebase';

// Assumed wire contract (undocumented in architecture.md — see story F2.4 Dev
// Agent Record for what was actually observed/verifiable in this environment):
//   emit 'sendMessage' { matchId, text }
//   on   'newMessage'  { id, matchId, senderId, text, createdAt }
//   emit 'joinRoom'    { matchId }  — defensive, harmless if server auto-joins.
const SEND_EVENT = 'sendMessage';
const RECEIVE_EVENT = 'newMessage';
const JOIN_ROOM_EVENT = 'joinRoom';

function normalizeHistory(data) {
  const list = Array.isArray(data) ? data : (data?.data ?? data?.messages ?? data?.items ?? []);
  if (!Array.isArray(list)) return [];
  const allDated = list.every((m) => m?.createdAt && !isNaN(new Date(m.createdAt).getTime()));
  if (!allDated) return list;
  return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

export function useChatMessages(matchId) {
  const { socket, connected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const matchIdRef = useRef(matchId);
  const currentUserId = auth.currentUser?.uid ?? null;

  useEffect(() => { matchIdRef.current = matchId; }, [matchId]);
  useEffect(() => () => { mountedRef.current = false; }, []);

  const fetchHistory = useCallback((signal) => {
    if (!matchId) return;
    setLoading(true);
    setError(null);
    api.get(`/v1/chat/messages/${matchId}`, { signal })
      .then((data) => {
        if (signal?.aborted || !mountedRef.current) return;
        setMessages(normalizeHistory(data));
      })
      .catch((err) => {
        if (err?.name === 'AbortError' || signal?.aborted || !mountedRef.current) return;
        console.error('Failed to fetch chat history:', err);
        setError(err.message);
      })
      .finally(() => {
        if (!signal?.aborted && mountedRef.current) setLoading(false);
      });
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;
    const controller = new AbortController();
    fetchHistory(controller.signal);
    return () => controller.abort();
  }, [matchId, fetchHistory]);

  // Re-announce room membership on every (re)connect, not just on mount —
  // a dropped/rearmed connection (see SocketContext's armRetry) may lose
  // server-side room state even though the client-side listener survives.
  useEffect(() => {
    if (!matchId || !socket || !connected) return;
    socket.emit(JOIN_ROOM_EVENT, { matchId });
  }, [matchId, socket, connected]);

  useEffect(() => {
    if (!matchId || !socket) return;

    const handleNewMessage = (msg) => {
      if (!msg || msg.matchId !== matchIdRef.current || !mountedRef.current) return;
      setMessages((prev) => {
        // Reconcile the server echo of our own optimistic send instead of
        // appending a duplicate bubble (matched FIFO by sender + text, since
        // the assumed wire contract has no client-generated id round-trip).
        if (msg.senderId === currentUserId) {
          const pendingIndex = prev.findIndex(
            (m) => m.pending && m.senderId === msg.senderId && m.text === msg.text
          );
          if (pendingIndex !== -1) {
            const next = [...prev];
            next[pendingIndex] = { ...msg, pending: false };
            return next;
          }
        }
        if (msg.id != null && prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on(RECEIVE_EVENT, handleNewMessage);
    return () => socket.off(RECEIVE_EVENT, handleNewMessage);
  }, [matchId, socket, currentUserId]);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed || !connected || !matchId || !socket) return false;

    const localId = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setMessages((prev) => [
      ...prev,
      { id: localId, matchId, senderId: currentUserId, text: trimmed, createdAt: new Date().toISOString(), pending: true },
    ]);
    socket.emit(SEND_EVENT, { matchId, text: trimmed });
    return true;
  }, [connected, matchId, socket, currentUserId]);

  const retry = useCallback(() => fetchHistory(), [fetchHistory]);

  return { messages, loading, error, retry, sendMessage, currentUserId };
}
