import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "../context/PlayerContext";

const LOCAL_STORAGE_NAMESPACE = "solo-leveling-action-plan";

const createDefaultPlan = () => ({
  avoid: "",
  do: "",
  remove: "",
  notes: "",
  avoidCompleted: false,
  doCompleted: false,
  removeCompleted: false,
  updatedAt: Date.now(),
});

function getStorageKey(playerId, dateKey) {
  if (!playerId || !dateKey) return null;
  return `${LOCAL_STORAGE_NAMESPACE}:${playerId}:${dateKey}`;
}

export default function useActionPlan(dateKey) {
  const { player } = usePlayer();
  const resolvedDateKey = useMemo(() => {
    if (dateKey) return dateKey;
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }, [dateKey]);

  const storageKey = useMemo(
    () => getStorageKey(player?.id, resolvedDateKey),
    [player?.id, resolvedDateKey],
  );

  const [actionPlan, setActionPlan] = useState(() => createDefaultPlan());

  // Load from localStorage on mount / player change
  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        setActionPlan({ ...createDefaultPlan(), ...parsed });
      } else {
        setActionPlan(createDefaultPlan());
      }
    } catch (err) {
      console.warn("Failed to read action plan", err);
      setActionPlan(createDefaultPlan());
    }
  }, [storageKey]);

  // Persist on change
  useEffect(() => {
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(actionPlan));
    } catch (err) {
      console.warn("Failed to save action plan", err);
    }
  }, [actionPlan, storageKey]);

  const updateActionPlan = (field, value) => {
    setActionPlan((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: Date.now(),
    }));
  };

  return { actionPlan, updateActionPlan };
}
