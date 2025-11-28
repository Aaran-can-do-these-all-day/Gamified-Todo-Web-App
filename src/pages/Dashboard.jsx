import PlayerCard from '../components/PlayerCard'
import RadarChart from '../components/RadarChart'
import SystemPanel from '../components/SystemPanel'
import NavigationCards from '../components/Navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function Dashboard() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div 
          className="flex items-center justify-center gap-8 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PLAYER
          </h2>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            STATISTICS
          </h2>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            SYSTEM
          </h2>
        </motion.div>

        <div className="relative mb-12">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-dark-700/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-dark-700/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-600 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          <div className="w-2 h-2 rounded-full bg-gray-600"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-wider bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NAVIGATION
            </h2>
            <p className="text-gray-500 text-sm mt-2 tracking-widest">ナビゲーション</p>
          </div>
          <NavigationCards />
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
