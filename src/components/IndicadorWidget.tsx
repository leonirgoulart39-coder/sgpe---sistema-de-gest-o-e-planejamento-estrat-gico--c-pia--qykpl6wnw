import { useState, useRef, useEffect } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatIndicador } from '@/types/dashboard'
import type { DashboardIndicador } from '@/types/dashboard'
import { updateIndicador } from '@/services/dashboard-indicadores'

interface IndicadorWidgetProps {
  indicador: DashboardIndicador
  onUpdate: (updated: DashboardIndicador) => void
}

export function IndicadorWidget({ indicador, onUpdate }: IndicadorWidgetProps) {
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

  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-4 transition-all duration-200 shadow-subtle',
        saved
          ? 'border-accent/50 ring-2 ring-accent/20'
          : error
            ? 'border-destructive/50'
            : 'border-border hover:border-accent/30',
      )}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
        {indicador.nome}
      </p>
      <div className="mt-1">
        {editing ? (
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
            className="w-full bg-transparent rounded-lg px-2 py-1 text-2xl font-extrabold text-foreground tabular-nums font-display border border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 cursor-text text-left"
          >
            <p className="text-2xl font-extrabold text-foreground tabular-nums font-display">
              {formatIndicador(indicador.valor, indicador.formato)}
            </p>
            {saved && <Check className="w-4 h-4 text-success" />}
          </button>
        )}
      </div>
      {error && <p className="text-[10px] text-destructive mt-0.5 font-sans">Erro ao salvar</p>}
    </div>
  )
}
