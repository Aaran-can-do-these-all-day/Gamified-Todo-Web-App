import { requireSupabaseClient, handleSupabaseError } from './supabase'

const PLAYER_FIELDS = [
  'id',
  'name',
  'title',
  'xp',
  'gold',
  'streak',
  'tasks_completed_today',
  'tasks_remaining',
  'attributes',
  'next_boss_xp',
  'created_at',
  'updated_at',
]

const ATTRIBUTE_KEYS = ['fit', 'soc', 'int', 'dis', 'foc', 'fin']

function mapPlayerRow(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    xp: row.xp,
    gold: row.gold,
    streak: row.streak,
    tasksCompletedToday: row.tasks_completed_today,
    tasksRemaining: row.tasks_remaining,
    attributes: row.attributes ?? {},
    nextBossXp: row.next_boss_xp,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function getPlayer(playerId) {
  if (!playerId) {
    throw new Error('playerId is required to load player data.')
  }

  const client = requireSupabaseClient('load player')
  const { data, error } = await client
    .from('players')
    .select(PLAYER_FIELDS.join(','))
    .eq('id', playerId)
    .single()

  if (error) {
    throw handleSupabaseError('load player', error)
  }

  return mapPlayerRow(data)
}

export async function updatePlayer(playerId, updates = {}) {
  if (!playerId) {
    throw new Error('playerId is required to update player data.')
  }

  const allowedUpdates = extractAllowedPlayerFields(updates)

  if (Object.keys(allowedUpdates).length === 0) {
    throw new Error('No valid player fields provided for update.')
  }

  const client = requireSupabaseClient('update player')
  const { data, error } = await client
    .from('players')
    .update(allowedUpdates)
    .eq('id', playerId)
    .select(PLAYER_FIELDS.join(','))
    .single()

  if (error) {
    throw handleSupabaseError('update player', error)
  }

  return mapPlayerRow(data)
}

export async function adjustPlayerResources(
  playerId,
  { xpDelta = 0, goldDelta = 0, streakDelta = 0 } = {},
) {
  if (!playerId) {
    throw new Error('playerId is required to adjust resources.')
  }

  const client = requireSupabaseClient('adjust player resources')
  const { data: currentPlayer, error: fetchError } = await client
    .from('players')
    .select(['xp', 'gold', 'streak'])
    .eq('id', playerId)
    .single()

  if (fetchError) {
    throw handleSupabaseError('load player', fetchError)
  }

  const nextValues = {
    xp: Math.max(0, (currentPlayer?.xp ?? 0) + xpDelta),
    gold: Math.max(0, (currentPlayer?.gold ?? 0) + goldDelta),
    streak: Math.max(0, (currentPlayer?.streak ?? 0) + streakDelta),
  }

  const { data, error: updateError } = await client
    .from('players')
    .update(nextValues)
    .eq('id', playerId)
    .select(PLAYER_FIELDS.join(','))
    .single()

  if (updateError) {
    throw handleSupabaseError('adjust player resources', updateError)
  }

  return mapPlayerRow(data)
}

export async function updatePlayerAttributes(playerId, attributes = {}) {
  if (!playerId) {
    throw new Error('playerId is required to update attributes.')
  }

  const sanitizedAttributes = {}
  ATTRIBUTE_KEYS.forEach((key) => {
    if (attributes[key] !== undefined) {
      sanitizedAttributes[key] = Number(attributes[key])
    }
  })

  if (Object.keys(sanitizedAttributes).length === 0) {
    throw new Error('No valid attribute fields provided.')
  }

  const client = requireSupabaseClient('update player attributes')
  const { data, error } = await client
    .from('players')
    .update({ attributes: sanitizedAttributes })
    .eq('id', playerId)
    .select(PLAYER_FIELDS.join(','))
    .single()

  if (error) {
    throw handleSupabaseError('update player attributes', error)
  }

  return mapPlayerRow(data)
}

function extractAllowedPlayerFields(updates) {
  const allowed = {}

  if (updates.name !== undefined) allowed.name = updates.name
  if (updates.title !== undefined) allowed.title = updates.title
  if (updates.xp !== undefined) allowed.xp = Math.max(0, Number(updates.xp))
  if (updates.gold !== undefined) allowed.gold = Math.max(0, Number(updates.gold))
  if (updates.streak !== undefined) allowed.streak = Math.max(0, Number(updates.streak))
  if (updates.tasksCompletedToday !== undefined) {
    allowed.tasks_completed_today = Math.max(0, Number(updates.tasksCompletedToday))
  }
  if (updates.tasksRemaining !== undefined) {
    allowed.tasks_remaining = Math.max(0, Number(updates.tasksRemaining))
  }
  if (updates.attributes !== undefined && typeof updates.attributes === 'object') {
    allowed.attributes = updates.attributes
  }
  if (updates.nextBossXp !== undefined) {
    allowed.next_boss_xp = Math.max(0, Number(updates.nextBossXp))
  }

  return allowed
}
