/**
 * Utility functions to track task completion counts per date
 * Similar to GitHub contribution graph
 */

const STORAGE_KEY = 'soloLeveling.taskCounts'

/**
 * Get today's date in ISO format (YYYY-MM-DD)
 */
export const getTodayISO = () => {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get task counts from localStorage
 * @returns {Object} Object with dates as keys and counts as values
 */
export const getTaskCounts = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to load task counts:', error)
    return {}
  }
}

/**
 * Save task counts to localStorage
 * @param {Object} counts - Object with dates as keys and counts as values
 */
export const saveTaskCounts = (counts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts))
  } catch (error) {
    console.error('Failed to save task counts:', error)
  }
}

/**
 * Increment task count for a specific date
 * @param {string} date - Date in ISO format (YYYY-MM-DD)
 * @param {number} increment - Number to increment by (default: 1)
 * @returns {Object} Updated task counts
 */
export const incrementTaskCount = (date = getTodayISO(), increment = 1) => {
  const counts = getTaskCounts()
  counts[date] = (counts[date] || 0) + increment
  saveTaskCounts(counts)
  return counts
}

/**
 * Get task count for a specific date
 * @param {string} date - Date in ISO format (YYYY-MM-DD)
 * @returns {number} Task count for the date
 */
export const getTaskCountForDate = (date) => {
  const counts = getTaskCounts()
  return counts[date] || 0
}

/**
 * Get task counts for a date range
 * @param {number} days - Number of days to look back
 * @returns {Object} Object with dates as keys and counts as values
 */
export const getTaskCountsForRange = (days = 84) => {
  const counts = getTaskCounts()
  const result = {}
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    if (counts[dateStr]) {
      result[dateStr] = counts[dateStr]
    }
  }
  
  return result
}

/**
 * Clear old task counts (older than specified days)
 * @param {number} daysToKeep - Number of days of history to keep (default: 365)
 */
export const cleanupOldTaskCounts = (daysToKeep = 365) => {
  const counts = getTaskCounts()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)
  const cutoffStr = cutoffDate.toISOString().split('T')[0]
  
  const cleaned = {}
  Object.keys(counts).forEach(date => {
    if (date >= cutoffStr) {
      cleaned[date] = counts[date]
    }
  })
  
  saveTaskCounts(cleaned)
  return cleaned
}

/**
 * Get statistics for task counts
 * @param {number} days - Number of days to analyze
 * @returns {Object} Statistics object
 */
export const getTaskCountStats = (days = 84) => {
  const counts = getTaskCountsForRange(days)
  const values = Object.values(counts)
  
  if (values.length === 0) {
    return {
      total: 0,
      average: 0,
      max: 0,
      activeDays: 0,
      currentStreak: 0
    }
  }
  
  const total = values.reduce((sum, count) => sum + count, 0)
  const max = Math.max(...values)
  const activeDays = Object.keys(counts).length
  
  // Calculate current streak
  let currentStreak = 0
  const today = new Date()
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    if (counts[dateStr] && counts[dateStr] > 0) {
      currentStreak++
    } else if (i > 0) {
      // Allow today to be 0 without breaking streak
      break
    }
  }
  
  return {
    total,
    average: total / activeDays,
    max,
    activeDays,
    currentStreak
  }
}

/**
 * Reset all task counts (use with caution)
 */
export const resetTaskCounts = () => {
  saveTaskCounts({})
}
