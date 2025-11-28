import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import BossCard from '../components/BossCard'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const initialBosses = [
  {
    id: 1,
    name: 'The Goblin King',
    rank: 'E-Rank',
    xpRequired: 500,
    rewardGold: 100,
    rewardItem: 'Rusty Sword',
    days: [
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage: 'The Goblin King senses your hesitation... Use the system productively for at least 3 hours for 2 days in a row.',
  },
  {
    id: 2,
    name: 'Hollow Magician',
    rank: 'C-Rank',
    xpRequired: 3000,
    rewardGold: 300,
    rewardItem: 'Magic Staff',
    days: [
      { completed: false },
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage: 'The Hollow Magician hides behind a mana barrier. Earn 300 XP to breach his domain.',
  },
  {
    id: 3,
    name: 'Lycan Alpha',
    rank: 'D-Rank',
    xpRequired: 1500,
    rewardGold: 200,
    rewardItem: 'Silver Claws',
    days: [
      { completed: true },
      { completed: true },
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage: 'The Lycan Alpha is watching you from the darkness... Focus for at least 4 hours per day for 4 days in a row.',
  },
  {
    id: 4,
    name: 'Shadow Monarch',
    rank: 'S-Rank',
    xpRequired: 10000,
    rewardGold: 1000,
    rewardItem: 'Shadow Extraction',
    days: [
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
      { completed: false },
    ],
    losses: 0,
    systemMessage: 'The ultimate challenge awaits. Only those who have truly leveled up can face the Shadow Monarch.',
  },
]

function Gates() {
  const { player } = usePlayer()
  const [bosses, setBosses] = useState(initialBosses)
  const [selectedBoss, setSelectedBoss] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleDayComplete = (bossId, dayIndex) => {
    setBosses(bosses.map(boss => {
      if (boss.id === bossId) {
        const newDays = [...boss.days]
        newDays[dayIndex] = { ...newDays[dayIndex], completed: !newDays[dayIndex].completed }
        return { ...boss, days: newDays }
      }
      return boss
    }))
  }

  const nextBoss = () => {
    setCurrentIndex((prev) => (prev + 1) % bosses.length)
  }

  const prevBoss = () => {
    setCurrentIndex((prev) => (prev - 1 + bosses.length) % bosses.length)
  }

  const currentBoss = bosses[currentIndex]
  const isUnlocked = player.xp >= currentBoss.xpRequired

  return (
    <div className="min-h-screen">
      <div className="h-24 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, 
              transparent 0%, 
              rgba(${currentBoss.rank === 'E-Rank' ? '34, 197, 94' : 
                      currentBoss.rank === 'D-Rank' ? '59, 130, 246' : 
                      currentBoss.rank === 'C-Rank' ? '250, 204, 21' : 
                      currentBoss.rank === 'B-Rank' ? '168, 85, 247' : 
                      currentBoss.rank === 'A-Rank' ? '249, 115, 22' : 
                      '239, 68, 68'}, 0.3) 50%, 
              transparent 100%)`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-current to-transparent animate-pulse opacity-60"
               style={{ color: currentBoss.rank === 'E-Rank' ? '#22c55e' : 
                               currentBoss.rank === 'D-Rank' ? '#3b82f6' : 
                               currentBoss.rank === 'C-Rank' ? '#facc15' : 
                               currentBoss.rank === 'B-Rank' ? '#a855f7' : 
                               currentBoss.rank === 'A-Rank' ? '#f97316' : '#ef4444' }} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          key={currentBoss.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 
            className="font-display text-4xl md:text-6xl font-bold mb-4 text-glow"
            style={{ 
              color: currentBoss.rank === 'E-Rank' ? '#22c55e' : 
                     currentBoss.rank === 'D-Rank' ? '#3b82f6' : 
                     currentBoss.rank === 'C-Rank' ? '#facc15' : 
                     currentBoss.rank === 'B-Rank' ? '#a855f7' : 
                     currentBoss.rank === 'A-Rank' ? '#f97316' : '#ef4444',
              textShadow: `0 0 30px currentColor, 0 0 60px currentColor`
            }}
          >
            {currentBoss.name.toUpperCase()}
          </h1>
        </motion.div>

        <div className="flex items-center justify-center gap-8">
          <button 
            onClick={prevBoss}
            className="p-3 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="flex-1 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="hidden md:block">
                <div 
                  className="aspect-[3/4] rounded-xl border-2 flex items-center justify-center"
                  style={{ 
                    borderColor: currentBoss.rank === 'E-Rank' ? '#22c55e40' : 
                                 currentBoss.rank === 'D-Rank' ? '#3b82f640' : 
                                 currentBoss.rank === 'C-Rank' ? '#facc1540' : 
                                 currentBoss.rank === 'B-Rank' ? '#a855f740' : 
                                 currentBoss.rank === 'A-Rank' ? '#f9731640' : '#ef444440',
                    background: `linear-gradient(180deg, 
                      ${currentBoss.rank === 'E-Rank' ? 'rgba(34, 197, 94, 0.1)' : 
                        currentBoss.rank === 'D-Rank' ? 'rgba(59, 130, 246, 0.1)' : 
                        currentBoss.rank === 'C-Rank' ? 'rgba(250, 204, 21, 0.1)' : 
                        currentBoss.rank === 'B-Rank' ? 'rgba(168, 85, 247, 0.1)' : 
                        currentBoss.rank === 'A-Rank' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(239, 68, 68, 0.1)'} 0%, 
                      rgba(0,0,0,0.8) 100%)`
                  }}
                >
                  <div className="text-center p-4">
                    <div className="font-display text-sm font-bold text-gray-400 mb-2">
                      {currentBoss.rank} GATE
                    </div>
                    <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                      {currentBoss.name.split(' ').map((word, i) => (
                        <span key={i}>{word[0]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <motion.div 
                className="md:col-span-1"
                key={currentBoss.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <BossCard 
                  boss={currentBoss} 
                  playerXp={player.xp}
                  onDayComplete={handleDayComplete}
                />
              </motion.div>

              <div className="hidden md:block">
                <div 
                  className="aspect-[3/4] rounded-xl border-2 flex items-center justify-center"
                  style={{ 
                    borderColor: currentBoss.rank === 'E-Rank' ? '#22c55e40' : 
                                 currentBoss.rank === 'D-Rank' ? '#3b82f640' : 
                                 currentBoss.rank === 'C-Rank' ? '#facc1540' : 
                                 currentBoss.rank === 'B-Rank' ? '#a855f740' : 
                                 currentBoss.rank === 'A-Rank' ? '#f9731640' : '#ef444440',
                    background: `linear-gradient(180deg, 
                      ${currentBoss.rank === 'E-Rank' ? 'rgba(34, 197, 94, 0.1)' : 
                        currentBoss.rank === 'D-Rank' ? 'rgba(59, 130, 246, 0.1)' : 
                        currentBoss.rank === 'C-Rank' ? 'rgba(250, 204, 21, 0.1)' : 
                        currentBoss.rank === 'B-Rank' ? 'rgba(168, 85, 247, 0.1)' : 
                        currentBoss.rank === 'A-Rank' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(239, 68, 68, 0.1)'} 0%, 
                      rgba(0,0,0,0.8) 100%)`
                  }}
                >
                  <div className="text-center p-4">
                    <div className="font-display text-sm font-bold text-gray-400 mb-2">
                      {currentBoss.rank} GATE
                    </div>
                    <div className="flex flex-col items-center gap-1 text-xs text-gray-500">
                      {currentBoss.name.split(' ').map((word, i) => (
                        <span key={i}>{word[0]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={nextBoss}
            className="p-3 rounded-full bg-dark-700 hover:bg-dark-600 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {bosses.map((boss, index) => (
            <button
              key={boss.id}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-purple-500 scale-125' 
                  : 'bg-dark-600 hover:bg-dark-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Gates
