// Solo Leveling System - Level & Color Tier Progression

export const PLAYER_LEVEL_BANDS = {
  MIN: 1,
  MAX: 100,
};

export const COLOR_TIERS = [
  {
    id: 1,
    name: "Gray",
    minLevel: 1,
    maxLevel: 10,
    color: "#6b7280",
    glow: "rgba(107, 114, 128, 0.4)",
    description: "Rising from the Ashes",
  },
  {
    id: 2,
    name: "Bronze",
    minLevel: 11,
    maxLevel: 20,
    color: "#d97706",
    glow: "rgba(217, 119, 6, 0.4)",
    description: "Forged in Fire",
  },
  {
    id: 3,
    name: "Silver",
    minLevel: 21,
    maxLevel: 30,
    color: "#94a3b8",
    glow: "rgba(148, 163, 184, 0.4)",
    description: "Sharpened Edge",
  },
  {
    id: 4,
    name: "Gold",
    minLevel: 31,
    maxLevel: 40,
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.5)",
    description: "Radiant Path",
  },
  {
    id: 5,
    name: "Emerald",
    minLevel: 41,
    maxLevel: 50,
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.5)",
    description: "Verdant Mastery",
  },
  {
    id: 6,
    name: "Sapphire",
    minLevel: 51,
    maxLevel: 60,
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.5)",
    description: "Crystal Resolve",
  },
  {
    id: 7,
    name: "Amethyst",
    minLevel: 61,
    maxLevel: 70,
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.6)",
    description: "Arcane Awakening",
  },
  {
    id: 8,
    name: "Ruby",
    minLevel: 71,
    maxLevel: 80,
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.6)",
    description: "Crimson Monarch",
  },
  {
    id: 9,
    name: "Obsidian",
    minLevel: 81,
    maxLevel: 90,
    color: "#1e1e1e",
    glow: "rgba(139, 92, 246, 0.7)",
    description: "Shadow Sovereign",
  },
  {
    id: 10,
    name: "Prismatic",
    minLevel: 91,
    maxLevel: 100,
    color: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.8)",
    description: "Eternal Legend",
  },
];

export const VISION_LEVEL_BANDS = {
  MIN: 1,
  MAX: 10,
};

export const VISION_COLOR_TIERS = [
  {
    id: 1,
    name: "Dormant",
    minLevel: 1,
    maxLevel: 2,
    color: "#6b7280",
    glow: "rgba(107, 114, 128, 0.3)",
  },
  {
    id: 2,
    name: "Awakened",
    minLevel: 3,
    maxLevel: 4,
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  {
    id: 3,
    name: "Refined",
    minLevel: 5,
    maxLevel: 6,
    color: "#a855f7",
    glow: "rgba(168, 85, 247, 0.5)",
  },
  {
    id: 4,
    name: "Radiant",
    minLevel: 7,
    maxLevel: 8,
    color: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.6)",
  },
  {
    id: 5,
    name: "Transcendent",
    minLevel: 9,
    maxLevel: 10,
    color: "#ec4899",
    glow: "rgba(236, 72, 153, 0.7)",
  },
];

export const CATEGORY_TYPES = [
  { id: "discipline", label: "Discipline", icon: "⚡", color: "#3b82f6" },
  { id: "health", label: "Health", icon: "💪", color: "#10b981" },
  { id: "focus", label: "Focus / Execution", icon: "🎯", color: "#a855f7" },
  { id: "learning", label: "Learning / Skill", icon: "📚", color: "#f59e0b" },
  { id: "hard", label: "Hard Tasks", icon: "🔥", color: "#ef4444" },
  { id: "general", label: "General", icon: "📋", color: "#6b7280" },
  { id: "social", label: "Social / Mindfulness", icon: "🌸", color: "#ec4899" },
  { id: "leadership", label: "Leadership", icon: "👑", color: "#8b5cf6" },
];

export function getColorTierForLevel(level) {
  if (level < PLAYER_LEVEL_BANDS.MIN) return COLOR_TIERS[0];
  if (level > PLAYER_LEVEL_BANDS.MAX) return COLOR_TIERS[COLOR_TIERS.length - 1];

  const tier = COLOR_TIERS.find(
    (t) => level >= t.minLevel && level <= t.maxLevel
  );
  return tier || COLOR_TIERS[0];
}

export function getVisionColorTierForLevel(level) {
  if (level < VISION_LEVEL_BANDS.MIN) return VISION_COLOR_TIERS[0];
  if (level > VISION_LEVEL_BANDS.MAX)
    return VISION_COLOR_TIERS[VISION_COLOR_TIERS.length - 1];

  const tier = VISION_COLOR_TIERS.find(
    (t) => level >= t.minLevel && level <= t.maxLevel
  );
  return tier || VISION_COLOR_TIERS[0];
}

export function calculateBoostValue(level) {
  // Conceptual power rating: 1.0 → 3.0 scaling
  const base = 1.0;
  const increment = 0.2;
  return +(base + (level - 1) * increment).toFixed(2);
}
