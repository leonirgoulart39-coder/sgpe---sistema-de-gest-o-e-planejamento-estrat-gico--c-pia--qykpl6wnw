import { useState, useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface EditableTextProps {
  value: string
  disabled?: boolean
  className?: string
  onSave: (value: string) => Promise<void>
}

export function EditableText({ value, disabled, className, onSave }: EditableTextProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(draft)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  if (disabled) {
    return <span className={className}>{value || '—'}</span>
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') {
              setEditing(false)
              setDraft(value)
            }
          }}
          className={cn(
            'w-full px-1.5 py-1 text-xs border border-[#b98a00] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#b98a00]',
            className,
          )}
        />
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-green-600 hover:text-green-700 shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setEditing(false)
            setDraft(value)
          }}
          className="text-rose-500 hover:text-rose-600 shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn(
        'cursor-pointer hover:bg-amber-50 rounded px-1.5 py-0.5 inline-block min-w-[40px] transition-colors',
        className,
      )}
    >
      {value || '—'}
    </span>
  )
}

interface EditableNumberProps {
  value: number
  disabled?: boolean
  prefix?: string
  suffix?: string
  onChange?: (value: number) => void
  onSave: (value: number) => Promise<void>
  className?: string
}

export function EditableNumber({
  value,
  disabled,
  prefix,
  suffix,
  onChange,
  onSave,
  className,
}: EditableNumberProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!editing) setDraft(String(value))
  }, [value, editing])

  const handleSave = async () => {
    const num = parseFloat(draft.replace(',', '.')) || 0
    setSaving(true)
    try {
      await onSave(num)
    } finally {
      setSaving(false)
      setEditing(false)
    }
  }

  const fmtDisplay = (v: number) => {
    const parts: string[] = []
    if (prefix) parts.push(prefix)
    parts.push(v.toLocaleString('pt-BR', { maximumFractionDigits: 2 }))
    if (suffix) parts.push(suffix)
    return parts.join(' ')
  }

  if (disabled) {
    return <span className={className}>{fmtDisplay(value)}</span>
  }

  if (editing) {
    return (
      <div className="flex items-center gap-1 justify-end">
        {prefix && <span className="text-xs text-slate-500">{prefix}</span>}
        <input
          autoFocus
          type="number"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            const num = parseFloat(e.target.value.replace(',', '.')) || 0
            onChange?.(num)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') {
              setEditing(false)
              setDraft(String(value))
            }
          }}
          className={cn(
            'w-20 px-1.5 py-1 text-xs text-right border border-[#b98a00] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#b98a00]',
            className,
          )}
        />
        {suffix && <span className="text-xs text-slate-500">{suffix}</span>}
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-green-600 hover:text-green-700 shrink-0"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => {
            setEditing(false)
            setDraft(String(value))
          }}
          className="text-rose-500 hover:text-rose-600 shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={cn(
        'cursor-pointer hover:bg-amber-50 rounded px-1.5 py-0.5 inline-block transition-colors',
        className,
      )}
    >
      {fmtDisplay(value)}
    </span>
  )
}

export function CalcOutput({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <span className={cn('tabular-nums transition-all duration-300', className)}>{children}</span>
  )
}
