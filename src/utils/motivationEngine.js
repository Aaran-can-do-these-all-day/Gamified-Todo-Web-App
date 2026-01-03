// Logic-based motivation engine utilities (no AI, no external services)
// Exports pure functions for daily motivation, quests, reflections, scoring, and warnings.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const summarize = (text = '', maxLen = 100) => {
  if (!text) return ''
  const trimmed = text.trim()
  if (trimmed.length <= maxLen) return trimmed
  return `${trimmed.slice(0, maxLen)}...`
}

export const keywordMatch = (text = '', keywords = []) => {
  if (!text || !keywords?.length) return false
  const hay = text.toLowerCase()
  return keywords.some((kw) => hay.includes(kw.toLowerCase()))
}

export const getTodayMotivation = (antiVisionAnswers = {}, visionAnswers = {}, actionPlan = {}) => {
  const anti = Object.values(antiVisionAnswers).find(Boolean) || ''
  const vis = Object.values(visionAnswers).find(Boolean) || ''
  const action = actionPlan.do || actionPlan.action || ''
  const antiPart = anti ? `If you avoid ${anti.toLowerCase()}` : 'If you avoid your old habits'
  const visionPart = vis ? `you move toward ${vis.toLowerCase()}` : 'you move toward your ideal identity'
  const actionPart = action ? `Today your main action is: ${action}.` : 'Take one decisive action today.'
  return `${antiPart}, ${visionPart}. ${actionPart}`
}

export const generateQuests = (visionAnswers = {}) => {
  const text = Object.values(visionAnswers).join(' ').toLowerCase()
  const quests = []

  const addQuest = (id, title, description, difficulty = 'normal') => {
    quests.push({ id, title, description, difficulty })
  }

  if (keywordMatch(text, ['fit', 'health', 'gym', 'body', 'energy'])) {
    addQuest('fitness-1', '10-Min Focused Workout', 'Complete a 10-minute strength or cardio session.', 'easy')
    addQuest('fitness-2', 'Meal Prep Check', 'Plan or prep one healthy meal for today.', 'normal')
    addQuest('fitness-3', 'Sleep Guard', 'Protect an 8-hour sleep window tonight.', 'normal')
  }

  if (keywordMatch(text, ['study', 'learn', 'college', 'exam'])) {
    addQuest('study-1', 'Deep Study Block', 'Do one 25-minute focused study session.', 'normal')
    addQuest('study-2', 'Active Recall', 'Write 5 flashcards or do one quiz set.', 'easy')
    addQuest('study-3', 'Teach-Back', 'Explain one concept aloud or to a friend.', 'normal')
  }

  if (keywordMatch(text, ['career', 'business', 'money', 'job'])) {
    addQuest('career-1', 'Pipeline Push', 'Send one application or follow up with a lead.', 'normal')
    addQuest('career-2', 'Skill Upgrade', 'Spend 20 minutes on a career-skill drill.', 'normal')
    addQuest('career-3', 'Network Ping', 'Message one person for feedback or advice.', 'easy')
  }

  if (keywordMatch(text, ['happy', 'calm', 'peace', 'routine'])) {
    addQuest('lifestyle-1', 'Calm Block', 'Take a 10-minute walk or meditation.', 'easy')
    addQuest('lifestyle-2', 'Routine Anchor', 'Set or reinforce one daily anchor habit.', 'normal')
    addQuest('lifestyle-3', 'Declutter Move', 'Remove one item or task causing friction.', 'easy')
  }

  return quests
}

export const calculateAlignmentScore = (history = []) => {
  // history items: { type: 'action'|'quest', status: 'completed'|'missed'|'skipped' }
  let score = 0
  history.forEach((item) => {
    if (item.type === 'action') {
      score += item.status === 'completed' ? 10 : -10
    }
    if (item.type === 'quest') {
      score += item.status === 'completed' ? 5 : -5
    }
  })
  return clamp(score, 0, 100)
}

export const generateAlignmentSummary = (score) => {
  if (score >= 80) return 'Strongly aligned with your Vision.'
  if (score >= 50) return 'Moderately aligned—keep the momentum.'
  if (score >= 20) return 'Drifting—tighten your focus today.'
  return 'Off-course—reset and take one small win now.'
}

export const generateWeeklyReflection = (history = [], antiVisionSummary = '') => {
  // history items: { completed: number, total: number }
  const completed = history.reduce((sum, h) => sum + (h.completed || 0), 0)
  const total = history.reduce((sum, h) => sum + (h.total || 0), 0)
  if (!total) return 'No data for this week.'
  const ratio = completed / total
  if (ratio >= 0.7) return 'You are aligning with your Vision.'
  if (ratio <= 0.3) return 'You are drifting toward your Anti-Vision.'
  return 'You are partially aligned—tighten your focus.'
}

export const getAntiProcrastinationWarning = (inactiveHours = 0, skippedHabits = 0, antiVisionSummary = '') => {
  if (inactiveHours < 24 && skippedHabits <= 0) return ''
  const summary = summarize(antiVisionSummary, 100)
  return `This is the future you said you want to avoid: ${summary}`
}

