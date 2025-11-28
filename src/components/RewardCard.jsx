import { useState } from 'react'
import { Coins, Star, Check, Lock } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { motion } from 'framer-motion'

function RewardCard({ reward, onClaim }) {
  const { player, spendGold } = usePlayer()
  const [isClaimed, setIsClaimed] = useState(reward.claimed || false)
  
  const canAfford = player.gold >= reward.cost
  const isAvailable = !isClaimed && canAfford

  const handleClaim = () => {
    if (!isAvailable) return
    
    if (spendGold(reward.cost)) {
      setIsClaimed(true)
      onClaim?.(reward.id)
    }
  }

  return (
    <motion.div 
      className="card-dark overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="h-32 relative overflow-hidden">
        {reward.image ? (
          <img 
            src={reward.image} 
            alt={reward.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
            <Star className="w-12 h-12 text-yellow-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent" />
        
        {isClaimed && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-green-400 flex items-center gap-2">
              <Check className="w-6 h-6" />
              <span className="font-medium">Claimed</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{reward.icon || '🎁'}</span>
          <h3 className="font-semibold text-white">{reward.title}</h3>
        </div>

        <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
          isAvailable 
            ? 'bg-green-500/20 text-green-400' 
            : isClaimed 
              ? 'bg-gray-500/20 text-gray-400'
              : 'bg-red-500/20 text-red-400'
        }`}>
          {isClaimed ? 'Claimed' : isAvailable ? 'Available' : 'Insufficient Gold'}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400 font-medium">{reward.cost} Credits required</span>
        </div>

        <button
          onClick={handleClaim}
          disabled={!isAvailable}
          className={`w-full mt-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
            isAvailable
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500'
              : 'bg-dark-600 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isClaimed ? (
            <>
              <Check className="w-4 h-4" />
              Claimed
            </>
          ) : !canAfford ? (
            <>
              <Lock className="w-4 h-4" />
              Not Enough Gold
            </>
          ) : (
            <>
              <Star className="w-4 h-4" />
              Claim Reward
            </>
          )}
        </button>
      </div>
    </motion.div>
  )
}

export default RewardCard
