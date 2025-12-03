import { requireSupabaseClient, handleSupabaseError } from "./supabase";

const BOSS_FIELDS = [
  "id",
  "player_id",
  "name",
  "rank",
  "xp_required",
  "reward_gold",
  "reward_item",
  "days",
  "losses",
  "system_message",
  "created_at",
  "updated_at",
];

function mapBossRow(row) {
  if (!row) return null;

  const normalizedDays = Array.isArray(row.days)
    ? row.days.map((day, index) => ({
        dayNumber: Number.isFinite(day?.dayNumber) ? day.dayNumber : index + 1,
        completed: Boolean(day?.completed),
      }))
    : [];

  return {
    id: row.id,
    playerId: row.player_id,
    name: row.name,
    rank: row.rank,
    xpRequired: row.xp_required,
    rewardGold: row.reward_gold,
    rewardItem: row.reward_item,
    days: normalizedDays,
    losses: row.losses ?? 0,
    systemMessage: row.system_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getBosses(playerId) {
  if (!playerId) {
    throw new Error("playerId is required to load bosses.");
  }

  const client = requireSupabaseClient("load bosses");
  const { data, error } = await client
    .from("bosses")
    .select(BOSS_FIELDS.join(","))
    .eq("player_id", playerId)
    .order("xp_required", { ascending: true });

  if (error) {
    throw handleSupabaseError("load bosses", error);
  }

  return (data ?? []).map(mapBossRow);
}

export async function updateBossDay(bossId, day, success) {
  if (!bossId) {
    throw new Error("bossId is required to update a boss challenge day.");
  }

  const client = requireSupabaseClient("update boss day");

  const { data: bossRow, error: fetchError } = await client
    .from("bosses")
    .select(BOSS_FIELDS.join(","))
    .eq("id", bossId)
    .single();

  if (fetchError) {
    throw handleSupabaseError("load boss", fetchError);
  }

  const targetDay = Number(day);
  const normalizedIndex = Number.isFinite(targetDay)
    ? targetDay >= 1
      ? targetDay - 1
      : 0
    : 0;

  const currentDays = Array.isArray(bossRow.days) ? [...bossRow.days] : [];
  while (currentDays.length <= normalizedIndex) {
    currentDays.push({
      dayNumber: currentDays.length + 1,
      completed: false,
    });
  }

  const previousEntry = currentDays[normalizedIndex] ?? {
    dayNumber: normalizedIndex + 1,
    completed: false,
  };

  const nextCompleted =
    typeof success === "boolean" ? success : !previousEntry.completed;

  currentDays[normalizedIndex] = {
    dayNumber: previousEntry.dayNumber ?? normalizedIndex + 1,
    completed: nextCompleted,
  };

  const { data: updatedRow, error: updateError } = await client
    .from("bosses")
    .update({ days: currentDays })
    .eq("id", bossId)
    .select(BOSS_FIELDS.join(","))
    .single();

  if (updateError) {
    throw handleSupabaseError("update boss day", updateError);
  }

  return mapBossRow(updatedRow);
}
