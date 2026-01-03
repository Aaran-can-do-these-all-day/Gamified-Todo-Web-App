import { useState } from 'react'
import { motion } from 'framer-motion'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getIntensityColor(count, baseColor = 'green') {
  // GitHub-style intensity levels based on count
  // 0 = empty, 1-2 = level 1, 3-4 = level 2, 5-6 = level 3, 7+ = level 4
  let level = 0
  if (count === 0) level = 0
  else if (count <= 2) level = 1
  else if (count <= 4) level = 2
  else if (count <= 6) level = 3
  else level = 4

  const colors = {
    green: [
      'bg-dark-600 border-dark-500',
      'bg-green-900/40 border-green-800/50',
      'bg-green-700/60 border-green-600/60',
      'bg-green-500/80 border-green-400/70',
      'bg-green-400 border-green-300',
    ],
    orange: [
      'bg-dark-600 border-dark-500',
      'bg-orange-900/40 border-orange-800/50',
      'bg-orange-700/60 border-orange-600/60',
      'bg-orange-500/80 border-orange-400/70',
      'bg-orange-400 border-orange-300',
    ],
    purple: [
      'bg-dark-600 border-dark-500',
      'bg-purple-900/40 border-purple-800/50',
      'bg-purple-700/60 border-purple-600/60',
      'bg-purple-500/80 border-purple-400/70',
      'bg-purple-400 border-purple-300',
    ],
    blue: [
      'bg-dark-600 border-dark-500',
      'bg-blue-900/40 border-blue-800/50',
      'bg-blue-700/60 border-blue-600/60',
      'bg-blue-500/80 border-blue-400/70',
      'bg-blue-400 border-blue-300',
    ],
  }
  const colorSet = colors[baseColor] || colors.green
  return colorSet[level]
}

function Heatmap({ title, data = [], weeks = 12, color = 'green', onToggle, showDone = true, taskCounts = {} }) {
  const [hoveredCell, setHoveredCell] = useState(null)

  const generateGrid = () => {
    const grid = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - (weeks * 7) + 1)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    for (let week = 0; week < weeks; week++) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + (week * 7) + day)
        const dateStr = date.toISOString().split('T')[0]
        
        // Get task count for this date, or fallback to binary (in data = 1, not in data = 0)
        const count = taskCounts[dateStr] !== undefined 
          ? taskCounts[dateStr] 
          : (data.includes(dateStr) ? 1 : 0)
        
        weekData.push({
          date: dateStr,
          count,
          isToday: date.toDateString() === today.toDateString(),
          isFuture: date > today,
        })
      }
      grid.push(weekData)
    }
    return grid
  }

  const grid = generateGrid()
  
  // Calculate statistics
  const totalDays = grid.flat().filter(cell => !cell.isFuture && cell.count > 0).length
  const totalTasks = grid.flat().reduce((sum, cell) => sum + cell.count, 0)
  const currentStreak = (() => {
    let streak = 0
    const sortedCells = grid.flat().sort((a, b) => new Date(b.date) - new Date(a.date))
    for (const cell of sortedCells) {
      if (cell.isFuture) continue
      if (cell.count > 0) streak++
      else break
    }
    return streak
  })()

  return (
    <div className="card-dark p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">{title.icon || '🔥'}</span>
          <h3 className="font-semibold text-white">{title.text || title}</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="text-green-400 font-semibold">{totalTasks}</span> tasks
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-400 font-semibold">{currentStreak}</span> day streak
          </span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-2">
            {DAYS.map((day, i) => (
              <div key={i} className="h-3 w-3 flex items-center justify-center text-[9px] text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((cell, dayIndex) => (
                <motion.button
                  key={cell.date}
                  className={`h-3 w-3 rounded-sm border transition-all ${
                    cell.isFuture 
                      ? 'bg-dark-700/30 border-dark-600/50 cursor-not-allowed' 
                      : getIntensityColor(cell.count, color)
                  } ${cell.isToday ? 'ring-1 ring-white/70 ring-offset-1 ring-offset-dark-800' : ''}`}
                  whileHover={{ scale: cell.isFuture ? 1 : 1.4 }}
                  whileTap={{ scale: cell.isFuture ? 1 : 0.9 }}
                  onClick={() => !cell.isFuture && onToggle?.(cell.date)}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  disabled={cell.isFuture}
                  aria-label={`${cell.date}: ${cell.count} tasks completed`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-3 w-3 rounded-sm border ${getIntensityColor(level === 0 ? 0 : level * 2, color)}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">More</span>
        </div>
        {totalDays > 0 && (
          <span className="text-xs text-gray-400">
            {totalDays} active {totalDays === 1 ? 'day' : 'days'}
          </span>
        )}
      </div>

      {hoveredCell && (
        <div className="mt-2 text-xs bg-dark-700/50 border border-white/10 rounded px-2 py-1.5">
          <span className="text-gray-300 font-medium">
            {new Date(hoveredCell.date).toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </span>
          {hoveredCell.count > 0 ? (
            <span className="text-gray-400 ml-2">
              — <span className="text-green-400 font-semibold">{hoveredCell.count}</span> {hoveredCell.count === 1 ? 'task' : 'tasks'} completed
            </span>
          ) : (
            <span className="text-gray-500 ml-2">— No tasks completed</span>
          )}
        </div>
      )}
    </div>
  )
}

export default Heatmap
