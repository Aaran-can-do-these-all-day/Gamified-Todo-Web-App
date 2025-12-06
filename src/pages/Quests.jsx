import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Power,
  Flame,
  Target,
  Plus,
  RefreshCw,
  X,
  Share2,
  MessageSquare,
  Star,
  MoreHorizontal,
  Maximize2,
  Calendar,
  Paperclip,
  ChevronDown,
  CheckCircle2,
  Sigma,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext";
import TaskCard from "../components/TaskCard";
import PomodoroTimer from "../components/PomodoroTimer";
import useTasks from "../hooks/useTasks";
import { calculateRewards } from "../api/tasks";

const fallbackSeedTasks = [
  {
    id: 1,
    title: "Study Programming",
    icon: "</>",
    difficulty: "Normal",
    category: "Discipline",
    startTime: "8:45 AM",
    endTime: "10:45 AM",
    credits: 50,
    xp: 25,
    deadline: "92 Minutes",
    completed: true,
  },
  {
    id: 2,
    title: "Workout",
    icon: "💪",
    difficulty: "Easy",
    category: "Health",
    startTime: "11:15 AM",
    endTime: "12:45 PM",
    credits: 38,
    xp: 19,
    deadline: "3 Hours",
    completed: true,
  },
  {
    id: 3,
    title: "Learn JavaScript",
    icon: "💻",
    difficulty: "Normal",
    category: "Learning",
    startTime: "1:00 PM",
    endTime: "3:00 PM",
    credits: 100,
    xp: 50,
    deadline: "5 Hours",
    completed: false,
  },
  {
    id: 4,
    title: "Read Atomic Habits",
    icon: "📖",
    difficulty: "Easy",
    category: "Mindfulness",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    credits: 25,
    xp: 13,
    deadline: "6 Hours",
    completed: false,
  },
];

const FALLBACK_STORAGE_KEY = "solo-leveling-fallback-quests";

const TASK_CATEGORY_OPTIONS = [
  { value: "Discipline", label: "Discipline" },
  { value: "Health", label: "Health" },
  { value: "Focus", label: "Focus / Execution" },
  { value: "Learning", label: "Learning / Skill" },
  { value: "General", label: "General" },
  { value: "Mindfulness", label: "Social / Mindfulness" },
  { value: "Leadership", label: "Leadership" },
  { value: "High-Intensity", label: "High Intensity" },
];

