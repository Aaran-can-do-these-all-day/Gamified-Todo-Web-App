import React, { createContext, useState, useContext } from 'react';

interface Habit {
  id: string;
  name: string;
  color: string;
  completedDays: Set<string>;
  reminders: string[];
}

interface HabitContextType {
  habits: Habit[];
  addHabit: (name: string, color: string) => void;
  editHabit: (id: string, name: string, color: string) => void;
  deleteHabit: (id: string) => void;
  completeHabit: (id: string, date: string) => void;
  resetHabitProgress: (id: string) => void;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const addHabit = (name: string, color: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      color,
      completedDays: new Set(),
      reminders: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const editHabit = (id: string, name: string, color: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, name, color } : habit))
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
  };

  const completeHabit = (id: string, date: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const updatedDays = new Set(habit.completedDays);
          updatedDays.add(date);
          return { ...habit, completedDays: updatedDays };
        }
        return habit;
      })
    );
  };

  const resetHabitProgress = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id ? { ...habit, completedDays: new Set() } : habit))
    );
  };

  return (
    <HabitContext.Provider value={{ habits, addHabit, editHabit, deleteHabit, completeHabit, resetHabitProgress }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabitContext = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabitContext must be used within a HabitProvider');
  }
  return context;
};