import { requireSupabaseClient, handleSupabaseError } from "./supabase";

const DIFFICULTY_MULTIPLIERS = {
  Easy: 1,
  Normal: 1.5,
  Hard: 2,
  "S-Rank": 3,
};

const DEFAULT_MULTIPLIER = 1;

const TASK_FIELDS = [
  "id",
  "player_id",
  "title",
  "difficulty",
  "category",
  "icon",
  "start_time",
  "end_time",
  "xp_reward",
  "gold_reward",
  "completed",
  "created_at",
];

const DEFAULT_CATEGORY = "General";

function toIsoString(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(
      "Invalid date provided. Use ISO strings or Date instances.",
    );
  }
  return date.toISOString();
}

function mapTaskRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    playerId: row.player_id,
    title: row.title,
    difficulty: row.difficulty,
    category: row.category || DEFAULT_CATEGORY,
    icon: row.icon,
    startTime: row.start_time,
    endTime: row.end_time,
    xpReward: row.xp_reward,
    goldReward: row.gold_reward,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

export function calculateRewards(
  startTime,
  endTime,
  difficulty = "Normal",
  streakMultiplier = 1,
) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Start and end times must be valid dates.");
  }

  const minutes = Math.max(1, Math.round((end - start) / 60000));
  const blocks = minutes / 30;
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] ?? DEFAULT_MULTIPLIER;

  return {
    xp: Math.round(blocks * multiplier * streakMultiplier * 100),
    gold: Math.round(blocks * multiplier * streakMultiplier * 20),
    durationMinutes: minutes,
  };
}

export async function getTasks(playerId) {
  if (!playerId) {
    throw new Error("playerId is required to load tasks.");
  }

  const client = requireSupabaseClient("load tasks");
  const { data, error } = await client
    .from("tasks")
    .select(TASK_FIELDS.join(","))
    .eq("player_id", playerId)
    .order("start_time", { ascending: true });

  if (error) {
    throw handleSupabaseError("load tasks", error);
  }

  return (data ?? []).map(mapTaskRow);
}

export async function createTask(
  playerId,
  title,
  difficulty,
  category,
  startTime,
  endTime,
  icon = null,
  streakMultiplier = 1,
) {
  if (!playerId || !title || !startTime || !endTime) {
    throw new Error("playerId, title, startTime, and endTime are required.");
  }

  const client = requireSupabaseClient("create a task");
  const { xp, gold } = calculateRewards(
    startTime,
    endTime,
    difficulty,
    streakMultiplier,
  );

  const insertPayload = {
    player_id: playerId,
    title,
    difficulty,
    category: category || DEFAULT_CATEGORY,
    icon,
    start_time: toIsoString(startTime),
    end_time: toIsoString(endTime),
    xp_reward: xp,
    gold_reward: gold,
  };

  const { data, error } = await client
    .from("tasks")
    .insert(insertPayload)
    .select(TASK_FIELDS.join(","))
    .single();

  if (error) {
    throw handleSupabaseError("create task", error);
  }

  return mapTaskRow(data);
}

export async function completeTask(taskId) {
  if (!taskId) {
    throw new Error("taskId is required to complete a task.");
  }

  const client = requireSupabaseClient("complete a task");
  const { data, error } = await client
    .from("tasks")
    .update({ completed: true })
    .eq("id", taskId)
    .select(TASK_FIELDS.join(","))
    .single();

  if (error) {
    throw handleSupabaseError("complete task", error);
  }

  return mapTaskRow(data);
}

export { DIFFICULTY_MULTIPLIERS };
