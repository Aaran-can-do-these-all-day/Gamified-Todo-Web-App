import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Link2, Loader2, Plus, X } from "lucide-react";
import useHabits from "../hooks/useHabits";
import useLinkedHabitsStore from "../stores/linkedHabitsStore";

// Demo habits (same as Habits page fallback)
const DEMO_HABITS = [
  {
    id: "demo-1",
    title: "Touch grass",
    icon: "🌱",
    color: "green",
    xpPerDay: 15,
    streak: 12,
  },
  {
    id: "demo-2",
    title: "Workout",
    icon: "💪",
    color: "orange",
    xpPerDay: 25,
    streak: 8,
  },
  {
    id: "demo-3",
    title: "Read 1 page",
    icon: "📖",
    color: "blue",
    xpPerDay: 10,
    streak: 20,
  },
  {
    id: "demo-4",
    title: "Productivity Learning",
    icon: "🧠",
    color: "purple",
    xpPerDay: 35,
    streak: 5,
  },
];

// Difficulty settings with XP/credit multipliers
const DIFFICULTY_CONFIG = {
  Easy: { xpBase: 10, creditsBase: 5, color: "text-green-400", bg: "bg-green-500/20" },
  Normal: { xpBase: 20, creditsBase: 10, color: "text-blue-400", bg: "bg-blue-500/20" },
  Hard: { xpBase: 35, creditsBase: 20, color: "text-orange-400", bg: "bg-orange-500/20" },
  "S-Rank": { xpBase: 50, creditsBase: 30, color: "text-red-400", bg: "bg-red-500/20" },
};

// Determine difficulty from habit's streak/xp
const getHabitDifficulty = (habit) => {
  const xpPerDay = habit?.xpPerDay || habit?.rewardXP || 10;
  if (xpPerDay >= 40) return "S-Rank";
  if (xpPerDay >= 25) return "Hard";
  if (xpPerDay >= 15) return "Normal";
  return "Easy";
};

const categoryColors = {
  Discipline: "from-purple-500/30 to-purple-900/30 border-purple-500/30",
  Health: "from-emerald-500/30 to-emerald-900/30 border-emerald-500/30",
  Mindfulness: "from-blue-500/30 to-blue-900/30 border-blue-500/30",
  Learning: "from-amber-500/30 to-amber-900/30 border-amber-500/30",
  General: "from-gray-500/30 to-gray-900/30 border-white/10",
};

const categoryIconBg = {
  Discipline: "bg-gradient-to-br from-purple-500/30 to-purple-800/20",
  Health: "bg-gradient-to-br from-emerald-500/30 to-emerald-800/20",
  Mindfulness: "bg-gradient-to-br from-blue-500/30 to-blue-800/20",
  Learning: "bg-gradient-to-br from-amber-500/30 to-amber-800/20",
  General: "bg-gradient-to-br from-gray-500/30 to-gray-800/20",
};

// Map habit to internal format
const mapHabitForLinker = (habit) => ({
  id: habit.id,
  name: habit.title || habit.name || "Untitled Habit",
  category: habit.color ? colorToCategory(habit.color) : "General",
  icon: habit.icon || "🔥",
  rewardXP: habit.xpPerDay || 10,
  goldPerDay: habit.goldPerDay || 5,
  streak: habit.streak || habit.heatmap?.length || 0,
  streakMultiplier: Math.min(1 + (habit.streak || habit.heatmap?.length || 0) * 0.1, 3),
  heatmap: habit.heatmap || [],
});

