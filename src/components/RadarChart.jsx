import { usePlayer } from '../context/PlayerContext'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'

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
    <div className="bg-dark-800/80 rounded-lg border border-white/10 p-6 h-full flex flex-col max-h-[750px]">
      <div className="text-center mb-2">
        <p className="text-[10px] text-gray-500 tracking-widest uppercase">
          "THE SYSTEM USES ME, AND I USE THE SYSTEM"
        </p>
      </div>
      
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid 
              stroke="#4B5563"
              strokeOpacity={0.6}
              gridType="polygon"
            />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 500 }}
              tickLine={false}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 9]} 
              tick={{ fill: '#6B7280', fontSize: 9 }}
              tickCount={10}
              axisLine={false}
            />
            <Radar
              name="Stats"
              dataKey="value"
              stroke="#A855F7"
              fill="#A855F7"
              fillOpacity={0.35}
              strokeWidth={2}
            />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RadarChart
