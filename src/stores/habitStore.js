import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "app.habits.v1";

export const todayISO = () => new Date().toISOString().slice(0, 10);

let uidCounter = 0;
export const uid = () => {
  uidCounter += 1;
  return `h_${Date.now()}_${uidCounter}`;
};

const HabitsContext = createContext(null);

const defaultHabit = () => ({
  id: uid(),
  name: "New Habit",
  category: "General",
  icon: "✅",
  startDate: todayISO(),
  endDate: null,
  frequency: "daily",
  daysRemaining: 0,
  rewardXP: 10,
  punishmentXP: 0,
  streak: 0,
  streakMultiplier: 1,
  status: "Not Started",
  notes: "",
  tags: [],
  history: [],
});

const loadHabits = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("Failed to load habits", err);
    return [];
  }
};

const persistHabits = (habits) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  } catch (err) {
    console.warn("Failed to save habits", err);
  }
};

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(loadHabits);

  useEffect(() => {
    persistHabits(habits);
  }, [habits]);

  const addHabit = (habit) => {
    const next = habit?.id ? habit : { ...defaultHabit(), ...habit };
    setHabits((prev) => [next, ...prev]);
    return next;
  };

  const updateHabit = (id, patch) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...patch } : h))
    );
  };

  const removeHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const value = useMemo(
    () => ({ habits, addHabit, updateHabit, removeHabit }),
    [habits]
  );

  // Use createElement to avoid JSX in .js file during build import analysis
  return React.createElement(HabitsContext.Provider, { value }, children);
}

export const useHabits = () => {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error("useHabits must be used within HabitsProvider");
  return ctx;
};