const parseDateValue = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatTimeLabel = (value) => {
  const date = value instanceof Date ? value : parseDateValue(value);
  if (!date) return "—";
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

const formatDurationLabel = (minutes) => {
  if (typeof minutes !== "number" || Number.isNaN(minutes) || minutes <= 0) {
    return "—";
  }
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
};

const formatDeadlineLabel = (minutes) => {
  if (typeof minutes !== "number" || Number.isNaN(minutes) || minutes <= 0) {
    return "Today";
  }
  if (minutes >= 60) {
    const hours = Math.ceil(minutes / 60);
    return `${hours} Hour${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} Minute${minutes === 1 ? "" : "s"}`;
};

const getStoredFallbackTasks = () => {
  if (typeof window === "undefined") {
    return fallbackSeedTasks;
  }
  try {
    const raw = window.localStorage.getItem(FALLBACK_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to parse stored fallback quests", error);
  }
  return fallbackSeedTasks;
};

const mapRemoteTaskToCard = (task) => {
  const startLabel = task.startTimeLabel ?? task.scheduleLabel?.split(" – ")[0];
  const endLabel = task.endTimeLabel ?? task.scheduleLabel?.split(" – ")[1];

  return {
    id: task.id,
    title: task.title,
    icon: task.icon ?? "📋",
    difficulty: task.difficulty ?? "Normal",
    category: task.category ?? "General",
    startTime: startLabel ?? "—",
    endTime: endLabel ?? "—",
    credits: task.goldReward ?? task.credits ?? 0,
    xp: task.xpReward ?? task.xp ?? 0,
    deadline: task.deadlineLabel ?? task.deadline ?? "Today",
    completed: Boolean(task.completed),
  };
};

const mapFallbackTaskToCard = (task) => ({ ...task });

const defaultFormState = {
  title: "",
  difficulty: "Normal",
  category: TASK_CATEGORY_OPTIONS[0].value,
  start: "",
  end: "",
  icon: "",
};

function Quests() {
  const { applyPenalty, streakMultiplier } = usePlayer();
  const [fallbackTasks, setFallbackTasks] = useState(getStoredFallbackTasks);
  const [filter, setFilter] = useState("today");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState(defaultFormState);
  const [formError, setFormError] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      FALLBACK_STORAGE_KEY,
      JSON.stringify(fallbackTasks),
    );
  }, [fallbackTasks]);

  const {
    tasks: remoteTasks,
    loading: remoteLoading,
    error: remoteError,
    completeTask: completeRemoteTask,
    createTask: createRemoteTask,
    refresh: refreshRemoteTasks,
    supabaseReady,
  } = useTasks();

  const usingRemoteTasks = supabaseReady && remoteTasks.length > 0;

  const cardTasks = useMemo(() => {
    if (usingRemoteTasks) {
      return remoteTasks.map(mapRemoteTaskToCard);
    }
    return fallbackTasks.map(mapFallbackTaskToCard);
  }, [usingRemoteTasks, remoteTasks, fallbackTasks]);

  const todayTasks = useMemo(
    () => cardTasks.filter((task) => !task.completed),
    [cardTasks],
  );
  const completedTasks = useMemo(
    () => cardTasks.filter((task) => task.completed),
    [cardTasks],
  );
  const visibleTasks = filter === "today" ? todayTasks : completedTasks;

  const startDateValue = parseDateValue(formState.start);
  const endDateValue = parseDateValue(formState.end);
  const isScheduleValid =
    Boolean(startDateValue && endDateValue) && endDateValue > startDateValue;

  const rewardPreview =
    isScheduleValid && formState.difficulty
      ? (() => {
          const { xp, gold, durationMinutes } = calculateRewards(
            startDateValue.toISOString(),
            endDateValue.toISOString(),
            formState.difficulty,
            streakMultiplier,
          );
          return {
            xp,
            gold,
            durationMinutes,
            durationLabel: formatDurationLabel(durationMinutes),
            startLabel: formatTimeLabel(startDateValue),
            endLabel: formatTimeLabel(endDateValue),
          };
        })()
      : null;

  const canSubmit =
    formState.title.trim().length > 0 && isScheduleValid && !creating;

  const resetForm = () => {
    setFormState(defaultFormState);
    setFormError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleComplete = async (taskId) => {
    if (!taskId) return;

    if (usingRemoteTasks) {
      await completeRemoteTask(taskId);
      return;
    }

    setFallbackTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: true } : task,
      ),
    );
  };

  const handleFail = async (taskId) => {
    if (!taskId) return;

    const task = cardTasks.find((t) => t.id === taskId);
    if (task) {
      const penaltyXp = Math.floor((task.xp || 0) / 2);
      const penaltyGold = Math.floor((task.credits || 0) / 2);
      applyPenalty(penaltyXp, penaltyGold);
    }

    if (usingRemoteTasks) {
      await completeRemoteTask(taskId);
      return;
    }

    setFallbackTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleCreateQuest = async () => {
    const trimmedTitle = formState.title.trim();
    if (!trimmedTitle || !formState.start || !formState.end) {
      setFormError("Title, start time, and end time are required.");
      return;
    }

    const startDate = parseDateValue(formState.start);
    const endDate = parseDateValue(formState.end);

    if (!startDate || !endDate) {
      setFormError("Please provide valid start/end times.");
      return;
    }

    if (endDate <= startDate) {
      setFormError("End time must be after start time.");
      return;
    }

    setCreating(true);
    setFormError("");

    try {
      if (supabaseReady) {
        await createRemoteTask({
          title: trimmedTitle,
          difficulty: formState.difficulty,
          category: formState.category,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          icon: formState.icon?.trim() || null,
          streakMultiplier,
        });
      } else {
        const { xp, gold, durationMinutes } = calculateRewards(
          startDate.toISOString(),
          endDate.toISOString(),
          formState.difficulty,
          streakMultiplier,
        );

        const newTask = {
          id: Date.now(),
          title: trimmedTitle,
          icon: formState.icon?.trim() || "📋",
          difficulty: formState.difficulty,
          category: formState.category,
          startTime: formatTimeLabel(startDate),
          endTime: formatTimeLabel(endDate),
          credits: gold,
          xp,
          deadline: formatDeadlineLabel(durationMinutes),
          completed: false,
        };

        setFallbackTasks((prev) => [newTask, ...prev]);
      }

      closeModal();
    } catch (err) {
      setFormError(err.message || "Failed to create quest.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="h-48 bg-gradient-to-b from-purple-900/30 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-opacity%3D%22.03%22%3E%3Ccircle%20fill%3D%22%23a855f7%22%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-repeat" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-900 to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <motion.h1
          className="font-display text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Quests
        </motion.h1>

        <div className="flex flex-wrap gap-3 mb-8">
          <NavLink
            to="/"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Return Home
          </NavLink>
          <NavLink
            to="/awakening"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Power className="w-4 h-4" /> Awakening
          </NavLink>
          <NavLink
            to="/habits"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Flame className="w-4 h-4" /> Habits
          </NavLink>
          <NavLink
            to="/gates"
            className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <Target className="w-4 h-4" /> Gates
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <h2 className="text-xl font-semibold text-purple-400">Quests</h2>
            </div>

            <div className="flex flex-col gap-3 mb-4">
              {supabaseReady ? (
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {remoteLoading
                      ? "Syncing latest quests..."
                      : usingRemoteTasks
                        ? "Live Supabase quests loaded."
                        : "No remote quests yet — showing demo quests."}
                  </span>
                  <button
                    onClick={refreshRemoteTasks}
                    disabled={remoteLoading}
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs transition-colors ${
                      remoteLoading
                        ? "border-gray-600 text-gray-500"
                        : "border-purple-500/40 text-purple-300 hover:text-white"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </button>
                </div>
              ) : (
                <div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                  Supabase credentials missing — showing local demo quests.
                </div>
              )}
              {remoteError && (
                <div className="text-xs text-red-400 bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">
                  {remoteError.message}
                </div>
              )}
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter("today")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "today"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400 hover:text-white"
                }`}
              >
                📅 Today
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "completed"
                    ? "bg-purple-600 text-white"
                    : "bg-dark-700 text-gray-400 hover:text-white"
                }`}
              >
                ✅ Completed
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleTasks.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-white/12 bg-dark-800/40 px-6 py-10 text-center text-white/70">
                  <p className="text-lg font-semibold">
                    {filter === "today"
                      ? "No quests scheduled."
                      : "No completed quests yet."}
                  </p>
                  <p className="mt-2 text-sm text-white/50">
                    Use the New Quest button below to log your next mission.
                  </p>
                </div>
              )}
              {visibleTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard
                    task={task}
                    onComplete={handleComplete}
                    onFail={handleFail}
                  />
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Quest
            </button>
          </div>

          <div>
            <PomodoroTimer />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <QuestModal
          formState={formState}
          setFormState={setFormState}
          onClose={closeModal}
          onSubmit={handleCreateQuest}
          submitting={creating}
          error={formError}
          preview={rewardPreview}
          canSubmit={canSubmit}
          scheduleValid={isScheduleValid}
          modeLabel={supabaseReady ? "Supabase Sync" : "Local Demo"}
          streakMultiplier={streakMultiplier}
          categoryOptions={TASK_CATEGORY_OPTIONS}
        />
      )}
    </div>
  );
}

