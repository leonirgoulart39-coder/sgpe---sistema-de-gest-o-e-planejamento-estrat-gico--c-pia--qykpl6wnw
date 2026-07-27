import { EditableText } from '@/components/editable'
import { updateParceria, type PedagogicoParceria } from '@/services/pedagogico'
import { toast } from '@/hooks/use-toast'
import { Globe } from 'lucide-react'

interface ParceriaCardProps {
  parceria: PedagogicoParceria
  onRefresh: () => void
}

export function ParceriaCard({ parceria, onRefresh }: ParceriaCardProps) {
  const handleSave = async (field: string, newValue: string, oldValue?: string) => {
    try {
      await updateParceria(parceria.id, field, newValue, oldValue)
      onRefresh()
    } catch {
      toast({ title: 'Erro ao salvar parceria', variant: 'destructive' })
    }
  }

  return (
    <div className="bg-[#f0f4f9] dark:bg-slate-900/60 border border-[#d2dce6] dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-3 animate-fade-in-up">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-[#b98a00] flex-shrink-0" />
        <div className="text-base sm:text-lg font-bold text-[#1a2236] dark:text-slate-100 flex-1">
          <EditableText
            value={parceria.titulo}
            onSave={(v) => handleSave('titulo', v, parceria.titulo)}
            className="text-base sm:text-lg font-bold text-[#1a2236] dark:text-slate-100"
          />
        </div>
      </div>

      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <EditableText
          value={parceria.descricao || ''}
          multiline
          onSave={(v) => handleSave('descricao', v, parceria.descricao)}
          className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
        />
      </div>
    </div>
  )
}
