import { useState } from 'react'
import { motion } from 'framer-motion'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getIntensityColor(value, baseColor = 'green') {
  const colors = {
    green: [
      'bg-dark-600',
      'bg-green-900/50',
      'bg-green-700/60',
      'bg-green-500/70',
      'bg-green-400',
    ],
    orange: [
      'bg-dark-600',
      'bg-orange-900/50',
      'bg-orange-700/60',
      'bg-orange-500/70',
      'bg-orange-400',
    ],
    purple: [
      'bg-dark-600',
      'bg-purple-900/50',
      'bg-purple-700/60',
      'bg-purple-500/70',
      'bg-purple-400',
    ],
    blue: [
      'bg-dark-600',
      'bg-blue-900/50',
      'bg-blue-700/60',
      'bg-blue-500/70',
      'bg-blue-400',
    ],
  }
  const colorSet = colors[baseColor] || colors.green
  return colorSet[Math.min(value, colorSet.length - 1)]
}

function Heatmap({ title, data = [], weeks = 12, color = 'green', onToggle, showDone = true }) {
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
        const value = data.includes(dateStr) ? 4 : 0
        weekData.push({
          date: dateStr,
          value,
          isToday: date.toDateString() === today.toDateString(),
          isFuture: date > today,
        })
      }
      grid.push(weekData)
    }
    return grid
  }

  const grid = generateGrid()

  return (
    <div className="card-dark p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{title.icon || '🔥'}</span>
        <h3 className="font-semibold text-white">{title.text || title}</h3>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 mr-2">
            {DAYS.map((day, i) => (
              <div key={i} className="h-4 w-4 flex items-center justify-center text-[10px] text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((cell, dayIndex) => (
                <motion.button
                  key={cell.date}
                  className={`h-4 w-4 rounded-sm heatmap-cell ${
                    cell.isFuture 
                      ? 'bg-dark-700/30 cursor-not-allowed' 
                      : getIntensityColor(cell.value, color)
                  } ${cell.isToday ? 'ring-1 ring-white/50' : ''}`}
                  whileHover={{ scale: cell.isFuture ? 1 : 1.3 }}
                  onClick={() => !cell.isFuture && onToggle?.(cell.date)}
                  onMouseEnter={() => setHoveredCell(cell)}
                  onMouseLeave={() => setHoveredCell(null)}
                  disabled={cell.isFuture}
                  aria-label={`${cell.date}: ${cell.value > 0 ? 'completed' : 'not completed'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showDone && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-400">Done</span>
          <div className="w-4 h-4 rounded bg-green-500" />
        </div>
      )}

      {hoveredCell && (
        <div className="mt-2 text-xs text-gray-400">
          {new Date(hoveredCell.date).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })}
          {hoveredCell.value > 0 && ' - Completed'}
        </div>
      )}
    </div>
  )
}

export default Heatmap
