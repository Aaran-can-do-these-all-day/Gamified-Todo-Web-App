import { NavLink } from 'react-router-dom'
import { Power, Flame, Sword, Target } from 'lucide-react'

const navItems = [
  { 
    path: '/awakening', 
    icon: Power, 
    label: 'Awakening', 
    vertical: 'AWAKENING',
    japanese: '限界を超えで',
    topGradient: 'from-blue-600/60 via-blue-500/40 to-cyan-500/30',
    bottomGradient: 'from-cyan-600/60 via-teal-500/40 to-blue-500/30',
    bottomBarGradient: 'from-blue-600/80 to-cyan-600/80',
    borderColor: 'border-cyan-500/30',
    iconColor: 'text-cyan-400'
  },
  { 
    path: '/habits', 
    icon: Flame, 
    label: 'Habits', 
    vertical: 'HABITS',
    japanese: '毎日の習慣',
    topGradient: 'from-orange-600/60 via-orange-500/40 to-yellow-500/30',
    bottomGradient: 'from-red-600/60 via-orange-500/40 to-yellow-500/30',
    bottomBarGradient: 'from-orange-600/80 to-red-600/80',
    borderColor: 'border-orange-500/30',
    iconColor: 'text-orange-400'
  },
  { 
    path: '/quests', 
    icon: Sword, 
    label: 'Quests', 
    vertical: 'QUESTS',
    japanese: 'クエスト',
    topGradient: 'from-purple-600/60 via-purple-500/40 to-pink-500/30',
    bottomGradient: 'from-pink-600/60 via-purple-500/40 to-violet-500/30',
    bottomBarGradient: 'from-purple-600/80 to-pink-600/80',
    borderColor: 'border-purple-500/30',
    iconColor: 'text-purple-400'
  },
  { 
    path: '/gates', 
    icon: Target, 
    label: 'Gates', 
    vertical: 'GATES',
    japanese: 'ゲート',
    topGradient: 'from-red-600/60 via-red-500/40 to-rose-500/30',
    bottomGradient: 'from-rose-600/60 via-red-500/40 to-orange-500/30',
    bottomBarGradient: 'from-red-600/80 to-rose-600/80',
    borderColor: 'border-red-500/30',
    iconColor: 'text-red-400'
  },
]

function NavigationCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`group relative overflow-hidden rounded-2xl bg-dark-800/90 border ${item.borderColor} hover:border-white/40 transition-all duration-300`}
          >
            <div className="aspect-[3/5] flex flex-col relative">
              <div className="absolute top-4 left-3 z-20 flex flex-col gap-0.5">
                {item.vertical.split('').map((letter, i) => (
                  <span key={i} className="text-[10px] text-white/80 font-bold tracking-wider">
                    {letter}
                  </span>
                ))}
              </div>

              <div className="absolute top-4 right-3 z-20">
                <div className="writing-vertical text-[10px] text-white/60 tracking-wider font-medium">
                  {item.japanese}
                </div>
              </div>

              <div className="flex-1 flex flex-col relative">
                <div className={`h-1/3 bg-gradient-to-br ${item.topGradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-dark-800/80" />
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 w-px h-full bg-white/20" />
                  
                  <div className="absolute left-1/2 -translate-x-[calc(50%+20px)] top-0 bottom-0 w-px bg-white/30" />
                  <div className="absolute left-1/2 translate-x-[calc(-50%+20px)] top-0 bottom-0 w-px bg-white/30" />
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-px bg-white/30" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-12 h-px bg-white/30" />
                </div>

                <div className={`h-1/3 bg-gradient-to-tr ${item.bottomGradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-dark-800/80" />
                </div>
              </div>
            </div>

            <div className={`absolute bottom-0 left-0 right-0 py-2.5 px-4 bg-gradient-to-r ${item.bottomBarGradient}`}>
              <div className="flex items-center justify-center gap-2">
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
            </div>
          </NavLink>
        )
      })}
    </div>
  )
}

export default NavigationCards
