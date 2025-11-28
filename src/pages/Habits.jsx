import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Power, Sword, Target, Calendar, Settings } from 'lucide-react'
import Heatmap from '../components/Heatmap'
import HabitGoalCard from '../components/HabitGoalCard'
import { motion } from 'framer-motion'

const generateRandomDates = (count = 50) => {
  const dates = []
  const today = new Date()
  for (let i = 0; i < count; i++) {
    const randomDays = Math.floor(Math.random() * 84)
    const date = new Date(today)
    date.setDate(date.getDate() - randomDays)
    if (Math.random() > 0.3) {
      dates.push(date.toISOString().split('T')[0])
    }
  }
  return [...new Set(dates)]
}

const initialHabits = [
  {
    id: 1,
    title: 'Touch grass',
    icon: '🌱',
    color: 'green',
    data: generateRandomDates(60),
    done: true,
  },
  {
    id: 2,
    title: 'Workout',
    icon: '💪',
    color: 'orange',
    data: generateRandomDates(50),
    done: true,
  },
  {
    id: 3,
    title: 'Read 1 page',
    icon: '📖',
    color: 'blue',
    data: generateRandomDates(40),
    done: true,
  },
  {
    id: 4,
    title: 'Productivity Learning',
    icon: '🧠',
    color: 'purple',
    data: generateRandomDates(45),
    done: true,
  },
]

const initialGoals = [
  {
    id: 1,
    title: 'Touch Grass',
    icon: '🌱',
    daysRemaining: 5,
    winXp: 30,
    loseXp: 200,
    status: 'active',
  },
  {
    id: 2,
    title: 'Workout',
    icon: '💪',
    daysRemaining: 11,
    winXp: 50,
    loseXp: 100,
    status: 'lost',
  },
  {
    id: 3,
    title: 'Read 1 Page',
    icon: '📖',
    daysRemaining: 31,
    winXp: 70,
    loseXp: 100,
    status: 'active',
  },
  {
    id: 4,
    title: 'Learn about Productivity',
    icon: '🧠',
    daysRemaining: 27,
    winXp: 60,
    loseXp: 150,
    status: 'active',
  },
]

function Habits() {
  const [habits, setHabits] = useState(initialHabits)
  const [goals, setGoals] = useState(initialGoals)
  const [view, setView] = useState('month')

  const handleToggle = (habitId, date) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newData = h.data.includes(date)
          ? h.data.filter(d => d !== date)
          : [...h.data, date]
        return { ...h, data: newData }
      }
      return h
    }))
  }

  return (
    <div className="min-h-screen">
      <div className="h-32 bg-gradient-to-b from-purple-900/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="flex flex-wrap gap-3 mb-8">
          <NavLink to="/" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Return Home
          </NavLink>
          <NavLink to="/awakening" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Power className="w-4 h-4" /> Awakening
          </NavLink>
          <NavLink to="/quests" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Sword className="w-4 h-4" /> Quests
          </NavLink>
          <NavLink to="/gates" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Target className="w-4 h-4" /> Gates
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setView('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  view === 'month' ? 'bg-purple-600 text-white' : 'bg-dark-700 text-gray-400'
                }`}
              >
                <Calendar className="w-4 h-4" /> Month
              </button>
              <button
                onClick={() => setView('agenda')}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                  view === 'agenda' ? 'bg-purple-600 text-white' : 'bg-dark-700 text-gray-400'
                }`}
              >
                📋 Agenda
              </button>
              <button className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {habits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Heatmap
                    title={{ text: habit.title, icon: habit.icon }}
                    data={habit.data}
                    color={habit.color}
                    weeks={12}
                    onToggle={(date) => handleToggle(habit.id, date)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-4 mb-6">
              <button className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium">
                🎯 Habit Goals
              </button>
              <button className="px-4 py-2 rounded-lg bg-dark-700 text-gray-400 text-sm font-medium">
                ✅ Completed
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitGoalCard 
                    habit={goal}
                    onComplete={(id) => setGoals(goals.map(g => 
                      g.id === id ? { ...g, status: 'completed' } : g
                    ))}
                    onFail={(id) => setGoals(goals.map(g => 
                      g.id === id ? { ...g, status: 'lost' } : g
                    ))}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Habits
