import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import RewardCard from '../components/RewardCard'
import { Coins, Gift, Clock, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const initialRewards = [
  {
    id: 1,
    title: '1 Hour Free Time',
    icon: '⏰',
    cost: 150,
    claimed: false,
    image: null,
  },
  {
    id: 2,
    title: 'Watch 1 Episode',
    icon: '📺',
    cost: 150,
    claimed: false,
    image: null,
  },
  {
    id: 3,
    title: 'Game for 30 mins',
    icon: '🎮',
    cost: 50,
    claimed: false,
    image: null,
  },
  {
    id: 4,
    title: 'Game for 1 hour',
    icon: '🎮',
    cost: 100,
    claimed: false,
    image: null,
  },
  {
    id: 5,
    title: 'Order Takeout',
    icon: '🍔',
    cost: 200,
    claimed: false,
    image: null,
  },
  {
    id: 6,
    title: 'Movie Night',
    icon: '🎬',
    cost: 300,
    claimed: false,
    image: null,
  },
]

const initialTaskLog = [
  { id: 1, title: 'Read Deepwork', date: 'May 7, 2025 2:30 PM', xp: 13, credits: 25 },
  { id: 2, title: 'Gym', date: 'May 7, 2025 1:00 PM', xp: 19, credits: 38 },
  { id: 3, title: 'Study Web development', date: 'May 7, 2025 11:00 AM', xp: 50, credits: 100 },
  { id: 4, title: 'Workout', date: 'May 3, 2025 12:45 PM', xp: 19, credits: 38 },
  { id: 5, title: 'Study Programming', date: 'May 3, 2025 10:45 AM', xp: 25, credits: 50 },
]

function Rewards() {
  const { player } = usePlayer()
  const [rewards, setRewards] = useState(initialRewards)
  const [taskLog] = useState(initialTaskLog)
  const [filter, setFilter] = useState('rewards')

  const handleClaim = (id) => {
    setRewards(rewards.map(r => r.id === id ? { ...r, claimed: true } : r))
  }

  const claimedRewards = rewards.filter(r => r.claimed)

  return (
    <div className="min-h-screen">
      <div className="h-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1 w-full max-w-4xl bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gift className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-purple-400">Reward Centre</h2>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('rewards')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === 'rewards' ? 'bg-purple-600 text-white' : 'bg-dark-700 text-gray-400'
                }`}
              >
                🎁 Rewards
              </button>
              <button
                onClick={() => setFilter('claimed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  filter === 'claimed' ? 'bg-purple-600 text-white' : 'bg-dark-700 text-gray-400'
                }`}
              >
                🏆 Claimed Rewards
              </button>
            </div>

            <div className="mb-4 flex items-center gap-2 text-sm">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-400">Available Gold:</span>
              <span className="text-yellow-400 font-bold">{player.gold.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(filter === 'rewards' ? rewards.filter(r => !r.claimed) : claimedRewards).map((reward, index) => (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RewardCard 
                    reward={reward}
                    onClaim={handleClaim}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-cyan-400">Task Log</h2>
              </div>
              <button className="px-3 py-1 rounded bg-cyan-600 text-white text-sm font-medium">
                New
              </button>
            </div>

            <div className="space-y-3">
              {taskLog.map((task, index) => (
                <motion.div
                  key={task.id}
                  className="card-dark p-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400">✏️</span>
                        <h3 className="font-medium text-white">{task.title}</h3>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{task.date}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white">...</button>
                  </div>
                  
                  <div className="flex gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-400">Task XP:</span>
                      <span className="text-blue-400">{task.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-400">Task's Credits:</span>
                      <span className="text-yellow-400">{task.credits} Credits</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rewards
