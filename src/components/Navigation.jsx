import { NavLink } from 'react-router-dom'
import { Home, Power, Flame, Sword, Target } from 'lucide-react'

const navItems = [
  { path: '/awakening', icon: Power, label: 'Awakening', japanese: '覚醒を超えて' },
  { path: '/habits', icon: Flame, label: 'Habits', japanese: '毎日の習慣' },
  { path: '/quests', icon: Sword, label: 'Quests', japanese: 'クエスト' },
  { path: '/gates', icon: Target, label: 'Gates', japanese: 'ゲート' },
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
            className="group relative overflow-hidden rounded-xl bg-dark-700 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="aspect-[3/4] p-4 flex flex-col items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-900/80" />
              
              <div className="absolute top-4 left-4 flex flex-col gap-1">
                {'AWAKENING'.split('').slice(0, item.label.length).map((letter, i) => (
                  <span key={i} className="text-xs text-white/60 font-medium">
                    {item.label[i]?.toUpperCase()}
                  </span>
                ))}
              </div>

              <div className="absolute top-4 right-4 text-right">
                <span className="text-xs text-white/40 writing-mode-vertical">
                  {item.japanese}
                </span>
              </div>

              <div className="relative z-10 mt-auto">
                <div className="w-16 h-20 bg-gradient-to-b from-purple-600/20 to-pink-600/20 rounded-lg border border-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-800">
              <div className="flex items-center justify-center gap-2">
                <Icon className="w-4 h-4 text-purple-400" />
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
