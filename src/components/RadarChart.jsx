import { usePlayer } from '../context/PlayerContext'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

function RadarChart() {
  const { player } = usePlayer()

  const data = [
    { subject: 'FIT', value: player.attributes.fit, fullMark: 10 },
    { subject: 'SOC', value: player.attributes.soc, fullMark: 10 },
    { subject: 'INT', value: player.attributes.int, fullMark: 10 },
    { subject: 'DIS', value: player.attributes.dis, fullMark: 10 },
    { subject: 'FOC', value: player.attributes.foc, fullMark: 10 },
    { subject: 'FIN', value: player.attributes.fin, fullMark: 10 },
  ]

  return (
    <motion.div 
      className="card-dark p-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          STATISTICS
        </h2>
        <p className="text-xs text-gray-500 mt-1">THE SYSTEM USES ME, AND I USE THE SYSTEM</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid 
              stroke="rgba(168, 85, 247, 0.2)" 
              strokeDasharray="3 3"
            />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 10]} 
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickCount={6}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke="#a855f7"
              fill="rgba(168, 85, 247, 0.3)"
              strokeWidth={2}
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center text-xs text-gray-500 mt-2">
        <span className="text-yellow-400">⚡</span> Powered by ChartBase
      </div>
    </motion.div>
  )
}

export default RadarChart
