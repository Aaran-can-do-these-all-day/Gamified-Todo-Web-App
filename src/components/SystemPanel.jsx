import { usePlayer } from '../context/PlayerContext'
import { Power, Flame, Gift, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

function SystemPanel() {
  const { player, level } = usePlayer()

  return (
    <motion.div 
      className="card-dark p-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Power className="w-5 h-5 text-purple-400" />
        <h2 className="font-display text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          SYSTEM
        </h2>
      </div>

      <div className="space-y-4">
        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-medium">STREAK STATUS</span>
            <Flame className="w-4 h-4" />
          </div>
          <p className="text-sm">
            Streak: <span className="text-cyan-400 font-bold">{player.streak} Days</span>
          </p>
        </div>

        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">SYSTEM GIFT</span>
            <Gift className="w-4 h-4" />
          </div>
          <p className="text-sm text-green-400">1.3x Boost Activated</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" /> Logged-In
          </p>
        </div>

        <div className="bg-dark-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">SYSTEM WARNING</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-sm text-yellow-400">Your Quest is Not Yet Complete!</p>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="text-sm text-gray-400 italic mb-3">
            Your path is still uncertain. The System urges you to continue...
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-blue-400">■</span>
              <span className="text-gray-400">Progress:</span>
              <span className="text-white">[{player.tasksCompletedToday}/4]</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-400">■</span>
              <span className="text-gray-400">Remaining Quests:</span>
            </div>
            <ul className="ml-4 space-y-1 text-sm text-gray-300">
              <li>📚 Study Programming</li>
              <li>💪 Workout</li>
              <li>💻 Learn JavaScript</li>
              <li>📖 Read Atomic Habits</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-2 text-sm mb-2">
            <Target className="w-4 h-4 text-red-400" />
            <span className="text-red-400">A new challenge awaits!</span>
            <Target className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-sm">
            <span className="text-gray-400">Next Gate unlocks at:</span>{' '}
            <span className="text-cyan-400">{player.nextBossXp.toLocaleString()} XP</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">XP Needed:</span>{' '}
            <span className="text-red-400">{Math.max(0, player.nextBossXp - player.xp).toLocaleString()} XP</span>
          </p>
        </div>

        <div className="text-center text-sm text-gray-500 italic">
          The System awaits your next move...
        </div>
      </div>
    </motion.div>
  )
}

export default SystemPanel
