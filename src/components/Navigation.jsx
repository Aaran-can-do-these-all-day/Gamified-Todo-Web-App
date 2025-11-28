import { NavLink } from 'react-router-dom'
import { Power, Flame, Sword, Target } from 'lucide-react'

const navItems = [
  { 
    path: '/awakening', 
    icon: Power, 
    label: 'Awakening', 
    vertical: 'AWAKENING',
    japanese: '限界を超えで',
    topColor: 'bg-gradient-to-br from-blue-500/60 via-cyan-500/40 to-cyan-600/20',
    bottomColor: 'bg-gradient-to-tr from-cyan-500/60 via-teal-500/40 to-blue-600/20',
    barGradient: 'from-cyan-600 to-blue-600',
    accentColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/40'
  },
  { 
    path: '/habits', 
    icon: Flame, 
    label: 'Habits', 
    vertical: 'HABITS',
    japanese: '毎日の習慣',
    topColor: 'bg-gradient-to-br from-orange-500/60 via-amber-500/40 to-yellow-600/20',
    bottomColor: 'bg-gradient-to-tr from-red-500/60 via-orange-500/40 to-amber-600/20',
    barGradient: 'from-orange-600 to-red-600',
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-500/40'
  },
  { 
    path: '/quests', 
    icon: Sword, 
    label: 'Quests', 
    vertical: 'QUESTS',
    japanese: 'クエスト',
    topColor: 'bg-gradient-to-br from-purple-500/60 via-purple-400/40 to-violet-600/20',
    bottomColor: 'bg-gradient-to-tr from-pink-500/60 via-purple-500/40 to-violet-600/20',
    barGradient: 'from-purple-600 to-pink-600',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40'
  },
  { 
    path: '/gates', 
    icon: Target, 
    label: 'Gates', 
    vertical: 'GATES',
    japanese: 'ゲート',
    topColor: 'bg-gradient-to-br from-red-500/60 via-rose-500/40 to-red-600/20',
    bottomColor: 'bg-gradient-to-tr from-rose-500/60 via-red-500/40 to-orange-600/20',
    barGradient: 'from-red-600 to-rose-600',
    accentColor: 'text-red-400',
    borderColor: 'border-red-500/40'
  },
]

function NavigationCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`group relative overflow-hidden rounded-xl bg-dark-900/60 border ${item.borderColor} hover:border-white/30 transition-all duration-300`}
          >
            <div className="aspect-[3/5] flex flex-col relative">
              {/* Vertical text left side */}
              <div className="absolute top-4 left-3 z-30 flex flex-col gap-0.5">
                {item.vertical.split('').map((letter, i) => (
                  <span 
                    key={i} 
                    className="text-[9px] text-white/70 font-bold tracking-wider leading-tight"
                  >
                    {letter}
                  </span>
                ))}
              </div>

              {/* Vertical Japanese text right side */}
              <div className="absolute top-3 right-2 z-30">
                <div className="writing-vertical text-[8px] text-white/50 tracking-wider font-medium leading-relaxed">
                  {item.japanese}
                </div>
              </div>

              {/* Top gradient box */}
              <div className={`h-[35%] ${item.topColor} border-b border-white/20 relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900/50" />
              </div>

              {/* Center frame area */}
              <div className="h-[30%] flex items-center justify-center relative">
                {/* Outer border lines */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-white/30" />
                <div className="absolute right-4 top-4 bottom-4 w-px bg-white/30" />
                
                {/* Inner border lines */}
                <div className="absolute left-6 top-4 bottom-4 w-px bg-white/20" />
                <div className="absolute right-6 top-4 bottom-4 w-px bg-white/20" />
                
                {/* Horizontal corner lines */}
                <div className="absolute left-4 right-4 top-4 h-px bg-white/30" />
                <div className="absolute left-4 right-4 bottom-4 h-px bg-white/30" />
                
                {/* Center vertical line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/25" />
              </div>

              {/* Bottom gradient box */}
              <div className={`h-[35%] ${item.bottomColor} border-t border-white/20 relative flex items-center justify-center`}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-dark-900/50" />
              </div>
            </div>

            {/* Bottom label bar */}
            <div className={`absolute bottom-0 left-0 right-0 py-2.5 px-4 bg-gradient-to-r ${item.barGradient} border-t border-white/10`}>
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 ${item.accentColor}`} />
                <span className="text-sm font-bold text-white">{item.label}</span>
              </div>
            </div>
          </NavLink>
        )
      })}
    </div>
  )
}

export default NavigationCards
