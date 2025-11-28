import { createContext, useContext, useState, useEffect } from 'react'

const PlayerContext = createContext()

const RANKS = [
  { name: 'E-Rank Hunter', minLevel: 1, color: '#6b7280' },
  { name: 'D-Rank Hunter', minLevel: 5, color: '#22c55e' },
  { name: 'C-Rank Hunter', minLevel: 10, color: '#3b82f6' },
  { name: 'B-Rank Hunter', minLevel: 20, color: '#a855f7' },
  { name: 'A-Rank Hunter', minLevel: 35, color: '#f59e0b' },
  { name: 'S-Rank Hunter', minLevel: 50, color: '#ef4444' },
  { name: 'National Level', minLevel: 75, color: '#ec4899' },
  { name: 'Shadow Monarch', minLevel: 100, color: '#1e1e1e' },
]

const calculateLevel = (xp) => {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}

const calculateXpForLevel = (level) => {
  return Math.pow(level - 1, 2) * 100
}

const calculateXpForNextLevel = (level) => {
  return Math.pow(level, 2) * 100
}

const getRank = (level) => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLevel) {
      return RANKS[i]
    }
  }
  return RANKS[0]
}

const initialPlayerState = {
  id: '1',
  name: 'Player',
  title: 'Rising from the Ashes',
  xp: 2780,
  gold: 5350,
  streak: 3,
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
  nextBossXp: 4000,
}

export function PlayerProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('soloLevelingPlayer')
    return saved ? JSON.parse(saved) : initialPlayerState
  })

  useEffect(() => {
    localStorage.setItem('soloLevelingPlayer', JSON.stringify(player))
  }, [player])

  const level = calculateLevel(player.xp)
  const rank = getRank(level)
  const currentLevelXp = calculateXpForLevel(level)
  const nextLevelXp = calculateXpForNextLevel(level)
  const xpProgress = ((player.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
  const xpToNextLevel = nextLevelXp - player.xp

  const addXp = (amount) => {
    setPlayer(prev => ({ ...prev, xp: prev.xp + amount }))
  }

  const addGold = (amount) => {
    setPlayer(prev => ({ ...prev, gold: prev.gold + amount }))
  }

  const spendGold = (amount) => {
    if (player.gold >= amount) {
      setPlayer(prev => ({ ...prev, gold: prev.gold - amount }))
      return true
    }
    return false
  }

  const updateStreak = (newStreak) => {
    setPlayer(prev => ({ ...prev, streak: newStreak }))
  }

  const updateAttribute = (attr, value) => {
    setPlayer(prev => ({
      ...prev,
      attributes: { ...prev.attributes, [attr]: value }
    }))
  }

  const completeTask = (xpReward, goldReward) => {
    setPlayer(prev => ({
      ...prev,
      xp: prev.xp + xpReward,
      gold: prev.gold + goldReward,
      tasksCompletedToday: prev.tasksCompletedToday + 1,
      tasksRemaining: Math.max(0, prev.tasksRemaining - 1),
    }))
  }

  const value = {
    player,
    setPlayer,
    level,
    rank,
    xpProgress,
    xpToNextLevel,
    currentLevelXp,
    nextLevelXp,
    addXp,
    addGold,
    spendGold,
    updateStreak,
    updateAttribute,
    completeTask,
    RANKS,
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}
