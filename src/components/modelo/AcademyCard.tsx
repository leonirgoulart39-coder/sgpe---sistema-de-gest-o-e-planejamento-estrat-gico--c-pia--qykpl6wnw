import { EditableText } from '@/components/editable'
import type { Planejamento } from '@/types'
import { updatePlanejamentoItem } from '@/services/modelo'
import { toast } from '@/hooks/use-toast'

interface AcademyCardProps {
  academyInfo: Planejamento | null
  onRefresh: () => void
}

export function AcademyCard({ academyInfo, onRefresh }: AcademyCardProps) {
  const handleSave = async (content: string) => {
    if (!academyInfo) return
    try {
      await updatePlanejamentoItem(academyInfo.id, { content })
      onRefresh()
    } catch {
      toast({ title: 'Erro ao salvar informações da Academy', variant: 'destructive' })
    }
  }

  const renderFormattedText = (text: string) => {
    const target = '+80 videoaulas e 30 módulos'
    if (!text.includes(target)) {
      return text
    }

    const parts = text.split(target)
    return (
      <>
        {parts[0]}
        <strong className="text-[#1a365d] dark:text-blue-400 font-bold">{target}</strong>
        {parts[1]}
      </>
    )
  }

  return (
    <div className="bg-[#f0f4f9] dark:bg-slate-900/60 border border-[#d2dce6] dark:border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm">
      <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[#1a365d] dark:text-blue-400 uppercase flex items-center gap-2 mb-3">
        <span>🎓</span> LEGACY FRANCHISE ACADEMY
      </h2>

      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <EditableText
          value={academyInfo?.content || ''}
          multiline
          onSave={handleSave}
          className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-normal bg-transparent"
        />
      </div>
    </div>
  )
}