function QuestModal({
  formState,
  setFormState,
  onClose,
  onSubmit,
  submitting,
  error,
  preview,
  canSubmit,
  scheduleValid,
  modeLabel,
  streakMultiplier,
  categoryOptions,
}) {
  const hasScheduleInput = formState.start && formState.end;
  const showScheduleWarning = hasScheduleInput && !scheduleValid;
  const categoriesToShow =
    categoryOptions && categoryOptions.length > 0
      ? categoryOptions
      : [{ value: "General", label: "General" }];

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="w-full max-w-3xl h-[85vh] overflow-hidden rounded-xl border border-white/10 bg-[#191919] shadow-2xl flex flex-col text-[#d3d3d3]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header Actions */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Maximize2
              size={14}
              className="text-white/40 hover:text-white/80 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-4">
            {modeLabel && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                {modeLabel}
              </span>
            )}
            <span className="text-xs text-white/40 hover:text-white/80 cursor-pointer">
              Share
            </span>
            <MessageSquare
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer"
            />
            <Star
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer"
            />
            <MoreHorizontal
              size={16}
              className="text-white/40 hover:text-white/80 cursor-pointer"
            />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {/* Title Input */}
          <div className="group mb-8">
            <input
              type="text"
              value={formState.title}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Untitled"
              className="w-full bg-transparent text-4xl font-bold text-white placeholder:text-white/20 focus:outline-none"
              autoFocus
            />
          </div>

          {/* Properties List */}
          <div className="space-y-1">
            {/* Streak Multiplier */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Target size={14} />
                <span>Streak Multiplier</span>
              </div>
              <div className="flex-1 text-sm text-yellow-400 font-medium">
                {streakMultiplier ? `${streakMultiplier.toFixed(1)}x` : "1.0x"}
              </div>
            </div>

            {/* Time (Start/End Inputs) */}
            <div className="flex items-center min-h-9 group py-1 hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Sigma size={14} />
                <span>Time</span>
              </div>
              <div className="flex-1 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 rounded px-2 py-1">
                  <span className="text-xs text-white/40">From</span>
                  <input
                    type="datetime-local"
                    value={formState.start}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="bg-transparent text-sm text-purple-300 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer min-w-[160px]"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/5 rounded px-2 py-1">
                  <span className="text-xs text-white/40">To</span>
                  <input
                    type="datetime-local"
                    value={formState.end}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        end: e.target.value,
                      }))
                    }
                    className="bg-transparent text-sm text-purple-300 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 cursor-pointer min-w-[160px]"
                  />
                </div>
                {showScheduleWarning && (
                  <span className="text-xs text-red-400">
                    End time must be after start
                  </span>
                )}
              </div>
            </div>

            {/* Task's Credits */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Sigma size={14} />
                <span>Task's Credits</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="bg-[#3f2c22] text-[#dcb162] px-2 py-0.5 rounded text-sm">
                  {preview ? `${preview.gold} Credits` : "—"}
                </span>
              </div>
            </div>

            {/* Task's XP */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Sigma size={14} />
                <span>Task XP</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="bg-[#2c253f] text-[#9d8ec4] px-2 py-0.5 rounded text-sm">
                  {preview ? `${preview.xp} XP` : "—"}
                </span>
              </div>
            </div>

            {/* Completed (Status) */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <CheckCircle2 size={14} />
                <span>Status</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="bg-[#1c3829] text-[#4ade80] px-2 py-0.5 rounded text-sm flex items-center gap-1">
                  Not Started{" "}
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]"></div>
                </span>
              </div>
            </div>

            {/* Deadline (Duration) */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Sigma size={14} />
                <span>Deadline</span>
              </div>
              <div className="flex-1 flex items-center">
                <span className="text-[#dcb162] text-sm flex items-center gap-1">
                  Deadline: {preview?.durationLabel || "—"}{" "}
                  <div className="w-2 h-2 rounded-full bg-[#dcb162]"></div>
                </span>
              </div>
            </div>

            {/* Due Date (Formatted) */}
            <div className="flex items-center h-9 group">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Calendar size={14} />
                <span>Due Date</span>
              </div>
              <div className="flex-1 text-sm text-white/80">
                {preview ? (
                  <span>
                    {new Date(formState.start).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    {preview.startLabel} → {preview.endLabel}
                  </span>
                ) : (
                  "—"
                )}
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center h-9 group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Target size={14} />
                <span>Category</span>
              </div>
              <div className="flex-1">
                <select
                  value={formState.category}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="bg-[#20252f] text-[#82c4ff] px-3 py-1.5 rounded text-sm border-none focus:ring-0 cursor-pointer hover:bg-[#2c3442] transition-colors min-w-[160px]"
                >
                  {categoriesToShow.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-center h-9 group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Target size={14} />
                <span>Difficulty</span>
              </div>
              <div className="flex-1">
                <select
                  value={formState.difficulty}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      difficulty: e.target.value,
                    }))
                  }
                  className="bg-[#232b36] text-[#4d8ec4] px-3 py-1.5 rounded text-sm border-none focus:ring-0 cursor-pointer hover:bg-[#2c3642] transition-colors min-w-[120px]"
                >
                  <option value="Easy">Easy</option>
                  <option value="Normal">Normal</option>
                  <option value="Hard">Hard</option>
                  <option value="S-Rank">S-Rank</option>
                </select>
              </div>
            </div>

            {/* Files & Media */}
            <div className="flex items-center h-9 group hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Paperclip size={14} />
                <span>Files & media</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formState.icon}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="Empty"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
                />
              </div>
            </div>

            {/* More properties */}
            <div className="flex items-center h-9 group cursor-pointer hover:bg-white/5 -mx-2 px-2 rounded">
              <div className="flex items-center gap-2 text-sm text-white/40">
                <ChevronDown size={14} />
                <span>15 more properties</span>
              </div>
            </div>
          </div>

          <div className="h-px bg-white/10 my-6" />

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Comments</span>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] font-bold text-white">
                A
              </div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <div className="mt-6 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-[#191919] text-center">
          <p className="text-xs text-white/20 mb-4">
            Press Enter to continue with an empty page, or pick a template (↑↓
            to select)
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded hover:bg-white/5 text-sm text-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit || submitting}
              className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create Quest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quests;
