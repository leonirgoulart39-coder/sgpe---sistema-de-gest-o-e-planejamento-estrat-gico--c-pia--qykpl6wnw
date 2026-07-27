import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/use-auth'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminRoute } from '@/components/AdminRoute'
import Layout from '@/components/Layout'
import { Toaster } from '@/components/ui/toaster'
import Login from '@/pages/Login'
import Index from '@/pages/Index'
import Diagnostico from '@/pages/Diagnostico'
import Identidade from '@/pages/Identidade'
import Modelo from '@/pages/Modelo'
import Pedagogico from '@/pages/Pedagogico'
import Equipe from '@/pages/Equipe'
import Capex from '@/pages/Capex'
import Dre from '@/pages/Dre'
import Regulamentacao from '@/pages/Regulamentacao'
import Roadmap from '@/pages/Roadmap'
import Captacao from '@/pages/Captacao'
import Proximos from '@/pages/Proximos'
import Admin from '@/pages/Admin'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/diagnostico" element={<Diagnostico />} />
                <Route path="/identidade" element={<Identidade />} />
                <Route path="/modelo" element={<Modelo />} />
                <Route path="/pedagogico" element={<Pedagogico />} />
                <Route path="/equipe" element={<Equipe />} />
                <Route path="/capex" element={<Capex />} />
                <Route path="/dre" element={<Dre />} />
                <Route path="/regulamentacao" element={<Regulamentacao />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/captacao" element={<Captacao />} />
                <Route path="/proximos" element={<Proximos />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
