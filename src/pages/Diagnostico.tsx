import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit, createRecord, deleteRecord } from '@/services/collections'
import { EditableText } from '@/components/editable'
import { SectionHeader, PrintHeader } from '@/components/ui-helpers'
import { Trash2, Plus } from 'lucide-react'
import type { Planejamento, SwotItem } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const swotConfig = [
  {
    quadrant: 'forcas',
    label: 'FORÇAS',
    color: 'border-emerald-200/80 bg-emerald-50/40 hover:border-emerald-300',
  },
  {
    quadrant: 'fraquezas',
    label: 'FRAQUEZAS',
    color: 'border-rose-200/80 bg-rose-50/40 hover:border-rose-300',
  },
  {
    quadrant: 'oportunidades',
    label: 'OPORTUNIDADES',
    color: 'border-blue-200/80 bg-blue-50/40 hover:border-blue-300',
  },
  {
    quadrant: 'ameacas',
    label: 'AMEAÇAS',
    color: 'border-amber-200/80 bg-amber-50/40 hover:border-amber-300',
  },
] as const

export default function Diagnostico() {
  const { items: plans } = useCollection<Planejamento>('planejamento')
  const { items: swots } = useCollection<SwotItem>('swot_items')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'diagnostico')
  const fields = plans.filter((p) => p.section === 'diagnostico')

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <PrintHeader title="Diagnóstico Estratégico" />
      <SectionHeader
        title="Diagnóstico Estratégico"
        subtitle="Análise de contexto, mercado e concorrência"
        section="diagnostico"
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
                updateWithAudit('planejamento', f.id, 'content', v, 'diagnostico', f.content)
              }
            />
          </div>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-black text-[#1a2236] tracking-tight">Análise SWOT</h2>
        {editable && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#b98a00] hover:text-[#967100] hover:bg-[#b98a00]/10 font-bold text-xs gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {swotConfig.map((cfg) => (
                <DropdownMenuItem
                  key={cfg.quadrant}
                  onClick={() =>
                    createRecord('swot_items', {
                      quadrant: cfg.quadrant,
                      text: 'Novo item',
                    })
                  }
                  className="text-xs cursor-pointer font-medium"
                >
                  + {cfg.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {swotConfig.map((cfg) => {
          const quadrantItems = swots.filter((s) => s.quadrant === cfg.quadrant)

          return (
            <div
              key={cfg.quadrant}
              className={`rounded-2xl border ${cfg.color} p-5 sm:p-6 transition-all shadow-sm flex flex-col justify-between min-h-[220px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#1a2236]">
                    {cfg.label}
                  </h3>
                  {editable && (
                    <button
                      onClick={() =>
                        createRecord('swot_items', {
                          quadrant: cfg.quadrant,
                          text: 'Novo item',
                        })
                      }
                      title={`Adicionar item em ${cfg.label}`}
                      className="no-print text-xs font-bold text-[#b98a00] hover:text-[#967100] flex items-center gap-1 transition-opacity opacity-80 hover:opacity-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3 w-full">
                  {quadrantItems.length === 0 ? (
                    <p className="text-xs italic text-[#7a8aaa] py-3">
                      Nenhum item adicionado a este quadrante.
                    </p>
                  ) : (
                    quadrantItems.map((s) => (
                      <div
                        key={s.id}
                        className="flex items-start gap-2 group w-full p-2 rounded-xl hover:bg-white/70 transition-colors border border-transparent hover:border-black/5"
                      >
                        <div className="flex-1 w-full min-w-0">
                          <EditableText
                            value={s.text}
                            disabled={!editable}
                            multiline
                            className="text-xs sm:text-sm font-normal text-[#1a2236] leading-relaxed w-full"
                            onSave={async (v) =>
                              updateWithAudit('swot_items', s.id, 'text', v, 'diagnostico', s.text)
                            }
                          />
                        </div>
                        {editable && (
                          <button
                            onClick={() => deleteRecord('swot_items', s.id)}
                            title="Excluir item"
                            className="no-print opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-all p-1 mt-0.5 rounded hover:bg-rose-100/50 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
