import { useState } from 'react'
import { Lock, Unlock, Check, AlertTriangle, Trophy, Skull } from 'lucide-react'
import { motion } from 'framer-motion'

const rankColors = {
  'E-Rank': { bg: 'from-green-900/50 to-green-800/30', border: 'border-green-500/30', text: 'text-green-400', glow: 'shadow-green-500/20' },
  'D-Rank': { bg: 'from-blue-900/50 to-blue-800/30', border: 'border-blue-500/30', text: 'text-blue-400', glow: 'shadow-blue-500/20' },
  'C-Rank': { bg: 'from-yellow-900/50 to-yellow-800/30', border: 'border-yellow-500/30', text: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
  'B-Rank': { bg: 'from-purple-900/50 to-purple-800/30', border: 'border-purple-500/30', text: 'text-purple-400', glow: 'shadow-purple-500/20' },
  'A-Rank': { bg: 'from-orange-900/50 to-orange-800/30', border: 'border-orange-500/30', text: 'text-orange-400', glow: 'shadow-orange-500/20' },
  'S-Rank': { bg: 'from-red-900/50 to-red-800/30', border: 'border-red-500/30', text: 'text-red-400', glow: 'shadow-red-500/20' },
}

function BossCard({ boss, playerXp, onDayComplete }) {
  const isUnlocked = playerXp >= boss.xpRequired
  const colors = rankColors[boss.rank] || rankColors['E-Rank']
  
  const completedDays = boss.days?.filter(d => d.completed).length || 0
  const totalDays = boss.days?.length || 4

  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden border ${colors.border} ${isUnlocked ? '' : 'opacity-60'}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.bg}`} />
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${colors.text} bg-black/30 border ${colors.border}`}>
            {boss.rank} GATE
          </div>
          {isUnlocked ? (
            <Unlock className={`w-5 h-5 ${colors.text}`} />
          ) : (
            <Lock className="w-5 h-5 text-gray-500" />
          )}
        </div>

        <div className="flex gap-4">
          <div className={`w-24 h-32 rounded-lg bg-black/40 border ${colors.border} flex items-center justify-center overflow-hidden`}>
            {boss.image ? (
              <img src={boss.image} alt={boss.name} className="w-full h-full object-cover" />
            ) : (
              <Skull className={`w-12 h-12 ${colors.text}`} />
            )}
          </div>

          <div className="flex-1">
            <h3 className={`font-display text-xl font-bold ${colors.text} mb-2`}>
              {boss.name}
            </h3>

            {isUnlocked ? (
              <div className="flex items-center gap-1 text-sm text-green-400 mb-2">
                <Unlock className="w-4 h-4" />
                <span>Unlocked</span>
              </div>
            ) : (
              <div className="text-sm text-gray-400 mb-2">
                Requires {boss.xpRequired.toLocaleString()} XP
              </div>
            )}

            <div className="space-y-2">
              {boss.days?.map((day, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={day.completed}
                    onChange={() => isUnlocked && onDayComplete?.(boss.id, index)}
                    disabled={!isUnlocked}
                    className="w-4 h-4 rounded border-gray-500 bg-dark-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className={`text-sm ${day.completed ? 'text-green-400' : 'text-gray-400'}`}>
                    Day {index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-dark-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${colors.text.replace('text-', 'bg-')}`}
                  style={{ width: `${(completedDays / totalDays) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{completedDays}/{totalDays}</span>
            </div>

            <div className="mt-2 text-xs text-red-400">
              Losses: {boss.losses || 0}
            </div>
          </div>
        </div>

        {boss.systemMessage && (
          <div className="mt-4 p-3 rounded-lg bg-black/30 border border-white/10">
            <div className="flex items-center gap-2 text-sm text-yellow-400 mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">The System</span>
            </div>
            <p className="text-sm text-gray-300 italic">{boss.systemMessage}</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default BossCard
