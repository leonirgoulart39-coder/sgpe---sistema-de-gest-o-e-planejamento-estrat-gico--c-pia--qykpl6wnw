import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditableText } from '@/components/editable'
import type { ModeloFonteReceita } from '@/types'
import { updateFonteReceita, createFonteReceita, deleteFonteReceita } from '@/services/modelo'
import { toast } from '@/hooks/use-toast'

interface FontesReceitaListProps {
  fontes: ModeloFonteReceita[]
  onRefresh: () => void
}

const tagColorStyles: Record<string, string> = {
  emerald:
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  amber:
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  indigo:
    'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
  pink: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800',
}

export function FontesReceitaList({ fontes, onRefresh }: FontesReceitaListProps) {
  const [adding, setAdding] = useState(false)

  const handleUpdate = async (id: string, field: keyof ModeloFonteReceita, value: string) => {
    try {
      await updateFonteReceita(id, { [field]: value })
    } catch {
      toast({ title: 'Erro ao atualizar fonte de receita', variant: 'destructive' })
    }
  }

  const handleAdd = async () => {
    try {
      setAdding(true)
      await createFonteReceita({
        titulo: 'Nova Fonte',
        descricao: 'Descrição da fonte de receita...',
        tag_label: 'ADICIONAL',
        tag_color: 'indigo',
        bullet_color: '#3b82f6',
        ordem: fontes.length + 1,
      })
      onRefresh()
      toast({ title: 'Fonte de receita criada' })
    } catch {
      toast({ title: 'Erro ao criar fonte de receita', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteFonteReceita(id)
      onRefresh()
      toast({ title: 'Fonte de receita removida' })
    } catch {
      toast({ title: 'Erro ao remover fonte de receita', variant: 'destructive' })
    }
  }

  return (
    <div className="bg-white dark:bg-card border border-[#d8dde8] dark:border-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[#9a7000] dark:text-[#d4af37] uppercase flex items-center gap-2">
            <span>👔</span> FONTES DE RECEITA DO FRANQUEADO
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAdd}
            disabled={adding}
            className="h-8 text-xs text-[#9a7000] hover:text-[#7a5500] hover:bg-[#b98a00]/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4 divide-y divide-[#edf2f7] dark:divide-border">
          {fontes.map((item, index) => {
            const badgeStyle =
              tagColorStyles[item.tag_color] ||
              'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'

            return (
              <div
                key={item.id}
                className={`group flex items-start justify-between gap-3 ${
                  index > 0 ? 'pt-4' : ''
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: item.bullet_color || '#b98a00' }}
                  />
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <EditableText
                      value={item.titulo}
                      onSave={async (v) => handleUpdate(item.id, 'titulo', v)}
                      className="font-bold text-sm text-[#2d3748] dark:text-slate-100 py-0.5"
                    />
                    <EditableText
                      value={item.descricao}
                      multiline
                      onSave={async (v) => handleUpdate(item.id, 'descricao', v)}
                      className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-0.5"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <div
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md border uppercase tracking-wider ${badgeStyle}`}
                  >
                    <EditableText
                      value={item.tag_label}
                      onSave={async (v) => handleUpdate(item.id, 'tag_label', v)}
                      className="bg-transparent border-none p-0 text-center font-bold text-[10px] uppercase w-20 focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                    title="Excluir fonte"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}

          {fontes.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhuma fonte de receita cadastrada.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
