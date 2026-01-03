import { useState, useEffect, useMemo, useCallback } from 'react'
import { getBosses, updateBossDay } from '../api/bosses'
import { isSupabaseReady } from '../api/supabase'
import { usePlayer } from '../context/PlayerContext'

function normalizeBossDays(days = []) {
  if (!Array.isArray(days) || days.length === 0) {
    return [{ dayNumber: 1, completed: false }]
  }

  return days.map((day, index) => ({
    dayNumber: Number.isFinite(day?.dayNumber) ? day.dayNumber : index + 1,
    completed: Boolean(day?.completed),
  }))
}

function toUiBoss(boss) {
  if (!boss) return boss

  const days = normalizeBossDays(boss.days)
  const completedDays = days.filter((day) => day.completed).length
  const completionRate = days.length ? completedDays / days.length : 0

  return {
    ...boss,
    days,
    completedDays,
    completionRate,
    isUnlocked: boss.playerXp != null ? boss.playerXp >= boss.xpRequired : undefined,
    canInteract: boss.playerXp == null ? true : boss.playerXp >= boss.xpRequired,
  }
}

export default function useBosses({ autoRefresh = true, playerId: overridePlayerId } = {}) {
  const { player } = usePlayer()
  const [bosses, setBosses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const playerId = overridePlayerId ?? player?.id
  const playerXp = player?.xp ?? null

  const enrichWithPlayerXp = useCallback(
    (bossList) =>
      bossList.map((boss) =>
        toUiBoss({
          ...boss,
          playerXp,
        }),
      ),
    [playerXp],
  )

  const refresh = useCallback(async () => {
    if (!playerId) {
      setBosses([])
      setLoading(false)
      return
    }

    if (!isSupabaseReady) {
      setError(new Error('Supabase is not configured. Add credentials to enable bosses.'))
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const data = await getBosses(playerId)
      setBosses(enrichWithPlayerXp(data))
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [playerId, enrichWithPlayerXp])

  const toggleDay = useCallback(
    async (bossId, dayNumber, completed) => {
      if (!bossId) throw new Error('bossId is required to toggle a boss day.')
      if (!dayNumber) throw new Error('dayNumber is required to toggle a boss day.')
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured. Cannot update boss progress.')
      }

      const updated = toUiBoss({
        ...(await updateBossDay(bossId, dayNumber, completed)),
        playerXp,
      })

      setBosses((prev) => prev.map((boss) => (boss.id === bossId ? updated : boss)))
      return updated
    },
    [playerXp],
  )

  useEffect(() => {
    if (autoRefresh) {
      refresh()
    } else {
      setLoading(false)
    }
  }, [autoRefresh, refresh])

  useEffect(() => {
    setBosses((prev) => enrichWithPlayerXp(prev))
  }, [playerXp, enrichWithPlayerXp])

  return useMemo(
    () => ({
      bosses,
      loading,
      error,
      refresh,
      toggleDay,
      isSupabaseReady,
      supabaseReady: isSupabaseReady,
    }),
    [bosses, loading, error, refresh, toggleDay],
  )
}
