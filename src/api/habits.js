import { requireSupabaseClient, handleSupabaseError } from "./supabase";

const HABIT_FIELDS = [
  "id",
  "player_id",
  "title",
  "icon",
  "color",
  "xp_per_day",
  "gold_per_day",
  "heatmap",
  "created_at",
  "updated_at",
];

function mapHabitRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    playerId: row.player_id,
    title: row.title,
    icon: row.icon,
    color: row.color,
    xpPerDay: row.xp_per_day,
    goldPerDay: row.gold_per_day,
    heatmap: row.heatmap ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeHabitDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date provided. Use a valid ISO string or Date instance.");
  }

  return date.toISOString().split("T")[0];
}

export async function getHabits(playerId) {
  if (!playerId) {
    throw new Error("playerId is required to load habits.");
  }

  const client = requireSupabaseClient("load habits");
  const { data, error } = await client
    .from("habits")
    .select(HABIT_FIELDS.join(","))
    .eq("player_id", playerId)
    .order("created_at", { ascending: true });

  if (error) {
    throw handleSupabaseError("load habits", error);
  }

  return (data ?? []).map(mapHabitRow);
}

export async function toggleHabitDate(habitId, dateToToggle) {
  if (!habitId) {
    throw new Error("habitId is required to update a habit.");
  }
  if (!dateToToggle) {
    throw new Error("A date is required to toggle habit progress.");
  }

  const client = requireSupabaseClient("toggle habit date");
  const targetDate = normalizeHabitDate(dateToToggle);

  const { data: existingHabit, error: fetchError } = await client
    .from("habits")
    .select(["heatmap", ...HABIT_FIELDS].join(","))
    .eq("id", habitId)
    .single();

  if (fetchError) {
    throw handleSupabaseError("load habit", fetchError);
  }

  const currentHeatmap = Array.isArray(existingHabit.heatmap)
    ? existingHabit.heatmap
    : [];

  const dateSet = new Set(currentHeatmap);
  if (dateSet.has(targetDate)) {
    dateSet.delete(targetDate);
  } else {
    dateSet.add(targetDate);
  }

  const nextHeatmap = Array.from(dateSet).sort();

  const { data: updatedHabit, error: updateError } = await client
    .from("habits")
    .update({ heatmap: nextHeatmap })
    .eq("id", habitId)
    .select(HABIT_FIELDS.join(","))
    .single();

  if (updateError) {
    throw handleSupabaseError("update habit heatmap", updateError);
  }

  return mapHabitRow(updatedHabit);
}
