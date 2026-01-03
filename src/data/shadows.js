// Solo Leveling System - 12-Shadow Roster

export const SHADOW_ROSTER = [
  {
    id: "igris",
    name: "Igris",
    title: "Knight Commander",
    icon: "⚔️",
    class: "Knight",
    requirement: {
      streakDays: 7,
      category: "discipline",
    },
    buff: {
      name: "Critical Strike",
      description: "Occasional XP spikes on task completion",
      effect: "critical_xp_chance",
    },
    theme: "Precision, discipline, mastery",
    loyalty: 100,
    rarity: "Legendary",
    color: "#3b82f6",
  },
  {
    id: "tank",
    name: "Tank",
    title: "Ice Bear",
    icon: "🐻",
    class: "Tank",
    requirement: {
      streakDays: 3,
      category: "health",
    },
    buff: {
      name: "Glacial Defense",
      description: "Reduces XP penalties for missed tasks",
      effect: "defense_penalty_reduction",
    },
    theme: "Protection, resilience",
    loyalty: 95,
    rarity: "Rare",
    color: "#06b6d4",
  },
  {
    id: "iron",
    name: "Iron",
    title: "Soldier",
    icon: "🛡️",
    class: "Soldier",
    requirement: {
      streakDays: 5,
      category: "general",
    },
    buff: {
      name: "Steady March",
      description: "Passive gold gain increase",
      effect: "gold_passive_boost",
    },
    theme: "Loyalty, reliability",
    loyalty: 90,
    rarity: "Common",
    color: "#6b7280",
  },
  {
    id: "tusk",
    name: "Tusk",
    title: "High Orc Shaman",
    icon: "🔮",
    class: "Shaman",
    requirement: {
      streakDays: 14,
      category: "general",
    },
    buff: {
      name: "Arcane Growth",
      description: "XP boost effect",
      effect: "xp_multiplier",
    },
    theme: "Wisdom, growth",
    loyalty: 88,
    rarity: "Epic",
    color: "#8b5cf6",
  },
  {
    id: "beru",
    name: "Beru",
    title: "Royal Guard",
    icon: "👹",
    class: "Elite",
    requirement: {
      streakDays: 30,
      category: "hard",
    },
    buff: {
      name: "Gluttony",
      description: "Missed tasks still give partial XP",
      effect: "partial_xp_on_failure",
    },
    theme: "Domination, elite mastery",
    loyalty: 100,
    rarity: "Mythic",
    color: "#dc2626",
  },
  {
    id: "greed",
    name: "Greed",
    title: "Assassin",
    icon: "🗡️",
    class: "Assassin",
    requirement: {
      streakDays: 10,
      category: "focus",
    },
    buff: {
      name: "Shadow Step",
      description: "Reduced penalty for procrastination & delays",
      effect: "delay_penalty_reduction",
    },
    theme: "Sharpness, precision",
    loyalty: 85,
    rarity: "Epic",
    color: "#a855f7",
  },
  {
    id: "bellion",
    name: "Bellion",
    title: "Grand Marshal",
    icon: "👑",
    class: "Marshal",
    requirement: {
      streakDays: 45,
      category: "leadership",
    },
    buff: {
      name: "Authority",
      description: "Enhances all other Shadow buffs by 20%",
      effect: "shadow_buff_amplifier",
    },
    theme: "Command, hierarchy",
    loyalty: 100,
    rarity: "Mythic",
    color: "#fbbf24",
  },
  {
    id: "kaiser",
    name: "Kaiser",
    title: "Dragon Beast",
    icon: "🐲",
    class: "Beast",
    requirement: {
      streakDays: 35,
      category: "hard",
    },
    buff: {
      name: "Dragon Rage",
      description: "Temporary XP surges after difficult tasks",
      effect: "surge_after_hard_task",
    },
    theme: "Momentum, power",
    loyalty: 92,
    rarity: "Legendary",
    color: "#ef4444",
  },
  {
    id: "kamish",
    name: "Kamish",
    title: "Legendary Dragon",
    icon: "🔥",
    class: "Dragon",
    requirement: {
      streakDays: 7,
      category: "general",
      special: "perfect_week",
    },
    buff: {
      name: "Legendary Burst",
      description: "One-time massive XP burst (disappears after use)",
      effect: "one_time_xp_burst",
    },
    theme: "Legendary raid victory",
    loyalty: 100,
    rarity: "Legendary",
    color: "#f59e0b",
    temporary: true,
  },
  {
    id: "igle",
    name: "Igle",
    title: "Ice Elf Assassin",
    icon: "❄️",
    class: "Assassin",
    requirement: {
      streakDays: 6,
      category: "social",
    },
    buff: {
      name: "Frost Focus",
      description: "Extra XP for high-quality task completion",
      effect: "quality_xp_bonus",
    },
    theme: "Calm, emotional clarity",
    loyalty: 87,
    rarity: "Rare",
    color: "#06b6d4",
  },
  {
    id: "jima",
    name: "Jima",
    title: "Knight",
    icon: "🛡️",
    class: "Knight",
    requirement: {
      streakDays: 4,
      category: "general",
    },
    buff: {
      name: "Stalwart Guard",
      description: "Reduced gold penalties for skipped tasks",
      effect: "gold_penalty_reduction",
    },
    theme: "Support, reliability",
    loyalty: 80,
    rarity: "Common",
    color: "#64748b",
  },
  {
    id: "kiri",
    name: "Kiri",
    title: "Mage",
    icon: "✨",
    class: "Mage",
    requirement: {
      streakDays: 8,
      category: "learning",
    },
    buff: {
      name: "Arcane Wisdom",
      description: "Extra XP for educational tasks",
      effect: "learning_xp_boost",
    },
    theme: "Knowledge, improvement",
    loyalty: 83,
    rarity: "Rare",
    color: "#8b5cf6",
  },
];

export const MAX_EQUIPPED_SHADOWS = 2;

export function getShadowById(id) {
  return SHADOW_ROSTER.find((shadow) => shadow.id === id);
}

export function getShadowsByCategory(category) {
  return SHADOW_ROSTER.filter(
    (shadow) => shadow.requirement.category === category
  );
}

export function checkShadowUnlock(shadow, categoryStreaks) {
  const { category, streakDays, special } = shadow.requirement;
  const currentStreak = categoryStreaks[category] || 0;

  if (special === "perfect_week") {
    // Custom logic for Kamish: requires 7/7 perfect week
    return false; // Implement perfect week check separately
  }

  return currentStreak >= streakDays;
}

export function getUnlockedShadows(categoryStreaks) {
  return SHADOW_ROSTER.filter((shadow) =>
    checkShadowUnlock(shadow, categoryStreaks)
  );
}
