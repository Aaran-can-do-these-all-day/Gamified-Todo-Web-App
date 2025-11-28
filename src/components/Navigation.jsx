import { NavLink } from 'react-router-dom'
import { Power, Flame, Sword, Target } from 'lucide-react'

const navItems = [
  { 
    path: '/awakening', 
    icon: Power, 
    label: 'Awakening', 
    vertical: 'AWAKENING',
    japanese: '限界を超えで',
    topGradient: 'from-blue-600 via-blue-500 to-cyan-500',
    bottomGradient: 'from-cyan-600 via-teal-500 to-blue-600',
    accentColor: 'text-cyan-400'
  },
  { 
    path: '/habits', 
    icon: Flame, 
    label: 'Habits', 
    vertical: 'HABITS',
    japanese: '毎日の習慣',
    topGradient: 'from-orange-600 via-orange-500 to-amber-500',
    bottomGradient: 'from-red-600 via-orange-500 to-yellow-600',
    accentColor: 'text-orange-400'
  },
  { 
    path: '/quests', 
    icon: Sword, 
    label: 'Quests', 
    vertical: 'QUESTS',
    japanese: 'クエスト',
    topGradient: 'from-purple-600 via-purple-500 to-pink-500',
    bottomGradient: 'from-pink-600 via-purple-500 to-violet-600',
    accentColor: 'text-purple-400'
  },
  { 
    path: '/gates', 
    icon: Target, 
    label: 'Gates', 
    vertical: 'GATES',
    japanese: 'ゲート',
    topGradient: 'from-red-600 via-red-500 to-rose-500',
    bottomGradient: 'from-red-600 via-orange-500 to-rose-600',
    accentColor: 'text-red-400'
  },
]

function NavigationCards() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="group relative overflow-hidden rounded-lg bg-dark-900 border border-white/10 hover:border-white/30 transition-all duration-300"
          >
            <div className="aspect-[3/5] flex flex-col relative">
              {/* Vertical text on LEFT */}
              <div className="absolute top-6 left-3 z-30 flex flex-col gap-0.5">
                {item.vertical.split('').map((letter, i) => (
                  <span 
                    key={i} 
                    className="text-[10px] text-white/75 font-bold tracking-wider"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              {/* Japanese text on RIGHT (vertical) */}
              <div className="absolute top-5 right-2 z-30">
                <div className="writing-vertical text-[8px] text-white/50 tracking-wide">
                  {item.japanese}
                </div>
              </div>

              {/* Top colored gradient box */}
              <div className={`h-2/5 bg-gradient-to-b ${item.topGradient}`}>
                <div className="w-full h-full" />
              </div>

              {/* Middle frame area */}
              <div className="h-1/5 flex items-center justify-center relative bg-dark-800">
                {/* Outer border frame */}
                <div className="w-16 h-20 border-2 border-white/50 relative">
                  {/* Inner border */}
                  <div className="absolute inset-1 border border-white/35" />
                </div>
                
                {/* Corner connectors */}
                <div className="absolute left-24 top-1/3 h-12 w-3 border-l border-r border-white/40" />
              </div>

              {/* Bottom colored gradient box */}
              <div className={`h-2/5 bg-gradient-to-t ${item.bottomGradient}`}>
                <div className="w-full h-full" />
              </div>
            </div>

            {/* Bottom label bar */}
            <div className="absolute bottom-0 left-0 right-0 py-2 px-2 bg-gradient-to-r from-dark-800/95 to-dark-700/95 border-t border-white/10">
              <div className="flex items-center justify-center gap-1.5">
                <Icon className={`w-3 h-3 ${item.accentColor}`} />
                <span className="text-[11px] font-bold text-white">{item.label}</span>
              </div>
            </div>
          </NavLink>
        )
      })}
    </div>
  )
}

export default NavigationCards
