import { useMemo, useState, useEffect, useCallback } from "react";
import { NavLink } from "react-router-dom";
import TopNav from "../components/TopNav";
import {
  Home,
  Power,
  Sword,
  Target,
  Calendar,
  Settings,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import Heatmap from "../components/Heatmap";
import HabitGoalCard from "../components/HabitGoalCard";
import useHabits from "../hooks/useHabits";
import HabitModal from "../components/HabitModal";
import { getTaskCountsForRange } from "../utils/taskCountTracker";

const pageStagger = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const cardRise = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 18 },
  },
};

const generateRandomDates = (count = 50) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const randomDays = Math.floor(Math.random() * 84);
    const date = new Date(today);
    date.setDate(date.getDate() - randomDays);
    if (Math.random() > 0.3) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }
  return [...new Set(dates)];
};

// Generate task counts per date (GitHub-style intensity)
const generateTaskCounts = (dateCount = 50) => {
  const counts = {};
  const today = new Date();
  for (let i = 0; i < dateCount; i++) {
    const randomDays = Math.floor(Math.random() * 84);
    const date = new Date(today);
    date.setDate(date.getDate() - randomDays);
    const dateStr = date.toISOString().split("T")[0];
    // Random task count between 0-10, weighted towards lower numbers
    const taskCount = Math.floor(Math.random() * Math.random() * 10);
    if (taskCount > 0) {
      counts[dateStr] = (counts[dateStr] || 0) + taskCount;
    }
  }
  return counts;
};

const fallbackHabitsSeed = [
  {
    id: 1,
    title: "Touch grass",
    icon: "🌱",
    color: "green",
    data: generateRandomDates(60),
    taskCounts: generateTaskCounts(70),
    reminderTime: "07:30",
    done: true,
  },
  {
    id: 2,
    title: "Workout",
    icon: "💪",
    color: "orange",
    data: generateRandomDates(50),
    taskCounts: generateTaskCounts(60),
    reminderTime: "06:30",
    done: true,
  },
  {
    id: 3,
    title: "Read 1 page",
    icon: "📖",
    color: "blue",
    data: generateRandomDates(40),
    taskCounts: generateTaskCounts(50),
    reminderTime: "21:30",
    done: true,
  },
  {
    id: 4,
    title: "Productivity Learning",
    icon: "🧠",
    color: "purple",
    data: generateRandomDates(45),
    taskCounts: generateTaskCounts(55),
    reminderTime: "10:00",
    done: true,
  },
];

const initialGoals = [
  {
    id: 1,
    title: "Touch Grass",
    icon: "🌱",
    daysRemaining: 5,
    winXp: 30,
    loseXp: 200,
    status: "active",
  },
  {
    id: 2,
    title: "Workout",
    icon: "💪",
    daysRemaining: 11,
    winXp: 50,
    loseXp: 100,
    status: "lost",
  },
  {
    id: 3,
    title: "Read 1 Page",
    icon: "📖",
    daysRemaining: 31,
    winXp: 70,
    loseXp: 100,
    status: "active",
  },
  {
    id: 4,
    title: "Learn about Productivity",
    icon: "🧠",
    daysRemaining: 27,
    winXp: 60,
    loseXp: 150,
    status: "active",
  },
];

