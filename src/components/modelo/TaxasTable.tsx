import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EditableText } from '@/components/editable'
import type { Planejamento } from '@/types'
import {
  updatePlanejamentoItem,
  createPlanejamentoItem,
  deletePlanejamentoItem,
} from '@/services/modelo'
import { toast } from '@/hooks/use-toast'

interface TaxasTableProps {
  taxas: Planejamento[]
  onRefresh: () => void
}

export function TaxasTable({ taxas, onRefresh }: TaxasTableProps) {
  const [adding, setAdding] = useState(false)

  const handleUpdate = async (id: string, field: 'field_name' | 'content', value: string) => {
    try {
      await updatePlanejamentoItem(id, { [field]: value })
    } catch (err) {
      toast({ title: 'Erro ao atualizar item', variant: 'destructive' })
    }
  }

  const handleAddRow = async () => {
    try {
      setAdding(true)
      await createPlanejamentoItem({
        section: 'taxas_royalties',
        field_name: 'Novo Item',
        content: 'Valor',
      })
      onRefresh()
      toast({ title: 'Item adicionado com sucesso' })
    } catch {
      toast({ title: 'Erro ao adicionar item', variant: 'destructive' })
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteRow = async (id: string) => {
    try {
      await deletePlanejamentoItem(id)
      onRefresh()
      toast({ title: 'Item removido' })
    } catch {
      toast({ title: 'Erro ao remover item', variant: 'destructive' })
    }
  }

  return (
    <div className="bg-white dark:bg-card border border-[#d8dde8] dark:border-border rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[#9a7000] dark:text-[#d4af37] uppercase flex items-center gap-2">
            <span>💰</span> ESTRUTURA DE TAXAS E ROYALTIES
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddRow}
            disabled={adding}
            className="h-8 text-xs text-[#9a7000] hover:text-[#7a5500] hover:bg-[#b98a00]/10"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-border text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-1 font-medium w-3/5">ITEM</th>
                <th className="pb-3 px-1 font-medium text-right w-2/5">VALOR</th>
                <th className="pb-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2f7] dark:divide-border text-sm">
              {taxas.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-1 align-middle">
                    <EditableText
                      value={item.field_name}
                      onSave={async (v) => handleUpdate(item.id, 'field_name', v)}
                      className="text-[#2d3748] dark:text-slate-200 font-medium py-1"
                    />
                  </td>
                  <td className="py-2.5 px-1 align-middle text-right">
                    <EditableText
                      value={item.content}
                      onSave={async (v) => handleUpdate(item.id, 'content', v)}
                      className="text-[#1a202c] dark:text-slate-100 font-bold text-right py-1"
                    />
                  </td>
                  <td className="py-2.5 pl-1 align-middle text-right">
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all p-1"
                      title="Excluir item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {taxas.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
                    Nenhuma taxa configurada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
