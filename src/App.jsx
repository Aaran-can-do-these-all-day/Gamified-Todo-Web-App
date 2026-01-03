import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Quests from './pages/Quests'
import Habits from './pages/Habits'
import Gates from './pages/Gates'
import Awakening from './pages/Awakening'
import Rewards from './pages/Rewards'
import Equippables from './pages/Equippables'
import Navigation from './pages/Navigation'
import HabitEnhancementsDemo from './components/HabitEnhancementsDemo'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="navigation" element={<Navigation />} />
          <Route path="quests" element={<Quests />} />
          <Route path="habits" element={<Habits />} />
          <Route path="habit-demo" element={<HabitEnhancementsDemo />} />
          <Route path="gates" element={<Gates />} />
          <Route path="awakening" element={<Awakening />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="equippables" element={<Equippables />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
