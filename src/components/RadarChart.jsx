import { usePlayer } from '../context/PlayerContext'
import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'

function RadarChart() {
  const { player } = usePlayer()

  const attributeLabels = {
    FIT: 'Fitness',
    SOC: 'Social',
    INT: 'Intellect',
    DIS: 'Discipline',
    FOC: 'Focus / Execution',
    FIN: 'Financial',
  }

  const data = [
    { subject: 'FIT', value: player.attributes.fit, fullMark: 10 },
    { subject: 'SOC', value: player.attributes.soc, fullMark: 10 },
    { subject: 'INT', value: player.attributes.int, fullMark: 10 },
    { subject: 'DIS', value: player.attributes.dis, fullMark: 10 },
    { subject: 'FOC', value: player.attributes.foc, fullMark: 10 },
    { subject: 'FIN', value: player.attributes.fin, fullMark: 10 },
  ]

  return (
    <div className="h-full max-h-[620px] flex flex-col">
      <div className="flex-1 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="95%" data={data}>
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
              domain={[0, 10]} 
              ticks={[1,2,3,4,5,6,7,8,9,10]}
              tick={false}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              formatter={(value, _name, entry) => [
                `${value}/10`,
                attributeLabels[entry?.payload?.subject] || entry?.payload?.subject,
              ]}
              labelFormatter={(label) => attributeLabels[label] || label}
              contentStyle={{
                backgroundColor: '#0f172a',
                border: '1px solid #1f2937',
                borderRadius: '8px',
                color: '#e5e7eb',
              }}
              itemStyle={{ color: '#e5e7eb' }}
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
