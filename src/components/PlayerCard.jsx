import { usePlayer } from '../context/PlayerContext'
import { Star, Zap, Coins } from 'lucide-react'

function PlayerCard() {
  const { player, level, rank, xpProgress, xpToNextLevel, nextLevelXp, currentLevelXp } = usePlayer()

  return (
    <div className="card-dark p-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <div className="w-24 h-32 rounded-lg overflow-hidden bg-gradient-to-b from-purple-900/50 to-dark-800 border border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold">
                {player.name.charAt(0)}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-dark-700 px-2 py-0.5 rounded text-xs font-medium border border-purple-500/30">
            Lv.{level}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-400">⚔️</span>
            <span className="text-white font-medium">{player.name}</span>
          </div>
          
          <h3 className="text-lg font-semibold mb-1">
            Level {level} <span className="text-purple-400">✦</span> | {player.title}
          </h3>
          
          <div className="flex items-center gap-1 mb-3">
            <span className="text-sm" style={{ color: rank.color }}>
              Rank: {rank.name}
            </span>
            <span className="text-yellow-400">★★★</span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>XP Progress</span>
              <span>{player.xp - currentLevelXp}/{nextLevelXp - currentLevelXp} XP</span>
            </div>
            <div className="h-3 bg-dark-600 rounded-full overflow-hidden">
              <div 
                className="xp-bar h-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-400 mb-2">
            You require <span className="text-red-400">{xpToNextLevel} XP</span> to complete this level!
          </div>

          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-gray-400">XP earned :</span>
              <span className="text-green-400">{player.xp.toLocaleString()} XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Gold earned :</span>
              <span className="text-yellow-400">{player.gold.toLocaleString()} Credits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerCard
