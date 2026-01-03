import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getTasks,
  createTask as apiCreateTask,
  completeTask as apiCompleteTask,
} from "../api/tasks";
import { isSupabaseReady } from "../api/supabase";
import { usePlayer } from "../context/PlayerContext";

const DEFAULT_DIFFICULTY = "Normal";
const DEFAULT_CATEGORY = "General";

function normalizeTaskPayload({
  title,
  difficulty,
  category,
  startTime,
  endTime,
  icon,
  streakMultiplier,
}) {
  if (!title || !startTime || !endTime) {
    throw new Error(
      "title, startTime, and endTime are required to create a task.",
    );
  }

  return {
    title: title.trim(),
    difficulty: difficulty || DEFAULT_DIFFICULTY,
    category: category || DEFAULT_CATEGORY,
    startTime,
    endTime,
    icon: icon || null,
    streakMultiplier: streakMultiplier || 1,
  };
}

function toUiTask(task) {
  if (!task) return task;

  const startDate = task.startTime ? new Date(task.startTime) : null;
  const endDate = task.endTime ? new Date(task.endTime) : null;
  const durationMinutes =
    startDate && endDate
      ? Math.max(1, Math.round((endDate - startDate) / 60000))
      : null;

  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "";

  const startTimeLabel = startDate ? formatTime(startDate) : null;
  const endTimeLabel = endDate ? formatTime(endDate) : null;

  const now = Date.now();
  const deadlineMinutes =
    endDate != null
      ? Math.max(0, Math.round((endDate.getTime() - now) / 60000))
      : null;

  const deadlineLabel =
    typeof deadlineMinutes === "number"
      ? deadlineMinutes >= 60
        ? `${Math.ceil(deadlineMinutes / 60)} Hours`
        : `${deadlineMinutes} Minutes`
      : null;

  return {
    ...task,
    startDate,
    endDate,
    durationMinutes,
    startTimeLabel,
    endTimeLabel,
    scheduleLabel:
      startTimeLabel && endTimeLabel
        ? `${startTimeLabel} – ${endTimeLabel}`
        : null,
    deadlineMinutes,
    deadlineLabel,
  };
}

function sortByStartTime(tasks = []) {
  const toTime = (task) => {
    const date =
      task?.startDate ?? (task?.startTime ? new Date(task.startTime) : null);
    return date?.getTime() ?? 0;
  };

  return [...tasks].sort((a, b) => toTime(a) - toTime(b));
}

export function useTasks({
  autoRefresh = true,
  playerId: overridePlayerId,
} = {}) {
  const { player } = usePlayer();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const playerId = overridePlayerId ?? player?.id;

  const refresh = useCallback(async () => {
    if (!playerId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    if (!isSupabaseReady) {
      setError(
        new Error(
          "Supabase is not configured. Add your credentials to use tasks.",
        ),
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getTasks(playerId);
      const formatted = sortByStartTime(data.map(toUiTask));
      setTasks(formatted);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const createTask = useCallback(
    async (payload) => {
      if (!playerId) {
        throw new Error("A valid player is required before creating tasks.");
      }
      if (!isSupabaseReady) {
        throw new Error("Supabase is not configured. Cannot create tasks.");
      }

      const normalized = normalizeTaskPayload(payload);

      const newTask = await apiCreateTask(
        playerId,
        normalized.title,
        normalized.difficulty,
        normalized.category,
        normalized.startTime,
        normalized.endTime,
        normalized.icon,
        normalized.streakMultiplier,
      );

      const newTaskUi = toUiTask(newTask);

      setTasks((prev) => sortByStartTime([...prev, newTaskUi]));
      return newTaskUi;
    },
    [playerId],
  );

  const completeTask = useCallback(async (taskId) => {
    if (!taskId) throw new Error("taskId is required to complete a task.");
    if (!isSupabaseReady) {
      throw new Error("Supabase is not configured. Cannot complete tasks.");
    }

    const updated = toUiTask(await apiCompleteTask(taskId));
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? updated : task)),
    );
    return updated;
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [autoRefresh, refresh]);

  const state = useMemo(
    () => ({
      tasks,
      loading,
      error,
      refresh,
      createTask,
      completeTask,
      isSupabaseReady,
      supabaseReady: isSupabaseReady,
    }),
    [tasks, loading, error, refresh, createTask, completeTask, isSupabaseReady],
  );

  return state;
}

export default useTasks;
