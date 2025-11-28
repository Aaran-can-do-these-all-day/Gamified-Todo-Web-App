import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Power, Flame, Target, Plus } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import PomodoroTimer from '../components/PomodoroTimer'
import { motion } from 'framer-motion'

const initialTasks = [
  {
    id: 1,
    title: 'Study Programming',
    icon: '</>',
    difficulty: 'Normal',
    startTime: '8:45 AM',
    endTime: '10:45 AM',
    credits: 50,
    xp: 25,
    deadline: '92 Minutes',
    completed: true,
  },
  {
    id: 2,
    title: 'Workout',
    icon: '💪',
    difficulty: 'Easy',
    startTime: '11:15 AM',
    endTime: '12:45 PM',
    credits: 38,
    xp: 19,
    deadline: '3 Hours',
    completed: true,
  },
  {
    id: 3,
    title: 'Learn JavaScript',
    icon: '💻',
    difficulty: 'Normal',
    startTime: '1:00 PM',
    endTime: '3:00 PM',
    credits: 100,
    xp: 50,
    deadline: '5 Hours',
    completed: false,
  },
  {
    id: 4,
    title: 'Read Atomic Habits',
    icon: '📖',
    difficulty: 'Easy',
    startTime: '3:00 PM',
    endTime: '4:00 PM',
    credits: 25,
    xp: 13,
    deadline: '6 Hours',
    completed: false,
  },
]

function Quests() {
  const [tasks, setTasks] = useState(initialTasks)
  const [filter, setFilter] = useState('today')

  const handleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: true } : t))
  }

  const todayTasks = tasks.filter(t => !t.completed || filter === 'completed')
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="min-h-screen">
      <div className="h-48 bg-gradient-to-b from-purple-900/30 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Cg%20fill-opacity%3D%22.03%22%3E%3Ccircle%20fill%3D%22%23a855f7%22%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2240%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] bg-repeat" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-900 to-transparent" />
        <div className="absolute top-4 left-4">
          <div className="w-10 h-10 rounded-full bg-purple-600/30 flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-10">
        <motion.h1 
          className="font-display text-4xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Quests
        </motion.h1>

        <div className="flex flex-wrap gap-3 mb-8">
          <NavLink to="/" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Home className="w-4 h-4" /> Return Home
          </NavLink>
          <NavLink to="/awakening" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Power className="w-4 h-4" /> Awakening
          </NavLink>
          <NavLink to="/habits" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Flame className="w-4 h-4" /> Habits
          </NavLink>
          <NavLink to="/gates" className="px-4 py-2 rounded-full bg-dark-700 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <Target className="w-4 h-4" /> Gates
          </NavLink>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📋</span>
              <h2 className="text-xl font-semibold text-purple-400">Quests</h2>
            </div>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setFilter('today')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'today' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                📅 Today
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                ✅ Completed
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(filter === 'today' ? tasks : completedTasks).map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TaskCard 
                    task={task} 
                    onComplete={handleComplete}
                  />
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 rounded-lg border-2 border-dashed border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              New page
            </button>
          </div>

          <div>
            <PomodoroTimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quests
