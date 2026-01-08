// Store for habits linked via HabitQuestLinker
// These habits feed into the unpredictabilityEngine for random events in SystemPanel

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLinkedHabitsStore = create(
  persist(
    (set, get) => ({
      // Habits that have been added to the HabitQuestLinker
      linkedHabits: [],

      // Add a habit to the linked pool (source for unpredictability engine)
      addLinkedHabit: (habit) => {
        const exists = get().linkedHabits.some((h) => h.id === habit.id);
        if (exists) return;
        set((state) => ({
          linkedHabits: [
            ...state.linkedHabits,
            {
              id: habit.id,
              name: habit.name,
              category: habit.category,
              icon: habit.icon,
              rewardXP: habit.rewardXP || 10,
              streak: habit.streak || 0,
              streakMultiplier: habit.streakMultiplier || 1,
              linkedAt: new Date().toISOString(),
            },
          ],
        }));
      },

      // Remove a habit from the linked pool
      removeLinkedHabit: (habitId) => {
        set((state) => ({
          linkedHabits: state.linkedHabits.filter((h) => h.id !== habitId),
        }));
      },

      // Clear all linked habits
      clearLinkedHabits: () => {
        set({ linkedHabits: [] });
      },

      // Get a random linked habit (for unpredictability engine)
      getRandomLinkedHabit: () => {
        const habits = get().linkedHabits;
        if (habits.length === 0) return null;
        return habits[Math.floor(Math.random() * habits.length)];
      },

      // Get all linked habits
      getLinkedHabits: () => get().linkedHabits,
    }),
    {
      name: "linked-habits-storage",
    }
  )
);

export default useLinkedHabitsStore;
