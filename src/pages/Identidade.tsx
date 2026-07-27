import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit, createRecord, deleteRecord } from '@/services/collections'
import { EditableText } from '@/components/editable'
import { SectionHeader, PrintHeader, AddRowButton } from '@/components/ui-helpers'
import { Trash2, Plus } from 'lucide-react'
import type { Planejamento, ValorFundamental } from '@/types'

export default function Identidade() {
  const { items: plans } = useCollection<Planejamento>('planejamento')
  const { items: valores } = useCollection<ValorFundamental>('valores_fundamentais')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'identidade')
  const fields = plans.filter((p) => p.section === 'identidade')

  return (
    <div className="max-w-4xl mx-auto">
      <PrintHeader title="Identidade & Valores" />
      <SectionHeader
        title="Identidade & Valores"
        subtitle="Missão, visão e valores fundamentais"
        section="identidade"
      />

      <div className="space-y-4 mb-8">
        {fields.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-xl border border-[#d8dde8] p-4 hover:border-[#b98a00]/30 transition-all shadow-subtle"
          >
            <label className="block text-xs font-bold uppercase tracking-wider text-[#7a8aaa] mb-2">
              {f.field_name}
            </label>
            <EditableText
              value={f.content || ''}
              disabled={!editable}
              multiline
              onSave={async (v) =>
                updateWithAudit('planejamento', f.id, 'content', v, 'identidade', f.content)
              }
            />
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black text-[#1a2236]">Valores Fundamentais</h2>
        {editable && (
          <AddRowButton
            onClick={() =>
              createRecord('valores_fundamentais', { title: 'Novo Valor', description: '' })
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {valores.map((v) => (
          <div
            key={v.id}
            className="bg-white rounded-xl border border-[#d8dde8] p-4 hover:border-[#b98a00]/30 transition-all shadow-subtle group"
          >
            <div className="flex items-start justify-between mb-2">
              <EditableText
                value={v.title}
                disabled={!editable}
                className="font-bold text-sm"
                onSave={async (val) =>
                  updateWithAudit('valores_fundamentais', v.id, 'title', val, 'identidade', v.title)
                }
              />
              {editable && (
                <button
                  onClick={() => deleteRecord('valores_fundamentais', v.id)}
                  className="no-print opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <EditableText
              value={v.description || ''}
              disabled={!editable}
              className="text-xs"
              onSave={async (val) =>
                updateWithAudit(
                  'valores_fundamentais',
                  v.id,
                  'description',
                  val,
                  'identidade',
                  v.description,
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  )
}
