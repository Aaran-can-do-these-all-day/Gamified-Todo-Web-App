import { usePlayer } from '../context/PlayerContext'
import { Zap, Coins, Plus } from 'lucide-react'

function PlayerCard() {
  const { player, level, rank, xpToNextLevel, nextLevelXp, currentLevelXp } = usePlayer()

  const xpInCurrentLevel = player.xp - currentLevelXp
  const xpNeededForLevel = nextLevelXp - currentLevelXp
  const segments = 10
  const filledSegments = Math.floor((xpInCurrentLevel / xpNeededForLevel) * segments)

  return (
    <div className="bg-dark-800/80 rounded-lg border border-white/10 h-full flex flex-col max-h-[600px]">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-400">⚔️</span>
          <span className="text-white font-medium">{player.name}</span>
        </div>
        
        <div className="relative w-full aspect-[4/3] mb-4 rounded-lg overflow-hidden bg-dark-900">
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
        
        <div className="flex items-center gap-1 mb-4">
          <span className="text-sm" style={{ color: rank.color }}>
            Rank: {rank.name}
          </span>
          <span className="text-yellow-400 ml-1">★★★</span>
        </div>

        <div className="mb-3">
          <div className="flex gap-0.5 mb-1">
            {Array.from({ length: segments }).map((_, i) => (
              <div 
                key={i}
                className={`h-3 flex-1 rounded-sm ${
                  i < filledSegments 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500' 
                    : 'bg-dark-600'
                }`}
              />
            ))}
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

      <button className="w-full py-3 border-t border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        New page
      </button>
    </div>
  )
}

export default PlayerCard
