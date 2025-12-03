import { createContext, useContext, useState, useEffect } from "react";
import { bosses } from "../data/bosses";

const PlayerContext = createContext();

const RANKS = [
  { name: "E-Rank Hunter", minLevel: 1, color: "#6b7280" },
  { name: "D-Rank Hunter", minLevel: 5, color: "#22c55e" },
  { name: "C-Rank Hunter", minLevel: 10, color: "#3b82f6" },
  { name: "B-Rank Hunter", minLevel: 20, color: "#a855f7" },
  { name: "A-Rank Hunter", minLevel: 35, color: "#f59e0b" },
  { name: "S-Rank Hunter", minLevel: 50, color: "#ef4444" },
  { name: "National Level", minLevel: 75, color: "#ec4899" },
  { name: "Shadow Monarch", minLevel: 100, color: "#1e1e1e" },
];

const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
};

const calculateXpForLevel = (level) => {
  return Math.pow(level - 1, 2) * 100;
};

const calculateXpForNextLevel = (level) => {
  return Math.pow(level, 2) * 100;
};

const getRank = (level) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i];
    }
  }
  return RANKS[0];
};

const initialPlayerState = {
  id: "1",
  name: "Adam",
  title: "Rising from the Ashes",
  xp: 2780,
  gold: 5350,
  streak: 3,
  lastLoginDate: new Date().toISOString().split("T")[0],
  tasksCompletedToday: 4,
  tasksRemaining: 3,
  attributes: {
    fit: 6,
    soc: 5,
    int: 7,
    dis: 4,
    foc: 6,
    fin: 3,
  },
};

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem("soloLevelingPlayer");
    return saved ? JSON.parse(saved) : initialPlayerState;
  });

  useEffect(() => {
    localStorage.setItem("soloLevelingPlayer", JSON.stringify(player));
  }, [player]);

  // Daily Login & Streak Logic
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setPlayer((prev) => {
      if (prev.lastLoginDate === today) return prev;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toISOString().split("T")[0];

      let newStreak = 1;

      if (prev.lastLoginDate === yesterdayString) {
        newStreak = prev.streak + 1;
      } else if (!prev.lastLoginDate) {
        newStreak = prev.streak || 1;
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        lastLoginDate: today,
        streak: newStreak,
        tasksCompletedToday: 0,
        tasksRemaining: 5,
      };
    });
  }, []);

  const level = calculateLevel(player.xp);
  const rank = getRank(level);
  const currentLevelXp = calculateXpForLevel(level);
  const nextLevelXp = calculateXpForNextLevel(level);
  const xpProgress =
    ((player.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  const xpToNextLevel = nextLevelXp - player.xp;

  const sortedBosses = [...bosses].sort((a, b) => a.xpRequired - b.xpRequired);
  const nextBoss =
    sortedBosses.find((b) => b.xpRequired > player.xp) ||
    sortedBosses[sortedBosses.length - 1];
  const nextBossXp = nextBoss ? nextBoss.xpRequired : 0;

  // Calculate streak multiplier: 1.0 base + 0.1 per day of streak, capped at 3.0x
  const streakMultiplier = 1 + Math.min((player.streak || 0) * 0.1, 2);

  const addXp = (amount) => {
    setPlayer((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const addGold = (amount) => {
    setPlayer((prev) => ({ ...prev, gold: prev.gold + amount }));
  };

  const spendGold = (amount) => {
    if (player.gold >= amount) {
      setPlayer((prev) => ({ ...prev, gold: prev.gold - amount }));
      return true;
    }
    return false;
  };

  const spendXP = (amount) => {
    if (player.xp >= amount) {
      setPlayer((prev) => ({ ...prev, xp: prev.xp - amount }));
      return true;
    }
    return false;
  };

  const updateStreak = (newStreak) => {
    setPlayer((prev) => ({ ...prev, streak: newStreak }));
  };

  const updateAttribute = (attr, value) => {
    setPlayer((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: value },
    }));
  };

  const completeTask = (xpReward, goldReward) => {
    setPlayer((prev) => ({
      ...prev,
      xp: prev.xp + xpReward,
      gold: prev.gold + goldReward,
      tasksCompletedToday: prev.tasksCompletedToday + 1,
      tasksRemaining: Math.max(0, prev.tasksRemaining - 1),
    }));
  };

  const applyPenalty = (xpLoss, goldLoss) => {
    setPlayer((prev) => ({
      ...prev,
      xp: Math.max(0, prev.xp - xpLoss),
      gold: Math.max(0, prev.gold - goldLoss),
    }));
  };

  const value = {
    player: { ...player, nextBossXp },
    setPlayer,
    level,
    rank,
    xpProgress,
    xpToNextLevel,
    currentLevelXp,
    nextLevelXp,
    streakMultiplier,
    addXp,
    addGold,
    spendGold,
    spendXP,
    updateStreak,
    updateAttribute,
    completeTask,
    applyPenalty,
    RANKS,
  };

  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
