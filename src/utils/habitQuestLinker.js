import { clamp, rollEventForHabit, rollTimeBasedEvent, uid as eventUid } from "./unpredictabilityEngine";
import { uid as questUid } from "../stores/questStore.jsx";

const uniqueTags = (...groups) => {
  const flat = groups
    .flat()
    .filter(Boolean)
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0);
  return Array.from(new Set(flat)).slice(0, 12);
};

const difficultyFromHabit = (habit) => {
  const streak = habit?.streak || 0;
  if (streak >= 14) return "S-Rank";
  if (streak >= 7) return "Hard";
  if (streak >= 3) return "Normal";
  return "Easy";
};

export const buildQuestFromHabit = (habit, options = {}) => {
  const base = options.baseQuest || {};
  const nowIso = new Date().toISOString();
  const multiplier = clamp(habit?.streakMultiplier ?? 1, 0.5, 5);
  const xpSeed = base.xp ?? habit?.rewardXP ?? 5;
  const xp = Math.max(1, Math.round(xpSeed * multiplier));
  const creditsSeed = typeof base.credits === "number" ? base.credits : Math.round(xp * 0.4);
  const credits = clamp(creditsSeed, 0, 9999);

  return {
    id: options.id || questUid(),
    title: base.title || `Quest: ${habit?.name || "Habit"}`,
    description:
      base.description ||
      `Advance the habit ${habit?.name || ""}${options.reason ? ` (${options.reason})` : ""}`.trim(),
    category: habit?.category || base.category || "General",
    difficulty: base.difficulty || difficultyFromHabit(habit),
    credits,
    xp,
    status: options.status || "Not Started",
    tags: uniqueTags(base.tags || [], habit?.tags || [], options.extraTags || []),
    createdFromHabitId: habit?.id,
    progress: 0,
    createdAt: base.createdAt || nowIso,
    coverUrl: base.coverUrl,
  };
};

const describeEvent = (event, habit) => {
  if (!event) return "No event";
  if (event.type === "chaos_quest") return "Chaos quest spawned";
  if (event.type === "micro_reward") return `Micro reward: ${event.reward?.label || "+XP"}`;
  if (event.type === "shadow_warning") return event.message || "Shadow warning";
  if (event.type === "pattern_break") return event.message || "Pattern breaker";
  return habit?.name ? `Noted ${habit.name}` : "Event logged";
};

export const linkHabitToQuest = (habit, context = {}) => {
  const timeEvent = rollTimeBasedEvent(context.now || new Date());
  const randomEvent = rollEventForHabit(habit, {
    streak: habit?.streak || 0,
    missedCountLast7: context.missedCountLast7 || 0,
    daysRemaining: habit?.daysRemaining ?? 0,
  });
  const pickedEvent = randomEvent || timeEvent;

  if (!pickedEvent) {
    return {
      event: null,
      quest: null,
    };
  }

  const baseLog = {
    id: eventUid(),
    type: pickedEvent.type || "unknown",
    timestamp: (context.now || new Date()).toISOString(),
    habitId: habit?.id,
    message: describeEvent(pickedEvent, habit),
    reward: pickedEvent.reward,
  };

  if (pickedEvent.type === "chaos_quest") {
    const quest = buildQuestFromHabit(habit, {
      baseQuest: pickedEvent.quest,
      reason: "chaos",
      extraTags: ["chaos", "auto"],
    });
    return { event: baseLog, quest };
  }

  if (pickedEvent.type === "micro_reward") {
    return { event: baseLog, quest: null };
  }

  if (pickedEvent.type === "shadow_warning" || pickedEvent.type === "pattern_break") {
    return { event: baseLog, quest: null };
  }

  return { event: baseLog, quest: null };
};

export default {
  buildQuestFromHabit,
  linkHabitToQuest,
};
