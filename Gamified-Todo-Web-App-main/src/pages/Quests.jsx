import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import TopNav from "../components/TopNav";
import {
  Home,
  Power,
  Flame,
  Target,
  Sword,
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
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { usePlayer } from "../context/PlayerContext";
import TaskCard from "../components/TaskCard";
import PomodoroTimer from "../components/PomodoroTimer";
import HabitQuestDemo from "../components/HabitQuestDemo";
import useTasks from "../hooks/useTasks";
import { calculateRewards } from "../api/tasks";
import useScrollIndicator from "../hooks/useScrollIndicator";
import ScrollIndicator from "../components/ScrollIndicator";

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
    status: task.completed ? "Completed" : "Not Started",
    completed: Boolean(task.completed),
    streakMultiplier: task.streakMultiplierLabel ?? null,
    notes: task.notes ?? "",
    tags: Array.isArray(task.tags) ? task.tags : [],
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
  streakMultiplier: "1x",
  status: "Not Started",
  notes: "",
  tags: "",
  coverUrl: "",
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
            parseFloat(formState.streakMultiplier) || streakMultiplier,
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
        task.id === taskId
          ? { ...task, completed: true, status: "Completed" }
          : task,
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

    setFallbackTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: "Failed", completed: false } : task,
      ),
    );
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
          streakMultiplier: parseFloat(formState.streakMultiplier) || streakMultiplier,
        });
      } else {
        const { xp, gold, durationMinutes } = calculateRewards(
          startDate.toISOString(),
          endDate.toISOString(),
          formState.difficulty,
          parseFloat(formState.streakMultiplier) || streakMultiplier,
        );

        const tags = formState.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
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
          completed: formState.status === "Completed",
          status: formState.status || "Not Started",
          streakMultiplier: formState.streakMultiplier || "1x",
          notes: formState.notes?.trim() || "",
          tags,
          coverUrl: formState.coverUrl?.trim() || "",
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
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-black tracking-[0.35em] bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_14px_50px_rgba(168,85,247,0.35)]">
            QUESTS
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.5em] text-white/60">
            クエスト
          </p>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_25px_rgba(255,255,255,0.08)] mb-10"
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
              to="/habits"
              className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Flame className="w-4 h-4" /> Habits
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

            <div className="flex flex-wrap items-center gap-3 mb-6">
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
              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-auto px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> New Quest
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>

          <div>
            <PomodoroTimer />
          </div>
          <div>
            <HabitQuestDemo />
        
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
  const scrollRef = useRef(null);
  const { canScroll, atBottom } = useScrollIndicator(scrollRef);
  const localCoverUrlRef = useRef(null);
  const fileInputRef = useRef(null);
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

  const coverPreviewUrl = localCoverUrlRef.current || formState.coverUrl?.trim();

  const coverStyle = coverPreviewUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%), url(${coverPreviewUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: "linear-gradient(135deg, #0f172a 0%, #111827 50%, #0b0f1a 100%)",
      };

  const handleLocalCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (localCoverUrlRef.current) {
      URL.revokeObjectURL(localCoverUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    localCoverUrlRef.current = objectUrl;
    setFormState((prev) => ({ ...prev }));
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
        {/* Cover Image Preview */}
        <div className="relative h-48 w-full overflow-hidden" style={coverStyle}>
          <div className="h-full w-full" />
          <div className="absolute inset-0 flex items-start justify-end p-3">
            <button
              type="button"
              onClick={() => {
                const next = window.prompt("Paste cover image URL", formState.coverUrl || "");
                if (next !== null) {
                  setFormState((prev) => ({ ...prev, coverUrl: next.trim() }));
                }
              }}
              className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-black/70 border border-white/15"
            >
              Change cover
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="ml-2 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur hover:bg-black/70 border border-white/15"
            >
              Upload cover
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLocalCoverChange}
            />
          </div>
        </div>

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
        <div className="relative flex-1 overflow-y-auto p-8 scrollbar-hide" ref={scrollRef}>
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
            <div className="flex items-center min-h-9 group py-1 hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <Target size={14} />
                <span>Streak Multiplier</span>
              </div>
              <div className="flex-1">
                <select
                  value={formState.streakMultiplier}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      streakMultiplier: e.target.value,
                    }))
                  }
                  className="bg-[#232b36] text-[#facc15] px-3 py-1.5 rounded text-sm border-none focus:ring-0 cursor-pointer hover:bg-[#2c3642] transition-colors min-w-[120px]"
                >
                  <option value="1x">1x</option>
                  <option value="1.3x">1.3x</option>
                  <option value="1.5x">1.5x</option>
                  <option value="2x">2x</option>
                </select>
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

            {/* Status */}
            <div className="flex items-center min-h-9 group py-1 hover:bg-white/5 -mx-2 px-2 rounded transition-colors">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <CheckCircle2 size={14} />
                <span>Status</span>
              </div>
              <div className="flex-1">
                <select
                  value={formState.status}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="bg-[#1f2a2f] text-[#67e8f9] px-3 py-1.5 rounded text-sm border-none focus:ring-0 cursor-pointer hover:bg-[#26343b] transition-colors min-w-[150px]"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
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
              <div className="flex-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <input
                  type="text"
                  value={formState.icon}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, icon: e.target.value }))
                  }
                  placeholder="Emoji or icon"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <input
                  type="text"
                  value={formState.coverUrl}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, coverUrl: e.target.value }))
                  }
                  placeholder="Cover image URL"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex items-start group hover:bg-white/5 -mx-2 px-2 rounded transition-colors py-2">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40 mt-1">
                <MessageSquare size={14} />
                <span>Notes</span>
              </div>
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={formState.notes}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="What does success look like?"
                  className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center min-h-9 group hover:bg-white/5 -mx-2 px-2 rounded transition-colors py-2">
              <div className="w-[160px] flex items-center gap-2 text-sm text-white/40">
                <ChevronDown size={14} />
                <span>Tags (comma-separated)</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formState.tags}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="e.g., Coding, Sprint, Focus"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
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
          <ScrollIndicator visible={canScroll && !atBottom} />
        </div>
      </div>
    </div>
  );
}

export default Quests;
