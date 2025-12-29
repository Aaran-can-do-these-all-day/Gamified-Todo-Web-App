import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const TIMER_MODES = {
  pomodoro: { label: 'Pomodoro', time: 50 * 60 },
  shortBreak: { label: 'Short Break', time: 5 * 60 },
  longBreak: { label: 'Long Break', time: 15 * 60 },
}

function PomodoroTimer() {
  const [mode, setMode] = useState('pomodoro')
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.pomodoro.time)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsRunning(false)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setTimeLeft(TIMER_MODES[newMode].time)
    setIsRunning(false)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setTimeLeft(TIMER_MODES[mode].time)
    setIsRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeLeft / TIMER_MODES[mode].time) * 100

  return (
    <motion.div 
      className="rounded-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
      }}
    >
      <div className="p-6">
        <div className="flex justify-center gap-2 mb-6">
          {Object.entries(TIMER_MODES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => handleModeChange(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                mode === key
                  ? 'bg-white text-gray-800'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="text-7xl font-bold text-white font-display tracking-wider">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className="px-8 py-3 bg-white rounded-full text-gray-800 font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default PomodoroTimer
