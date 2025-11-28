import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, Sword, Flame, Target, Award, Gift, Power } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/awakening', icon: Power, label: 'Awakening' },
  { path: '/habits', icon: Flame, label: 'Habits' },
  { path: '/quests', icon: Sword, label: 'Quests' },
  { path: '/gates', icon: Target, label: 'Gates' },
  { path: '/rewards', icon: Gift, label: 'Rewards' },
]

function Layout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-900">
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-lg border-t border-white/10 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around md:justify-center md:gap-8 h-16">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'text-accent-purple' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : ''}`} />
                  <span className="text-xs font-medium hidden md:block">{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        </div>
      </nav>
      
      <main className="pb-20 md:pt-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
