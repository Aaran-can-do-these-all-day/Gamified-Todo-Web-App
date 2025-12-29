import { useState, useEffect, useCallback, useMemo } from 'react'
import { isSupabaseReady } from '../api/supabase'
import {
  getPlayer,
  updatePlayer,
  adjustPlayerResources,
  updatePlayerAttributes,
} from '../api/players'
import { usePlayer } from '../context/PlayerContext'

/**
 * Hook that keeps a Supabase-backed player record in sync with the local PlayerContext.
 * When Supabase credentials are missing, it transparently falls back to the context state.
 */
export default function usePlayerData({ playerId: overridePlayerId, autoSyncContext = true } = {}) {
  const context = usePlayer()
  const contextPlayer = context?.player
  const effectivePlayerId = overridePlayerId ?? contextPlayer?.id ?? null

  const [player, setPlayer] = useState(contextPlayer || null)
  const [loading, setLoading] = useState(Boolean(isSupabaseReady && effectivePlayerId))
  const [error, setError] = useState(null)

  const fetchPlayer = useCallback(async () => {
    if (!effectivePlayerId) {
      setPlayer(contextPlayer || null)
      setLoading(false)
      return
    }

    if (!isSupabaseReady) {
      setPlayer(contextPlayer || null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const remotePlayer = await getPlayer(effectivePlayerId)
      setPlayer(remotePlayer)
      if (autoSyncContext && context?.setPlayer) {
        context.setPlayer(remotePlayer)
      }
      setError(null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [effectivePlayerId, contextPlayer, autoSyncContext, context])

  const refresh = useCallback(() => fetchPlayer(), [fetchPlayer])

  const applyUpdate = useCallback(
    (updater) => {
      setPlayer((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        if (autoSyncContext && context?.setPlayer && next) {
          context.setPlayer(next)
        }
        return next
      })
    },
    [autoSyncContext, context],
  )

  const savePlayer = useCallback(
    async (updates) => {
      if (!effectivePlayerId) {
        throw new Error('playerId is required to update player data.')
      }
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured. Cannot update player data.')
      }

      const updated = await updatePlayer(effectivePlayerId, updates)
      applyUpdate(updated)
      return updated
    },
    [effectivePlayerId, applyUpdate],
  )

  const updateAttributes = useCallback(
    async (attributes) => {
      if (!effectivePlayerId) {
        throw new Error('playerId is required to update attributes.')
      }
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured. Cannot update attributes.')
      }

      const updated = await updatePlayerAttributes(effectivePlayerId, attributes)
      applyUpdate(updated)
      return updated
    },
    [effectivePlayerId, applyUpdate],
  )

  const updateResources = useCallback(
    async ({ xpDelta = 0, goldDelta = 0, streakDelta = 0 } = {}) => {
      if (!effectivePlayerId) {
        throw new Error('playerId is required to adjust resources.')
      }
      if (!isSupabaseReady) {
        throw new Error('Supabase is not configured. Cannot adjust resources.')
      }

      const updated = await adjustPlayerResources(effectivePlayerId, {
        xpDelta,
        goldDelta,
        streakDelta,
      })
      applyUpdate(updated)
      return updated
    },
    [effectivePlayerId, applyUpdate],
  )

  useEffect(() => {
    fetchPlayer()
  }, [fetchPlayer])

  useEffect(() => {
    if (!isSupabaseReady) {
      setPlayer(contextPlayer || null)
    }
  }, [contextPlayer])

  const state = useMemo(
    () => ({
      player,
      loading,
      error,
      refresh,
      savePlayer,
      updateAttributes,
      updateResources,
      isSupabaseReady,
      supabaseReady: isSupabaseReady,
    }),
    [player, loading, error, refresh, savePlayer, updateAttributes, updateResources],
  )

  return state
}
