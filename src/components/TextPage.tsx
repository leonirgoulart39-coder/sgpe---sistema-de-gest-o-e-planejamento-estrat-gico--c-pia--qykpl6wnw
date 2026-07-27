import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit } from '@/services/collections'
import { EditableText } from '@/components/editable'
import { SectionHeader, PrintHeader } from '@/components/ui-helpers'
import type { Planejamento } from '@/types'

export function TextPage({
  section,
  title,
  subtitle,
}: {
  section: string
  title: string
  subtitle?: string
}) {
  const { items } = useCollection<Planejamento>('planejamento')
  const { role } = useAuth()
  const editable = canEdit(role as any, section)
  const fields = items.filter((i) => i.section === section)

  return (
    <div className="max-w-4xl mx-auto">
      <PrintHeader title={title} />
      <SectionHeader title={title} subtitle={subtitle} section={section} />
      <div className="space-y-6">
        {fields.map((field) => (
          <div
            key={field.id}
            className="bg-white rounded-xl border border-[#d8dde8] p-4 hover:border-[#b98a00]/30 transition-all duration-200 shadow-subtle"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7a8aaa] mb-2">
              {field.field_name}
            </label>
            <EditableText
              value={field.content || ''}
              disabled={!editable}
              multiline
              onSave={async (v) =>
                updateWithAudit('planejamento', field.id, 'content', v, section, field.content)
              }
            />
          </div>
        ))}
        {fields.length === 0 && (
          <div className="text-center py-12 text-sm text-[#7a8aaa]">
            Nenhum conteúdo encontrado.
          </div>
        )}
      </div>
    </div>
  )
}
