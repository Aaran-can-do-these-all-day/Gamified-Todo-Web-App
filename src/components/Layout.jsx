import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div className="min-h-screen bg-dark-900">
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
