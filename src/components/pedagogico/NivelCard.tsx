import { useState } from 'react'
import { EditableText } from '@/components/editable'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { updateNivel, type PedagogicoNivel, type PedagogicoTag } from '@/services/pedagogico'
import { toast } from '@/hooks/use-toast'

interface NivelCardProps {
  nivel: PedagogicoNivel
  index: number
  onRefresh: () => void
}

const TAG_COLORS: Record<string, string> = {
  '#b98a00': 'bg-amber-100 text-amber-800 border-amber-300',
  '#3b82f6': 'bg-blue-100 text-blue-800 border-blue-300',
  '#10b981': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  '#8b5cf6': 'bg-violet-100 text-violet-800 border-violet-300',
  '#ec4899': 'bg-pink-100 text-pink-800 border-pink-300',
  '#6366f1': 'bg-indigo-100 text-indigo-800 border-indigo-300',
}

function getTagClass(color: string): string {
  return TAG_COLORS[color] || 'bg-slate-100 text-slate-800 border-slate-300'
}

function EditableTag({ tag, onSave }: { tag: PedagogicoTag; onSave: (newLabel: string) => void }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(tag.label)

  const handleSave = () => {
    setEditing(false)
    if (value !== tag.label) {
      onSave(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      setValue(tag.label)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto min-w-[100px] text-xs px-2"
      />
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'cursor-pointer text-xs hover:opacity-80 transition-opacity',
        getTagClass(tag.color),
      )}
      onClick={() => setEditing(true)}
    >
      {tag.label}
    </Badge>
  )
}

export function NivelCard({ nivel, index, onRefresh }: NivelCardProps) {
  const handleSaveField = async (field: string, newValue: unknown, oldValue?: unknown) => {
    try {
      await updateNivel(nivel.id, field, newValue, oldValue)
      onRefresh()
    } catch {
      toast({ title: 'Erro ao salvar', variant: 'destructive' })
    }
  }

  const handleTagLabelChange = async (tagIndex: number, newLabel: string) => {
    const newTags = [...nivel.tags]
    const oldTags = nivel.tags
    newTags[tagIndex] = { ...newTags[tagIndex], label: newLabel }
    try {
      await updateNivel(nivel.id, 'tags', newTags, oldTags)
      onRefresh()
    } catch {
      toast({ title: 'Erro ao salvar tag', variant: 'destructive' })
    }
  }

  const subniveisText = Array.isArray(nivel.subniveis) ? nivel.subniveis.join(' • ') : ''

  return (
    <div className="bg-white dark:bg-slate-900/50 border border-[#d2dce6] dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold tracking-wider text-[#b98a00] uppercase">
            Nível 0{index + 1}
          </span>
        </div>
        <div className="text-lg sm:text-xl font-bold text-[#1a2236] dark:text-slate-100">
          <EditableText
            value={nivel.nivel}
            onSave={(v) => handleSaveField('nivel', v, nivel.nivel)}
            className="text-lg sm:text-xl font-bold text-[#1a2236] dark:text-slate-100"
          />
        </div>
        {subniveisText && (
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            <EditableText
              value={subniveisText}
              onSave={(v) => {
                const newSubs = v
                  .split('•')
                  .map((s) => s.trim())
                  .filter(Boolean)
                handleSaveField('subniveis', newSubs, nivel.subniveis)
              }}
              className="text-sm text-slate-500 dark:text-slate-400 font-medium"
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {nivel.tags?.map((tag, i) => (
          <EditableTag key={i} tag={tag} onSave={(newLabel) => handleTagLabelChange(i, newLabel)} />
        ))}
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <EditableText
          value={nivel.descricao || ''}
          multiline
          onSave={(v) => handleSaveField('descricao', v, nivel.descricao)}
          className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
        />
      </div>
    </div>
  )
}
