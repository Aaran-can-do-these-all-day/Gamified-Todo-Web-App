import { Flame, Trophy, X, Check } from 'lucide-react'
import { motion } from 'framer-motion'

function HabitGoalCard({ habit, onComplete, onFail }) {
  const isLost = habit.status === 'lost'
  const isCompleted = habit.status === 'completed'

  return (
    <motion.div 
      className="card-dark p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{habit.icon || '🌱'}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{habit.title}</h3>
          
          <div className="flex items-center gap-1 text-sm mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium">{habit.daysRemaining}</span>
            <span className="text-gray-400">Days Remaining</span>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Win</span>
              <span className="text-green-400">{habit.winXp} XP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Lose</span>
              <span className="text-red-400">{habit.loseXp} XP</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10">
            {isLost ? (
              <div className="flex items-center gap-2 text-red-400">
                <X className="w-4 h-4" />
                <span className="font-medium">Lost</span>
              </div>
            ) : isCompleted ? (
              <div className="flex items-center gap-2 text-green-400">
                <Trophy className="w-4 h-4" />
                <span className="font-medium">Completed!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => onComplete?.(habit.id)}
                  className="flex-1 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-medium"
                >
                  Complete
                </button>
                <button 
                  onClick={() => onFail?.(habit.id)}
                  className="py-2 px-4 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HabitGoalCard
