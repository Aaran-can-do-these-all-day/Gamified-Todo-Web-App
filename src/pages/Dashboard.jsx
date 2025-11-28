import PlayerCard from '../components/PlayerCard'
import RadarChart from '../components/RadarChart'
import SystemPanel from '../components/SystemPanel'
import NavigationCards from '../components/Navigation'
import { motion } from 'framer-motion'

function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PLAYER
            </span>
            <span className="mx-4 text-white">|</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              STATISTICS
            </span>
            <span className="mx-4 text-white">|</span>
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              SYSTEM
            </span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <PlayerCard />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RadarChart />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <SystemPanel />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-6">
            <h2 className="font-display text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NAVIGATION
            </h2>
            <p className="text-gray-500 text-sm mt-1">ナビゲーション</p>
          </div>
          <NavigationCards />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