export const getTodayAlignmentHistory = (actionPlan = {}, quests = []) => {
  // Helper to build history items for scoring.
  const history = []
  if (actionPlan) {
    ['avoid', 'do', 'remove'].forEach((key) => {
      if (actionPlan[key]) {
        history.push({ type: 'action', status: actionPlan[key + 'Completed'] ? 'completed' : 'missed' })
      }
    })
  }
  quests.forEach((q) => {
    history.push({ type: 'quest', status: q.completed ? 'completed' : 'skipped' })
  })
  return history
}

const pickWeighted = (items = []) => {
  const total = items.reduce((sum, item) => sum + (item.weight || 1), 0)
  const roll = Math.random() * total
  let acc = 0
  for (const item of items) {
    acc += item.weight || 1
    if (roll <= acc) return item.value ?? item
  }
  return items[items.length - 1]?.value ?? items[items.length - 1] ?? null
}

const buildCategory = (id, titlePrefix, descriptionPrefix, difficulty = 'normal') => (
  {
    id,
    title: titlePrefix,
    description: descriptionPrefix,
    difficulty,
  }
)

export const generateUnpredictableEvent = ({ visionAnswers = {}, antiVisionAnswers = {}, player = {} } = {}) => {
  const visionText = Object.values(visionAnswers).join(' ').toLowerCase()
  const antiText = Object.values(antiVisionAnswers).join(' ').toLowerCase()
  const level = player?.level || 1

  const questPool = []
  const missionPool = []
  const raidPool = []

  // Fitness
  if (keywordMatch(visionText, ['fit', 'health', 'gym', 'body', 'energy'])) {
    questPool.push(buildCategory('uq-fit-1', 'Flash Workout', 'Complete a 12-minute EMOM to spike energy.', 'normal'))
    missionPool.push(buildCategory('um-fit-1', 'Recovery Guard', 'Protect an 8-hour sleep window tonight.', 'normal'))
  }

  // Study
  if (keywordMatch(visionText, ['study', 'learn', 'college', 'exam'])) {
    questPool.push(buildCategory('uq-study-1', 'Sprint Study', 'Do a 20-minute deep work block on your toughest topic.', 'normal'))
    missionPool.push(buildCategory('um-study-1', 'Teach-Back Mission', 'Record a 2-minute teach-back of today\'s concept.', 'hard'))
  }

  // Career
  if (keywordMatch(visionText, ['career', 'business', 'money', 'job'])) {
    questPool.push(buildCategory('uq-career-1', 'Pipeline Push', 'Send one application or follow-up message.', 'normal'))
    missionPool.push(buildCategory('um-career-1', 'Demo Drop', 'Ship a tiny demo or portfolio tweak today.', 'hard'))
  }

  // Lifestyle / Calm
  if (keywordMatch(visionText, ['happy', 'calm', 'peace', 'routine'])) {
    questPool.push(buildCategory('uq-life-1', 'Calm Anchor', 'Take a 10-minute walk with no phone.', 'easy'))
    missionPool.push(buildCategory('um-life-1', 'Routine Lock', 'Set one fixed anchor time you will defend today.', 'normal'))
  }

  // Generic fallbacks
  questPool.push(
    buildCategory('uq-generic-1', 'Momentum Spark', 'Do one 10-minute action toward your top goal.', 'easy'),
  )
  missionPool.push(
    buildCategory('um-generic-1', 'Distraction Purge', 'Remove one digital distraction for 2 hours.', 'normal'),
  )

  // Raids scale with level
  raidPool.push(
    buildCategory('ur-gate-1', 'Gate Raid: Tier I', 'Clear a 45-minute focused build or study block.', level >= 15 ? 'hard' : 'normal'),
  )
  if (level >= 20) {
    raidPool.push(buildCategory('ur-gate-2', 'Gate Raid: Tier II', 'Complete three back-to-back 25-minute focus blocks.', 'hard'))
  }

  const type = pickWeighted([
    { value: 'quest', weight: 6 },
    { value: 'mission', weight: 3 },
    { value: 'raid', weight: 1 + Math.max(0, level - 10) * 0.1 },
  ])

  const sourcePool = type === 'raid' ? raidPool : type === 'mission' ? missionPool : questPool
  const picked = pickWeighted(sourcePool.map((item) => ({ value: item, weight: 1 })))

  const rewardHint = type === 'raid'
    ? 'High XP — complete to unlock next gate faster.'
    : type === 'mission'
      ? 'Medium XP and momentum boost.'
      : 'Quick XP and momentum.'

  return {
    ...picked,
    type,
    rewardHint,
    antiVisionCue: summarize(antiText, 80),
  }
}

// Example usage (to be removed or adapted when integrating):
// const motivation = getTodayMotivation(antiVisionAnswers, visionAnswers, actionPlanAnswers)
// const quests = generateQuests(visionAnswers)
// const history = getTodayAlignmentHistory(actionPlanAnswers, quests)
// const score = calculateAlignmentScore(history)
// const reflection = generateWeeklyReflection([{ completed: 5, total: 7 }], summarize(Object.values(antiVisionAnswers)[0]))
// const warning = getAntiProcrastinationWarning(26, 2, Object.values(antiVisionAnswers)[0])
