import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "../context/PlayerContext";
import { isSupabaseReady } from "../api/supabase";
import {
  VISION_TYPES,
  createEmptyVisionState,
  getAllVisionAnswers,
  upsertVisionAnswers,
} from "../api/visions";

const LOCAL_STORAGE_NAMESPACE = "solo-leveling-visions";
const SAVE_DEBOUNCE_MS = 600;

function getStorageKey(playerId) {
  if (!playerId) return null;
  return `${LOCAL_STORAGE_NAMESPACE}:${playerId}`;
}

function readLocalState(storageKey) {
  if (typeof window === "undefined" || !storageKey) return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn("Failed to parse local vision state", error);
    return null;
  }
}

function writeLocalState(storageKey, state) {
  if (typeof window === "undefined" || !storageKey) return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist local vision state", error);
  }
}

function mergeState(baseState, patch) {
  return {
    ...baseState,
    [VISION_TYPES.VISION]: {
      ...baseState[VISION_TYPES.VISION],
      ...(patch?.[VISION_TYPES.VISION] || {}),
    },
    [VISION_TYPES.ANTI_VISION]: {
      ...baseState[VISION_TYPES.ANTI_VISION],
      ...(patch?.[VISION_TYPES.ANTI_VISION] || {}),
    },
  };
}

export default function useVisions({
  autoFetch = true,
  playerId: overridePlayerId,
} = {}) {
  const { player } = usePlayer();
  const playerId = overridePlayerId ?? player?.id ?? null;
  const storageKey = useMemo(() => getStorageKey(playerId), [playerId]);
  const [answers, setAnswers] = useState(() => createEmptyVisionState());
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const pendingSavesRef = useRef(new Map());

  const refresh = useCallback(async () => {
    if (!playerId) {
      setAnswers(createEmptyVisionState());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isSupabaseReady) {
        const remote = await getAllVisionAnswers(playerId);
        setAnswers(() => mergeState(createEmptyVisionState(), remote));
      } else {
        const local = readLocalState(storageKey);
        const fallback = local || createEmptyVisionState();
        setAnswers(() => mergeState(createEmptyVisionState(), fallback));
      }
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [playerId, storageKey]);

  useEffect(() => {
    if (autoFetch) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [autoFetch, refresh]);

  useEffect(() => () => {
    pendingSavesRef.current.forEach((timeoutId) => clearTimeout(timeoutId));
    pendingSavesRef.current.clear();
  }, []);

  const persistLocal = useCallback(
    (nextState) => {
      if (!isSupabaseReady && storageKey) {
        writeLocalState(storageKey, nextState);
      }
    },
    [storageKey],
  );

  const queueSupabaseSave = useCallback(
    (type, questionId, value) => {
      if (!playerId || !isSupabaseReady) return;

      const key = `${type}:${questionId}`;
      if (pendingSavesRef.current.has(key)) {
        clearTimeout(pendingSavesRef.current.get(key));
      }

      setSaving(true);
      const timeoutId = setTimeout(async () => {
        pendingSavesRef.current.delete(key);
        try {
          await upsertVisionAnswers(playerId, type, {
            [questionId]: value,
          });
        } catch (err) {
          setError(err);
        } finally {
          if (pendingSavesRef.current.size === 0) {
            setSaving(false);
          }
        }
      }, SAVE_DEBOUNCE_MS);

      pendingSavesRef.current.set(key, timeoutId);
    },
    [playerId],
  );

  const updateAnswer = useCallback(
    (type, questionId, value) => {
      if (!type || !questionId) return;

      setAnswers((prev) => {
        const next = {
          ...prev,
          [type]: {
            ...(prev[type] || {}),
            [questionId]: value,
          },
        };
        persistLocal(next);
        return next;
      });

      if (isSupabaseReady) {
        queueSupabaseSave(type, questionId, value);
      }
    },
    [persistLocal, queueSupabaseSave],
  );

  const source = isSupabaseReady ? "supabase" : "local";

  return {
    answers,
    visionAnswers: answers[VISION_TYPES.VISION],
    antiVisionAnswers: answers[VISION_TYPES.ANTI_VISION],
    loading,
    saving,
    error,
    refresh,
    updateAnswer,
    supabaseReady: isSupabaseReady,
    source,
  };
}