// Map color to category
const colorToCategory = (color) => {
  const colorMap = {
    purple: "Discipline",
    green: "Health",
    emerald: "Health",
    blue: "Mindfulness",
    amber: "Learning",
    yellow: "Learning",
    orange: "Learning",
  };
  const lowerColor = (color || "").toLowerCase();
  for (const [key, cat] of Object.entries(colorMap)) {
    if (lowerColor.includes(key)) return cat;
  }
  return "General";
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

function HabitQuestDemo() {
  const { habits: rawHabits, loading, error, supabaseReady } = useHabits();
  const { addLinkedHabit, removeLinkedHabit, linkedHabits: storedLinkedHabits } = useLinkedHabitsStore();
  const [selectedHabitIds, setSelectedHabitIds] = useState(() => {
    // Initialize with already linked habits from store
    return new Set(storedLinkedHabits.map(h => h.id));
  });
  const [showHabitPicker, setShowHabitPicker] = useState(false);

  // Use Supabase habits if available, otherwise use demo habits
  const usingRemote = supabaseReady && !error && rawHabits.length > 0;
  const sourceHabits = usingRemote ? rawHabits : DEMO_HABITS;

  // Map all available habits to linker format
  const allHabits = useMemo(() => sourceHabits.map(mapHabitForLinker), [sourceHabits]);
  
  // Only show selected habits in the main list
  const selectedHabits = useMemo(
    () => allHabits.filter((h) => selectedHabitIds.has(h.id)),
    [allHabits, selectedHabitIds]
  );
  
  // Available habits that haven't been added yet
  const availableHabits = useMemo(
    () => allHabits.filter((h) => !selectedHabitIds.has(h.id)),
    [allHabits, selectedHabitIds]
  );

  const addHabitToLinker = (habitId) => {
    setSelectedHabitIds((prev) => new Set([...prev, habitId]));
    const habit = allHabits.find((h) => h.id === habitId);
    if (habit) {
      // Add to global linked habits store (for unpredictability engine in SystemPanel)
      addLinkedHabit(habit);
    }
  };

  const removeHabitFromLinker = (habitId) => {
    setSelectedHabitIds((prev) => {
      const next = new Set(prev);
      next.delete(habitId);
      return next;
    });
    // Remove from global linked habits store
    removeLinkedHabit(habitId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl"
    >
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600/90 via-violet-600/90 to-fuchsia-600/90 p-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="w-5 h-5 text-white/90" />
              <h2 className="text-lg font-bold text-white">Habit Quest Linker</h2>
            </div>
            <p className="text-xs text-white/70">Select habits to link for random events</p>
          </div>
          <div className="flex items-center gap-2">
            {!usingRemote && (
              <span className="text-xs text-amber-300 bg-amber-500/20 px-2 py-1 rounded-lg">
                Demo
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHabitPicker(!showHabitPicker)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-white hover:bg-white/30 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Habit
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card-dark p-4 space-y-4">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8 text-white/50">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            <span className="text-sm">Loading habits...</span>
          </div>
        )}

        {/* Habit Picker Dropdown */}
        <AnimatePresence>
          {showHabitPicker && !loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">Select Habits to Add</span>
                  <button
                    onClick={() => setShowHabitPicker(false)}
                    className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                {availableHabits.length === 0 ? (
                  <p className="text-xs text-white/50 text-center py-2">All habits have been added</p>
                ) : (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {availableHabits.map((habit) => {
                      const difficulty = getHabitDifficulty(habit);
                      const config = DIFFICULTY_CONFIG[difficulty];
                      return (
                        <motion.button
                          key={habit.id}
                          whileHover={{ scale: 1.01, x: 2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => {
                            addHabitToLinker(habit.id);
                          }}
                          className="w-full rounded-lg border border-white/10 bg-black/30 p-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left"
                        >
                          <div className={`w-8 h-8 rounded-lg ${categoryIconBg[habit.category] || categoryIconBg.General} flex items-center justify-center text-base`}>
                            {habit.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{habit.name}</p>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                              <span className={`px-1 py-0.5 rounded ${config.bg} ${config.color} text-[10px]`}>
                                {difficulty}
                              </span>
                              <span>🔥 {habit.streak}</span>
                            </div>
                          </div>
                          <Plus className="w-4 h-4 text-purple-400" />
                        </motion.button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Habits List */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-2"
          >
            {selectedHabits.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 bg-dark-900/50 px-4 py-6 text-center">
                <Sparkles className="w-8 h-8 text-purple-400/50 mx-auto mb-2" />
                <p className="text-sm text-white/50">No habits linked</p>
                <p className="text-xs text-white/30 mt-1">Click "Add Habit" to select from your habits</p>
              </div>
            ) : (
              selectedHabits.map((habit) => {
                const difficulty = getHabitDifficulty(habit);
                const config = DIFFICULTY_CONFIG[difficulty];

                return (
                  <motion.div
                    key={habit.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={`rounded-xl border bg-gradient-to-r ${categoryColors[habit.category] || categoryColors.General} p-3 flex items-center justify-between gap-3 transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${categoryIconBg[habit.category] || categoryIconBg.General} flex items-center justify-center text-lg shadow-inner`}>
                        {habit.icon || "🔥"}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{habit.name}</p>
                        <div className="flex items-center gap-2 text-xs text-white/50 flex-wrap">
                          <span className={`px-1.5 py-0.5 rounded ${config.bg} ${config.color} font-medium`}>
                            {difficulty}
                          </span>
                          <span>🔥 {habit.streak}</span>
                          <span className="text-amber-300">+{habit.rewardXP} XP/day</span>
                        </div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeHabitFromLinker(habit.id)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                      title="Remove from linker"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default HabitQuestDemo;
