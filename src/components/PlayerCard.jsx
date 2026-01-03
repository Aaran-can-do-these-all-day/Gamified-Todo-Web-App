import { motion } from 'framer-motion'
import { usePlayer } from '../context/PlayerContext'
import { Zap, Coins, Plus } from 'lucide-react'

function PlayerCard() {
  const { player, level, rank, xpToNextLevel, nextLevelXp, currentLevelXp } = usePlayer()

  const xpInCurrentLevel = player.xp - currentLevelXp
  const xpNeededForLevel = nextLevelXp - currentLevelXp
  const progress = Math.max(Math.min(xpInCurrentLevel / xpNeededForLevel, 1), 0)
  const statusText = player.systemActivated
    ? 'On track — keep momentum.'
    : 'System standby — initialize to boost.'

  return (
    <div className="bg-dark-800/80 rounded-lg border border-white/10 h-full flex flex-col max-h-[620px]">
      <div className="p-3 sm:p-3.5 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400">⚔️</span>
          <span className="text-white font-medium">{player.name}</span>
        </div>
        
        <div className="relative w-full aspect-[4/3] mb-3 rounded-lg overflow-hidden bg-dark-900">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-dark-900 to-dark-900" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-40 bg-gradient-to-b from-purple-800/30 to-dark-900 rounded-lg flex items-center justify-center">
                <div className="text-6xl opacity-60">⚔️</div>
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600/30 rounded blur-xl" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-600/30 rounded blur-xl" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-dark-900 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-purple-900/30 to-transparent" />
        </div>

        <h3 className="text-lg font-semibold mb-1">
          Level {level} <span className="text-purple-400">✦</span> | {player.title}
        </h3>
        
        <div className="flex items-center gap-1 mb-2">
          <span className="text-sm" style={{ color: rank.color }}>
            Rank: {rank.name}
          </span>
          <span className="text-yellow-400 ml-1">★★★</span>
        </div>

        <div className="mb-4 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-100/80">Status</p>
          <p className="text-sm text-emerald-50">{statusText}</p>
        </div>

        <div className="mb-3">
          <div className="relative h-3 w-full rounded-full bg-dark-700/70 overflow-hidden border border-white/5 mb-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#22D3EE] via-[#34D399] to-[#A3E635]"
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, transparent 0, transparent 9%, rgba(255,255,255,0.45) 9.5%, transparent 10%)',
              }}
            />
          </div>
          <div className="text-right text-xs text-gray-400">
            {xpInCurrentLevel}/{xpNeededForLevel} XP
          </div>
        </div>

        <div className="text-sm text-gray-400 mb-4">
          You require <span className="text-red-400 font-medium">{xpToNextLevel} XP</span> to complete this level!
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-gray-400">XP earned :</span>
            <span className="text-green-400 font-medium">{player.xp.toLocaleString()} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400">Gold earned</span>
            <span className="text-orange-400">🔥</span>
            <span className="text-yellow-400 font-medium">{player.gold.toLocaleString()} Credits</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default PlayerCard
