import { useState } from 'react'
import { Coins, Star, Check, Lock } from 'lucide-react'
import { usePlayer } from '../context/PlayerContext'
import { motion } from 'framer-motion'

function RewardCard({ reward, onClaim, tasks = [] }) {
  const { player, spendGold, spendXP } = usePlayer()
  const [isClaimed, setIsClaimed] = useState(reward.claimed || false)
  
  // Check task requirement
  const requiredTask = reward.requiredTaskId ? tasks.find(t => t.id === reward.requiredTaskId) : null
  const isTaskLocked = requiredTask && !requiredTask.completed

  // Check expiry
  const isExpired = reward.expiryDate ? (() => {
    const expiry = new Date(reward.expiryDate);
    expiry.setHours(23, 59, 59, 999); // Set to end of day
    return expiry < new Date();
  })() : false;

  const canAfford = player.gold >= reward.cost && (!reward.xpCost || player.xp >= reward.xpCost)
  const isAvailable = !isClaimed && canAfford && !isTaskLocked && !isExpired

  const handleClaim = () => {
    if (!isAvailable) return
    
    // Deduct XP if applicable
    if (reward.xpCost > 0) {
      if (!spendXP(reward.xpCost)) return // Should be caught by isAvailable, but safety check
    }

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
          {isClaimed ? 'Claimed' : isExpired ? 'Expired' : isTaskLocked ? 'Locked' : isAvailable ? 'Available' : 'Insufficient Funds'}
        </div>

        {reward.category && (
          <div className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-500/20 text-blue-400 mr-2">
            {reward.category}
          </div>
        )}

        {reward.expiryDate && (
          <div className="mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium bg-orange-500/20 text-orange-400">
            Expires: {new Date(reward.expiryDate).toLocaleDateString()}
          </div>
        )}

        <div className="mt-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-yellow-400 font-medium">{reward.cost} Gold</span>
          </div>
          {reward.xpCost > 0 && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-medium">{reward.xpCost} XP</span>
            </div>
          )}
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
          ) : isExpired ? (
            <>
              <Lock className="w-4 h-4" />
              Expired
            </>
          ) : isTaskLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Complete "{requiredTask?.title}"
            </>
          ) : !canAfford ? (
            <>
              <Lock className="w-4 h-4" />
              Not Enough Funds
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
