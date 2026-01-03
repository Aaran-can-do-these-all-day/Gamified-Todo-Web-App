import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { Clock, Zap, Coins, Check, X, AlertCircle, Tag, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Normal: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'S-Rank': 'bg-red-500/20 text-red-400 border-red-500/30',
}

const categoryColors = {
  Discipline: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  Health: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Focus: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  Learning: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  General: 'bg-slate-500/10 text-slate-200 border-slate-500/20',
  Mindfulness: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  Leadership: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  'High-Intensity': 'bg-red-500/10 text-red-300 border-red-500/20',
}

function TaskCard({ task, onComplete, onFail }) {
  const { completeTask } = usePlayer()
  const [showXpGain, setShowXpGain] = useState(false)
  const initialCompleted =
    task.status === 'Completed' || task.completed === true
  const [isCompleted, setIsCompleted] = useState(initialCompleted)

  const coverStyle = task.coverUrl
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 100%), url(${task.coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined

  const handleComplete = () => {
    if (isCompleted) return
    setShowXpGain(true)
    setIsCompleted(true)
    completeTask(task.xp, task.credits)
    onComplete?.(task.id)
    setTimeout(() => setShowXpGain(false), 1000)
  }

  return (
    <motion.div 
      className="card-dark overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="h-32 bg-gradient-to-br from-purple-900/50 to-pink-900/50 relative overflow-hidden"
        style={coverStyle}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-opacity%3D%22.05%22%3E%3Ccircle%20fill%3D%22%23FFF%22%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        <AnimatePresence>
          {showXpGain && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -30 }}
            >
              <span className="text-2xl font-bold text-green-400 drop-shadow-lg">
                +{task.xp} XP
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg">{task.icon || '📋'}</span>
          <h3 className="font-semibold text-white">{task.title}</h3>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${difficultyColors[task.difficulty] || 'border-white/10 text-white/70'}`}>
            {task.difficulty}
          </span>
          {task.category && (
            <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[task.category] || 'border-white/10 text-white/70'}`}>
              {task.category}
            </span>
          )}
          {task.streakMultiplier && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border border-purple-500/30 bg-purple-500/10 text-purple-200">
              {task.streakMultiplier}
            </span>
          )}
          {task.status && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium border border-white/10 text-white/80">
              {task.status}
            </span>
          )}
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 text-green-400" />
            <span>From <span className="text-green-400">{task.startTime}</span> To <span className="text-red-400">{task.endTime}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400">Task's Credits :</span>
            <span className="text-yellow-400">{task.credits} Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">Task XP :</span>
            <span className="text-blue-400">{task.xp} XP</span>
          </div>
          <div className="flex items-center gap-2 text-orange-400">
            <AlertCircle className="w-4 h-4" />
            <span>Deadline: {task.deadline}</span>
          </div>
          {task.notes ? (
            <div className="flex items-start gap-2 text-gray-300">
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm text-white/80">{task.notes}</span>
            </div>
          ) : null}
          {Array.isArray(task.tags) && task.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 pt-1">
              {task.tags.map((tagLabel) => (
                <span
                  key={tagLabel}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/80"
                >
                  <Tag className="h-3 w-3 text-white/60" />
                  {tagLabel}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
            {isCompleted && <Check className="w-4 h-4 text-green-400" />}
          </div>
          
          {!isCompleted && (
            <div className="flex gap-2">
              <button 
                onClick={handleComplete}
                className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
              >
                <Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onFail?.(task.id)}
                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard
