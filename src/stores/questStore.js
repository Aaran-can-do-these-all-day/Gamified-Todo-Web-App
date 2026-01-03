import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app.quests.v1";

let uidCounter = 0;
export const uid = () => {
  uidCounter += 1;
  return `q_${Date.now()}_${uidCounter}`;
};

const QuestsContext = createContext(null);

const loadQuests = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load quests", err);
    return [];
  }
};

const persistQuests = (quests) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quests));
  } catch (err) {
    console.warn("Failed to save quests", err);
  }
};

export function QuestsProvider({ children }) {
  const [quests, setQuests] = useState(loadQuests);

  useEffect(() => {
    persistQuests(quests);
  }, [quests]);

  const addQuest = (quest) => {
    const now = new Date().toISOString();
    const next = {
      id: quest?.id || uid(),
      title: quest.title || "New Quest",
      description: quest.description || "",
      category: quest.category || "General",
      difficulty: quest.difficulty || "Normal",
      credits: quest.credits ?? 0,
      xp: quest.xp ?? 0,
      status: quest.status || "Not Started",
      tags: quest.tags || [],
      createdFromHabitId: quest.createdFromHabitId,
      progress: quest.progress ?? 0,
      createdAt: quest.createdAt || now,
    };
    setQuests((prev) => [next, ...prev]);
    return next;
  };

  const updateQuest = (id, patch) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuest = (id) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
  };

  const value = useMemo(
    () => ({ quests, addQuest, updateQuest, removeQuest }),
    [quests]
  );

  // Use createElement to avoid JSX in .js file during build import analysis
  return React.createElement(QuestsContext.Provider, { value }, children);
}

export const useQuests = () => {
  const ctx = useContext(QuestsContext);
  if (!ctx) throw new Error("useQuests must be used within QuestsProvider");
  return ctx;
};
