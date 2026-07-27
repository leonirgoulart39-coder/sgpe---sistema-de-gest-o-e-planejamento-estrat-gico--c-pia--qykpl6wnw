import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { ReactNode } from 'react'

interface SectionCardProps {
  loading?: boolean
  error?: Error | null
  onRetry?: () => void
  skeleton?: ReactNode
  children: ReactNode
}

export function SectionCard({ loading, error, onRetry, skeleton, children }: SectionCardProps) {
  if (loading) {
    return (
      <>
        {skeleton || (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        )}
      </>
    )
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg border border-destructive/30 p-4 shadow-subtle">
        <div className="flex items-start gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground font-display">Erro ao carregar dados</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-sans">
              Não foi possível carregar este bloco. Verifique sua conexão e tente novamente.
            </p>
          </div>
        </div>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="text-xs">
            <RotateCcw className="w-3 h-3 mr-1" />
            Tentar novamente
          </Button>
        )}
      </div>
    )
  }

  return <>{children}</>
}
