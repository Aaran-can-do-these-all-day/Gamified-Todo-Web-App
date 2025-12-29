import { requireSupabaseClient, handleSupabaseError } from "./supabase";

const TABLE = "visions";
const VISION_FIELDS = [
  "id",
  "player_id",
  "type",
  "question_id",
  "answer",
  "created_at",
  "updated_at",
];

export const VISION_TYPES = Object.freeze({
  VISION: "vision",
  ANTI_VISION: "anti-vision",
});

const VALID_TYPES = new Set(Object.values(VISION_TYPES));

function assertVisionType(type) {
  if (!VALID_TYPES.has(type)) {
    throw new Error("Invalid vision type. Expected 'vision' or 'anti-vision'.");
  }
}

function normalizeQuestionId(questionId) {
  const numericId = Number(questionId);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("questionId must be a positive integer.");
  }
  return numericId;
}

function mapVisionRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    playerId: row.player_id,
    type: row.type,
    questionId: row.question_id,
    answer: row.answer ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowsToAnswerMap(rows = []) {
  return rows.reduce((acc, row) => {
    if (!row) return acc;
    acc[row.questionId] = row.answer ?? "";
    return acc;
  }, {});
}

export async function getVisionEntries(playerId, type) {
  if (!playerId) {
    throw new Error("playerId is required to load visions.");
  }
  assertVisionType(type);

  const client = requireSupabaseClient("load vision entries");
  const { data, error } = await client
    .from(TABLE)
    .select(VISION_FIELDS.join(","))
    .eq("player_id", playerId)
    .eq("type", type)
    .order("question_id", { ascending: true });

  if (error) {
    throw handleSupabaseError("load vision entries", error);
  }

  return (data ?? []).map(mapVisionRow);
}

export async function getVisionAnswers(playerId, type) {
  const rows = await getVisionEntries(playerId, type);
  return rowsToAnswerMap(rows);
}

export async function getAllVisionAnswers(playerId) {
  if (!playerId) {
    throw new Error("playerId is required to load visions.");
  }

  const client = requireSupabaseClient("load vision entries");
  const { data, error } = await client
    .from(TABLE)
    .select(VISION_FIELDS.join(","))
    .eq("player_id", playerId)
    .order("question_id", { ascending: true });

  if (error) {
    throw handleSupabaseError("load vision entries", error);
  }

  const rows = (data ?? []).map(mapVisionRow);
  const base = {
    [VISION_TYPES.VISION]: {},
    [VISION_TYPES.ANTI_VISION]: {},
  };

  return rows.reduce((acc, row) => {
    if (!row) return acc;
    if (!acc[row.type]) {
      acc[row.type] = {};
    }
    acc[row.type][row.questionId] = row.answer ?? "";
    return acc;
  }, base);
}

export async function upsertVisionAnswers(playerId, type, answers) {
  if (!playerId) {
    throw new Error("playerId is required to save visions.");
  }
  assertVisionType(type);

  if (!answers || typeof answers !== "object") {
    throw new Error("answers must be an object keyed by questionId.");
  }

  const payload = Object.entries(answers)
    .map(([questionId, answer]) => ({
      player_id: playerId,
      type,
      question_id: normalizeQuestionId(questionId),
      answer: (answer ?? "").toString(),
      updated_at: new Date().toISOString(),
    }))
    .filter((row) => typeof row.answer === "string");

  if (payload.length === 0) {
    return [];
  }

  const client = requireSupabaseClient("save vision answers");
  const { data, error } = await client
    .from(TABLE)
    .upsert(payload, { onConflict: "player_id,type,question_id" })
    .select(VISION_FIELDS.join(","))
    .order("question_id", { ascending: true });

  if (error) {
    throw handleSupabaseError("save vision answers", error);
  }

  return (data ?? []).map(mapVisionRow);
}

export async function deleteVisionAnswer(playerId, type, questionId) {
  if (!playerId) {
    throw new Error("playerId is required to delete vision entries.");
  }
  assertVisionType(type);
  const normalizedId = normalizeQuestionId(questionId);

  const client = requireSupabaseClient("delete vision answer");
  const { error } = await client
    .from(TABLE)
    .delete()
    .eq("player_id", playerId)
    .eq("type", type)
    .eq("question_id", normalizedId);

  if (error) {
    throw handleSupabaseError("delete vision answer", error);
  }

  return true;
}

export function createEmptyVisionState() {
  return {
    [VISION_TYPES.VISION]: {},
    [VISION_TYPES.ANTI_VISION]: {},
  };
}

export { mapVisionRow };
