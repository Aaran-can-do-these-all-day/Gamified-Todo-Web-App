import { useState, useEffect, useMemo, useCallback } from 'react'
import { getHabits, toggleHabitDate } from '../api/habits'
import { isSupabaseReady } from '../api/supabase'
import { usePlayer } from '../context/PlayerContext'

function toUiHabit(habit) {
  if (!habit) return habit

  const heatmapSet = new Set(habit.heatmap ?? [])

  return {
    ...habit,
    heatmapSet,
    isDateCompleted: (date) => heatmapSet.has(date),
  }
}

export default function useHabits({ autoRefresh = true, playerId: overridePlayerId } = {}) {
  const { player } = usePlayer()
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const playerId = overridePlayerId ?? player?.id

  const refresh = useCallback(async () => {
    if (!playerId) {
      setHabits([])
      setLoading(false)
      return
    }

    if (!isSupabaseReady) {
      setError(new Error('Supabase is not configured. Add credentials to enable habits.'))
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getHabits(playerId)
      setHabits(data.map(toUiHabit))
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [playerId])

  const toggleDate = useCallback(async (habitId, date) => {
    if (!habitId || !date) {
      throw new Error('habitId and date are required to toggle habit progress.')
    }
    if (!isSupabaseReady) {
      throw new Error('Supabase is not configured. Cannot toggle habit progress.')
    }

    const updatedHabit = toUiHabit(await toggleHabitDate(habitId, date))
    setHabits(prev => prev.map(habit => (habit.id === habitId ? updatedHabit : habit)))
    return updatedHabit
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      refresh()
    } else {
      setLoading(false)
    }
  }, [autoRefresh, refresh])

  return useMemo(() => ({
    habits,
    loading,
    error,
    refresh,
    toggleDate,
    isSupabaseReady,
    supabaseReady: isSupabaseReady,
  }), [habits, loading, error, refresh, toggleDate])
}
