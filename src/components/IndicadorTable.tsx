import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { formatIndicador } from '@/types/dashboard'
import type { DashboardIndicador } from '@/types/dashboard'
import { updateIndicador } from '@/services/dashboard-indicadores'

interface IndicadorTableProps {
  items: DashboardIndicador[]
  loading: boolean
  error: Error | null
  onUpdate: (updated: DashboardIndicador) => void
}

function EditableCell({
  indicador,
  onUpdate,
}: {
  indicador: DashboardIndicador
  onUpdate: (updated: DashboardIndicador) => void
}) {
  const [editing, setEditing] = useState(false)
  const [localValue, setLocalValue] = useState(String(indicador.valor))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(String(indicador.valor))
  }, [indicador.valor])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  const handleSave = async () => {
    const num = parseFloat(localValue.replace(',', '.'))
    if (isNaN(num)) {
      setError(true)
      setEditing(false)
      setLocalValue(String(indicador.valor))
      return
    }
    if (num === indicador.valor) {
      setEditing(false)
      return
    }
    setSaving(true)
    setError(false)
    try {
      const updated = await updateIndicador(indicador.id, num)
      onUpdate(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    } catch {
      setError(true)
      setLocalValue(String(indicador.valor))
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="number"
        value={localValue}
        disabled={saving}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSave()
          if (e.key === 'Escape') {
            setLocalValue(String(indicador.valor))
            setEditing(false)
          }
        }}
        className="w-full bg-transparent rounded-md px-2 py-1 text-sm font-semibold text-foreground tabular-nums border border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className={cn(
        'inline-flex items-center gap-1.5 cursor-text rounded-md px-2 py-1 transition-colors',
        saved ? 'bg-success/10' : error ? 'text-destructive' : 'hover:bg-accent/5',
      )}
    >
      <span className="text-sm font-semibold text-foreground tabular-nums">
        {formatIndicador(indicador.valor, indicador.formato)}
      </span>
      {saved && <Check className="w-3.5 h-3.5 text-success" />}
    </button>
  )
}

export function IndicadorTable({ items, loading, error, onUpdate }: IndicadorTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
        <Skeleton className="h-4 w-40 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-destructive/30 p-4 shadow-subtle">
        <p className="text-sm font-bold text-destructive">
          Não foi possível carregar os indicadores
        </p>
        <p className="text-xs text-muted-foreground mt-1">{error.message}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
      <h2 className="text-sm font-black text-[#1a2236] mb-3">Indicadores Estratégicos</h2>
      <Table>
        <TableHeader>
          <TableRow className="border-[#d8dde8]">
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Indicador
            </TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">
              Valor
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} className="border-[#d8dde8]/50">
              <TableCell className="text-sm font-medium text-[#1a2236] py-3">{item.nome}</TableCell>
              <TableCell className="text-right py-3">
                <EditableCell indicador={item} onUpdate={onUpdate} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
