import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <div className="text-center max-w-md px-4">
        <h1 className="text-5xl font-black text-[#1a2236] mb-3 font-display">404</h1>
        <p className="text-base text-[#7a8aaa] mb-6">Oops! Página não encontrada.</p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[#1E2D6E] text-white rounded-xl text-xs font-bold hover:bg-[#2E4A8E] transition-all"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