function StatCard({ label, value }) {
  return (
    <div className="bg-dark-700 border border-white/5 rounded-xl p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function SettingsPanel({
  onResetAll,
  onResetProgress,
  habits,
  onDelete,
  onColorChange,
  onReminderChange,
  analytics,
}) {
  return (
    <div className="space-y-3">
      <div className="bg-dark-700 border border-white/5 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Habits</p>
          <p className="text-xs text-gray-500">Edit / Delete</p>
        </div>

        <div className="space-y-2 mt-3 text-sm text-gray-300">
          {habits.map((h) => (
            <div
              key={h.id}
              className="flex flex-wrap items-center gap-2 bg-dark-600/60 border border-dark-500 rounded-lg px-3 py-2"
            >
              <span className="text-lg">{h.icon}</span>
              <span className="text-white font-semibold text-sm flex-1 min-w-[120px]">{h.title}</span>
              <select
                value={h.color}
                onChange={(e) => onColorChange(h.id, e.target.value)}
                className="bg-dark-700 border border-dark-500 rounded-lg px-2 py-1 text-xs text-gray-200"
              >
                <option value="green">Green</option>
                <option value="orange">Orange</option>
                <option value="blue">Blue</option>
                <option value="purple">Purple</option>
              </select>
              <input
                type="time"
                value={h.reminderTime || ""}
                onChange={(e) => onReminderChange(h.id, e.target.value)}
                className="bg-dark-700 border border-dark-500 rounded-lg px-2 py-1 text-xs text-gray-200"
              />
              <button
                onClick={() => onDelete(h.id)}
                className="px-2 py-1 text-xs rounded bg-red-600/80 text-white hover:bg-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-3">
          <button
            onClick={onResetProgress}
            className="px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-gray-200 text-sm hover:border-purple-500/40"
          >
            Reset progress
          </button>
          <button
            onClick={onResetAll}
            className="px-3 py-2 rounded-lg bg-red-600/80 text-white text-sm hover:bg-red-500"
          >
            Reset app
          </button>
        </div>
      </div>

      <div className="bg-dark-700 border border-white/5 rounded-xl p-4 space-y-2">
        <p className="text-sm font-semibold text-white">Backup / Restore</p>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-gray-200 text-sm hover:border-purple-500/40">
            Export JSON
          </button>
          <button className="px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-gray-200 text-sm hover:border-purple-500/40">
            Export PDF
          </button>
          <button className="px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-gray-200 text-sm hover:border-purple-500/40">
            Backup to cloud
          </button>
          <button className="px-3 py-2 rounded-lg bg-dark-600 border border-dark-500 text-gray-200 text-sm hover:border-purple-500/40">
            Restore backup
          </button>
        </div>
      </div>

      {analytics && (
        <div className="bg-dark-700 border border-white/5 rounded-xl p-4 space-y-2">
          <p className="text-sm font-semibold text-white">Analytics</p>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              Weakest: {analytics.weakest?.habit?.title || "—"} ({analytics.weakest?.total || 0})
            </p>
            <p>
              Strongest: {analytics.strongest?.habit?.title || "—"} ({analytics.strongest?.total || 0})
            </p>
            <p>
              Longest streak: {analytics.longestStreak || 0} days
              {analytics.longestStreakHabit ? ` — ${analytics.longestStreakHabit.title}` : ""}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Habits() {
  const [fallbackHabits, setFallbackHabits] = useState(fallbackHabitsSeed);
  const [goals, setGoals] = useState(initialGoals);
  const [view, setView] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [realTaskCounts, setRealTaskCounts] = useState({});
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [selectedHabitId, setSelectedHabitId] = useState("all");
  const [dailyNote, setDailyNote] = useState(() =>
    localStorage.getItem("habit.dailyNote") || "",
  );

  // Load real task counts from localStorage
  useEffect(() => {
    const counts = getTaskCountsForRange(84); // Get last 84 days
    setRealTaskCounts(counts);
  }, []);

  useEffect(() => {
    localStorage.setItem("habit.dailyNote", dailyNote);
  }, [dailyNote]);

  const {
    habits: remoteHabits,
    loading: remoteLoading,
    error: remoteError,
    toggleDate: toggleRemoteDate,
    supabaseReady,
  } = useHabits();

  const usingRemoteHabits = supabaseReady && remoteHabits.length > 0;

  const todayIso = useMemo(
    () => new Date().toISOString().split("T")[0],
    [],
  );

  const formattedHabits = useMemo(() => {
    const source = usingRemoteHabits ? remoteHabits : fallbackHabits;
    return source.map((habit) => ({
      id: habit.id,
      title: habit.title,
      icon: habit.icon ?? "🔥",
      color: habit.color ?? "green",
      data: habit.heatmap ?? habit.data ?? [],
      reminderTime: habit.reminderTime ?? "",
      // Use real task counts if available, otherwise use demo data
      taskCounts: Object.keys(realTaskCounts).length > 0 ? realTaskCounts : (habit.taskCounts ?? {}),
    }));
  }, [usingRemoteHabits, remoteHabits, fallbackHabits, realTaskCounts]);

  const getMonthCounts = useCallback(
    (counts = {}) => {
      const year = monthCursor.getFullYear();
      const month = monthCursor.getMonth();
      const filtered = {};
      Object.entries(counts).forEach(([dateStr, count]) => {
        const dt = new Date(dateStr);
        if (dt.getFullYear() === year && dt.getMonth() === month) {
          filtered[dateStr] = count;
        }
      });
      return filtered;
    },
    [monthCursor],
  );

  const calculateStreak = useCallback((datesSet) => {
    const dates = Array.from(datesSet).sort();
    let best = 0;
    let current = 0;
    let prev = null;
    dates.forEach((d) => {
      const thisDate = new Date(d);
      if (prev) {
        const diff = (thisDate - prev) / (1000 * 60 * 60 * 24);
        current = diff === 1 ? current + 1 : 1;
      } else {
        current = 1;
      }
      best = Math.max(best, current);
      prev = thisDate;
    });
    return best;
  }, []);

  const monthLabel = useMemo(
    () =>
      monthCursor.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [monthCursor],
  );

  const displayedHabits = useMemo(() => {
    if (selectedHabitId === "all") return formattedHabits;
    return formattedHabits.filter((h) => `${h.id}` === `${selectedHabitId}`);
  }, [formattedHabits, selectedHabitId]);

  const monthSummary = useMemo(() => {
    const mergedCounts = {};
    displayedHabits.forEach((habit) => {
      const filtered = getMonthCounts(habit.taskCounts || {});
      Object.entries(filtered).forEach(([dateStr, count]) => {
        mergedCounts[dateStr] = (mergedCounts[dateStr] || 0) + count;
      });
    });

    const totalTasks = Object.values(mergedCounts).reduce(
      (sum, val) => sum + val,
      0,
    );

    let bestStreak = 0;
    displayedHabits.forEach((habit) => {
      const dates = new Set(
        Object.keys(getMonthCounts(habit.taskCounts || {})),
      );
      bestStreak = Math.max(bestStreak, calculateStreak(dates));
    });

    let mostActiveDay = null;
    Object.entries(mergedCounts).forEach(([dateStr, count]) => {
      if (!mostActiveDay || count > mostActiveDay.count) {
        mostActiveDay = { date: dateStr, count };
      }
    });

    const activeDays = Object.keys(mergedCounts).length;

    return {
      totalTasks,
      bestStreak,
      mostActiveDay,
      activeDays,
      mergedCounts,
    };
  }, [displayedHabits, getMonthCounts, calculateStreak]);

  const overallAnalytics = useMemo(() => {
    if (!formattedHabits.length) return {};
    let weakest = null;
    let strongest = null;
    let longestStreak = 0;
    let longestStreakHabit = null;

    formattedHabits.forEach((habit) => {
      const total = Object.values(habit.taskCounts || {}).reduce(
        (s, v) => s + v,
        0,
      );
      const streak = calculateStreak(new Set(Object.keys(habit.taskCounts || {})));
      if (!weakest || total < weakest.total) weakest = { habit, total };
      if (!strongest || total > strongest.total) strongest = { habit, total };
      if (streak > longestStreak) {
        longestStreak = streak;
        longestStreakHabit = habit;
      }
    });

    return {
      weakest,
      strongest,
      longestStreak,
      longestStreakHabit,
    };
  }, [formattedHabits, calculateStreak]);

  const handleToggle = async (habitId, date) => {
    if (!habitId || !date) return;

    if (usingRemoteHabits) {
      await toggleRemoteDate(habitId, date);
      return;
    }

    setFallbackHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        const exists = habit.data.includes(date);
        return {
          ...habit,
          data: exists
            ? habit.data.filter((d) => d !== date)
            : [...habit.data, date],
        };
      }),
    );
  };

  const handleDeleteHabit = (habitId) => {
    if (usingRemoteHabits) return;
    setFallbackHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const handleColorChange = (habitId, color) => {
    if (usingRemoteHabits) return;
    setFallbackHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, color } : h)),
    );
  };

  const handleReminderChange = (habitId, reminderTime) => {
    if (usingRemoteHabits) return;
    setFallbackHabits((prev) =>
      prev.map((h) => (h.id === habitId ? { ...h, reminderTime } : h)),
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <TopNav />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs font-semibold tracking-[0.6em] text-white/35 uppercase">
            System Directives
          </p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(251,146,60,0.35)]">
            HABITS
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            毎日の習慣
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_25px_rgba(255,255,255,0.08)] mb-8"
          variants={pageStagger}
        >
          <motion.div variants={cardRise}>
            <NavLink
              to="/awakening"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Power className="w-4 h-4" /> Awakening
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/quests"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Sword className="w-4 h-4" /> Quests
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/gates"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Target className="w-4 h-4" /> Gates
            </NavLink>
          </motion.div>
          <motion.div variants={cardRise}>
            <NavLink
              to="/equippables"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" /> Loadout
            </NavLink>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-3 mb-4">
              {supabaseReady ? (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {remoteLoading
                      ? "Syncing latest habit data..."
                      : usingRemoteHabits
                        ? "Connected to Supabase — showing live habits."
                        : "No remote habits yet — showing local demo data."}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-300">
                    Live Sync
                  </span>
                </div>
              ) : (
                <div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                  Supabase credentials missing — displaying local demo habits
                  only.
                </div>
              )}
              {remoteError && (
                <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                  {remoteError.message}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => setView("month")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  view === "month"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                <Calendar className="w-4 h-4" /> Month
              </button>
              <button
                onClick={() => setView("agenda")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  view === "agenda"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                📋 Agenda
              </button>
              <button
                onClick={() => setView("settings")}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  view === "settings"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400"
                }`}
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-medium md:ml-auto"
              >
                <Plus className="w-4 h-4" /> New Page
              </button>
            </div>

            {view === "month" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3 items-center justify-between bg-dark-700 p-4 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setMonthCursor(
                          new Date(
                            monthCursor.getFullYear(),
                            monthCursor.getMonth() - 1,
                            1,
                          ),
                        )
                      }
                      className="px-2 py-1 rounded bg-dark-600 text-gray-300 hover:text-white"
                    >
                      ← Prev
                    </button>
                    <span className="text-white font-semibold">
                      {monthLabel}
                    </span>
                    <button
                      onClick={() =>
                        setMonthCursor(
                          new Date(
                            monthCursor.getFullYear(),
                            monthCursor.getMonth() + 1,
                            1,
                          ),
                        )
                      }
                      className="px-2 py-1 rounded bg-dark-600 text-gray-300 hover:text-white"
                    >
                      Next →
                    </button>
                  </div>

                  <select
                    value={selectedHabitId}
                    onChange={(e) => setSelectedHabitId(e.target.value)}
                    className="bg-dark-600 text-gray-200 border border-dark-500 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">Show all habits</option>
                    {formattedHabits.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <StatCard
                    label="Total completed"
                    value={monthSummary.totalTasks}
                  />
                  <StatCard
                    label="Best streak"
                    value={`${monthSummary.bestStreak || 0} days`}
                  />
                  <StatCard
                    label="Most active day"
                    value={
                      monthSummary.mostActiveDay
                        ? `${new Date(
                            monthSummary.mostActiveDay.date,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })} (${monthSummary.mostActiveDay.count})`
                        : "—"
                    }
                  />
                  <StatCard
                    label="Active days"
                    value={monthSummary.activeDays}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {displayedHabits.map((habit, index) => {
                    const counts = getMonthCounts(habit.taskCounts || {});
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Heatmap
                          title={{ text: habit.title, icon: habit.icon }}
                          data={Object.keys(counts)}
                          color={habit.color}
                          weeks={6}
                          onToggle={(date) => handleToggle(habit.id, date)}
                          taskCounts={counts}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {view === "agenda" && (
              <div className="space-y-4">
                <div className="bg-dark-700 border border-white/5 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm tracking-wide uppercase">
                      Daily Note
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      Auto-saved
                    </span>
                  </div>
                  <textarea
                    value={dailyNote}
                    onChange={(e) => setDailyNote(e.target.value)}
                    className="w-full bg-dark-600 border border-dark-500 rounded-lg p-3 text-sm text-gray-200 focus:outline-none focus:border-purple-500"
                    placeholder="Felt tired but completed workout today."
                  />
                </div>

                <div className="space-y-3">
                  {formattedHabits.map((habit, idx) => {
                    const completed = habit.data.includes(todayIso);
                    return (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                          completed
                            ? "bg-dark-700/60 border-dark-500"
                            : "bg-dark-700 border-dark-500 hover:border-purple-500/60"
                        }`}
                        onClick={() => handleToggle(habit.id, todayIso)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{habit.icon}</span>
                            <div>
                              <p className={`text-sm font-semibold ${completed ? "text-gray-400 line-through" : "text-white"}`}>
                                {habit.title}
                              </p>
                              <p className="text-[11px] text-gray-500">
                                Today {habit.reminderTime ? `• ${habit.reminderTime}` : ""}
                              </p>
                            </div>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded border ${completed ? "border-green-500/40 text-green-300" : "border-purple-500/30 text-purple-200"}`}>
                            {completed ? "Done" : "Mark"}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="space-y-3 mt-6">
                  <h4 className="text-sm font-semibold text-white">Tomorrow</h4>
                  {formattedHabits.map((habit, idx) => (
                    <motion.div
                      key={`tomorrow-${habit.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 rounded-xl border border-dark-500 bg-dark-700/40"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{habit.icon}</span>
                          <div>
                            <p className="text-sm text-white">{habit.title}</p>
                            <p className="text-[11px] text-gray-500">
                              {habit.reminderTime ? `Scheduled • ${habit.reminderTime}` : "Upcoming"}
                            </p>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-500">Tomorrow</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {view === "settings" && (
              <div className="space-y-4">
                <SettingsPanel
                  onResetAll={() => setFallbackHabits(fallbackHabitsSeed)}
                  onResetProgress={() =>
                    setFallbackHabits((prev) =>
                      prev.map((h) => ({ ...h, data: [], taskCounts: {} })),
                    )
                  }
                  habits={formattedHabits}
                  onDelete={handleDeleteHabit}
                  onColorChange={handleColorChange}
                  onReminderChange={handleReminderChange}
                  analytics={overallAnalytics}
                />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium">
                🎯 Habit Goals
              </button>
              <button className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 text-sm font-medium">
                ✅ Completed
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitGoalCard
                    habit={goal}
                    onComplete={(id) =>
                      setGoals((prev) =>
                        prev.map((g) =>
                          g.id === id ? { ...g, status: "completed" } : g,
                        ),
                      )
                    }
                    onFail={(id) =>
                      setGoals((prev) =>
                        prev.map((g) =>
                          g.id === id ? { ...g, status: "lost" } : g,
                        ),
                      )
                    }
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{ title: "Workout", icon: "💪" }}
      />

      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-900/50 flex items-center justify-center text-2xl active:scale-95 transition-transform"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Habits;
