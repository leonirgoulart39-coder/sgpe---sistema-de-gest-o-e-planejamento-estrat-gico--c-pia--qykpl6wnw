import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/Sidebar'

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 xl:ml-[272px] p-4 sm:p-6 lg:p-8 animate-fade-in">
        <Outlet />
      </main>
    </div>
  )
}
