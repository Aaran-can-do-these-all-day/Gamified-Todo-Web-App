import { useState } from "react";
import { Shield, AlertTriangle, Flame, Zap, Crown, Skull, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock habit data with varying streaks
const mockHabits = [
  { id: 1, name: "Deep Work Session", streak: 3, category: "Discipline", icon: "🧠", status: "active", missedDays: 0 },
  { id: 2, name: "Morning Workout", streak: 15, category: "Health", icon: "💪", status: "active", missedDays: 0 },
  { id: 3, name: "Reading 30min", streak: 42, category: "Learning", icon: "📖", status: "active", missedDays: 0 },
  { id: 4, name: "Meditation", streak: 70, category: "Mindfulness", icon: "🧘", status: "active", missedDays: 0 },
  { id: 5, name: "Cold Shower", streak: 0, category: "Health", icon: "🚿", status: "penalty", missedDays: 2 },
  { id: 6, name: "No Social Media", streak: 0, category: "Discipline", icon: "📵", status: "penalty", missedDays: 1 },
];

// Evolution tier logic
const getEvolutionTier = (streak) => {
  if (streak >= 66) return { name: "Monarch", color: "purple", glow: "purple-400", rank: "S" };
  if (streak >= 30) return { name: "Veteran", color: "blue", glow: "blue-400", rank: "A" };
  if (streak >= 10) return { name: "Experienced", color: "emerald", glow: "emerald-400", rank: "B" };
  return { name: "Novice", color: "gray", glow: "gray-400", rank: "E" };
};

// Combo breaker data (last 7 days)
const generateComboData = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    completed: Math.random() > 0.3, // 70% success rate for demo
  }));
};

function EvolutionCard({ habit, onClear }) {
  const tier = getEvolutionTier(habit.streak);
  const isPenalty = habit.status === "penalty";

  const cardClasses = isPenalty
    ? "border-red-500 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
    : `border-${tier.color}-500 bg-${tier.color}-950/10 shadow-[0_0_20px_rgba(var(--${tier.glow}),0.2)]`;

  const headerClasses = isPenalty
    ? "bg-gradient-to-r from-red-600 to-red-800"
    : `bg-gradient-to-r from-${tier.color}-600 to-${tier.color}-800`;

  return (
    <motion.div
      className={`relative rounded-xl border-2 overflow-hidden ${cardClasses} ${tier.name === "Monarch" ? "animate-pulse" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rank Badge */}
      {!isPenalty && (
        <div className={`absolute top-3 right-3 w-10 h-10 rounded-full bg-${tier.color}-500/20 border-2 border-${tier.color}-400 flex items-center justify-center`}>
          <span className={`text-sm font-bold text-${tier.color}-300`}>{tier.rank}</span>
        </div>
      )}

      {/* Header */}
      <div className={`${headerClasses} px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{habit.icon}</span>
          <div>
            <h3 className="text-white font-semibold text-sm">{habit.name}</h3>
            <p className="text-xs text-white/60">{habit.category}</p>
          </div>
        </div>
        {isPenalty ? (
          <AlertTriangle className="w-5 h-5 text-red-300 animate-bounce" />
        ) : (
          tier.name === "Monarch" ? <Crown className="w-5 h-5 text-amber-300" /> : <Shield className="w-5 h-5 text-white/60" />
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {isPenalty ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-300 text-sm">
              <Skull className="w-4 h-4" />
              <span>Penalty Zone: {habit.missedDays} day(s) missed</span>
            </div>
            <div className="text-xs text-white/60 mb-3">
              ⚠️ Complete with 2x effort or pay 50 Gold to clear penalty
            </div>
            <button
              onClick={() => onClear(habit.id)}
              className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors"
            >
              Clear Penalty (-50 Gold)
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className={`w-4 h-4 text-${tier.color}-400`} />
                <span className="text-sm text-white/80">Streak:</span>
              </div>
              <span className={`text-xl font-bold text-${tier.color}-300`}>{habit.streak} days</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Tier:</span>
              <span className={`text-${tier.color}-300 font-semibold uppercase tracking-wide`}>{tier.name}</span>
            </div>
            {tier.name === "Monarch" && (
              <div className="mt-2 p-2 rounded bg-purple-500/10 border border-purple-400/30 text-xs text-purple-300 text-center">
                ✨ Shadow Monarch Status - Bonus XP Active ✨
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ComboBreakerDisplay({ comboData }) {
  const completedCount = comboData.filter((d) => d.completed).length;
  const isFullCombo = completedCount === 7;
  const comboPercentage = (completedCount / 7) * 100;

  return (
    <div className="rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-blue-950/20 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-cyan-400" />
        <h3 className="text-xl font-bold text-white">Weekly Combo Meter</h3>
      </div>

      {/* Energy Bar */}
      <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden mb-4">
        <motion.div
          className={`h-full ${isFullCombo ? "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse" : "bg-gradient-to-r from-cyan-500 to-blue-500"}`}
          initial={{ width: 0 }}
          animate={{ width: `${comboPercentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-white drop-shadow-lg">{completedCount} / 7 Days</span>
        </div>
      </div>

      {/* Day Indicators */}
      <div className="grid grid-cols-7 gap-2">
        {comboData.map((day, index) => (
          <motion.div
            key={index}
            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center ${
              day.completed
                ? "border-cyan-400 bg-cyan-500/20 text-cyan-300"
                : "border-red-400/30 bg-red-950/20 text-red-400 relative"
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {day.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                {/* Crack effect */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGxpbmUgeDE9IjAiIHkxPSIwIiB4Mj0iMjAiIHkyPSIyMCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50"></div>
              </>
            )}
            <span className="text-[10px] mt-1 font-semibold">{day.day}</span>
          </motion.div>
        ))}
      </div>

      {/* Limit Break Effect */}
      <AnimatePresence>
        {isFullCombo && (
          <motion.div
            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center font-bold"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            🔥 LIMIT BREAK! 7-DAY COMBO COMPLETE! +500 XP BONUS 🔥
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HabitEnhancementsDemo() {
  const [habits, setHabits] = useState(mockHabits);
  const [comboData] = useState(generateComboData());

  const activeHabits = habits.filter((h) => h.status === "active");
  const penaltyHabits = habits.filter((h) => h.status === "penalty");

  const handleClearPenalty = (id) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, status: "active", streak: 1, missedDays: 0 } : h
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35 uppercase mb-2">
            Feature Demo
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(59,130,246,0.35)]">
            HABIT ENHANCEMENTS
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            Evolution • Combo • Penalty
          </p>
        </div>

        {/* Combo Breaker Section */}
        <ComboBreakerDisplay comboData={comboData} />

        {/* Penalty Zone */}
        {penaltyHabits.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-500 bg-red-950/30">
                <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />
                <span className="text-sm font-bold text-red-300 uppercase tracking-wide">System Alert: Penalty Zone</span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {penaltyHabits.map((habit) => (
                <EvolutionCard key={habit.id} habit={habit} onClear={handleClearPenalty} />
              ))}
            </div>
          </div>
        )}

        {/* Evolution Cards Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            Active Habits - Evolution System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeHabits.map((habit) => (
              <EvolutionCard key={habit.id} habit={habit} onClear={handleClearPenalty} />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Evolution Tiers</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-white/60">Novice (0-9 days) - Rank E</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-white/60">Experienced (10-29) - Rank B</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-400"></div>
              <span className="text-white/60">Veteran (30-65) - Rank A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse"></div>
              <span className="text-white/60">Monarch (66+) - Rank S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitEnhancementsDemo;
