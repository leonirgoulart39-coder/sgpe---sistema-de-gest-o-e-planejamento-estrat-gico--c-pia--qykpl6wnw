import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { WifiOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProtectedRoute() {
  const { isAuthenticated, loading, networkError, retryAuth } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (networkError && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="text-center max-w-sm">
          <WifiOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">Erro de conexão</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.
          </p>
          <Button onClick={retryAuth} variant="default" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
