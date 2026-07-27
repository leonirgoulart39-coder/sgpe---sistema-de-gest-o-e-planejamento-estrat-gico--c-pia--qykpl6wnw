import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit, createRecord, deleteRecord } from '@/services/collections'
import { EditableText, EditableNumber, CalcOutput } from '@/components/editable'
import { SectionHeader, PrintHeader, MetricCard, AddRowButton } from '@/components/ui-helpers'
import {
  calcCapexItemTotal,
  calcCapexBlockSubtotal,
  calcCapexSemContingencia,
  calcContingencia,
  calcCapexTotal,
  calcLegalizacaoTotal,
  fmtBRL,
} from '@/lib/calculations'
import { Trash2 } from 'lucide-react'
import type { CapexItem, CapexParametro, RegularizacaoEtapa } from '@/types'

const blocks = [
  { key: 'obra', label: 'Obra & Reforma' },
  { key: 'equipamentos', label: 'Equipamentos' },
  { key: 'franquia', label: 'Franquia' },
  { key: 'giro', label: 'Capital de Giro' },
] as const

export default function Capex() {
  const { items: capexItems } = useCollection<CapexItem>('capex_itens')
  const { items: capexParams } = useCollection<CapexParametro>('capex_parametros')
  const { items: etapas } = useCollection<RegularizacaoEtapa>('regularizacao_etapas', 'ordem')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'capex')
  const contPct = capexParams[0]?.contingencia_pct || 10
  const semCont = calcCapexSemContingencia(capexItems)
  const contigencia = calcContingencia(semCont, contPct)
  const legalCost = calcLegalizacaoTotal(etapas)
  const total = calcCapexTotal(capexItems, contPct, legalCost)

  return (
    <div className="max-w-6xl mx-auto">
      <PrintHeader title="CAPEX Detalhado" />
      <SectionHeader
        title="CAPEX Detalhado"
        subtitle="Investimento, contingência e total"
        section="capex"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Subtotal" value={fmtBRL(semCont)} sub="Sem contingência" />
        <MetricCard
          label="Contingência"
          value={fmtBRL(contigencia)}
          sub={`${contPct.toFixed(1)}%`}
        />
        <MetricCard label="Legalização" value={fmtBRL(legalCost)} sub="Custos de legalização" />
        <MetricCard label="CAPEX Total" value={fmtBRL(total)} sub="Investimento total" />
      </div>

      <div className="space-y-6">
        {blocks.map((block) => {
          const items = capexItems.filter((i) => i.block === block.key)
          const sub = calcCapexBlockSubtotal(capexItems, block.key)
          return (
            <div
              key={block.key}
              className="bg-white rounded-xl border border-[#d8dde8] overflow-hidden shadow-subtle"
            >
              <div className="flex items-center justify-between p-3 border-b border-[#d8dde8]">
                <h2 className="text-sm font-black text-[#1a2236]">{block.label}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-[#b98a00]">{fmtBRL(sub)}</span>
                  {editable && (
                    <AddRowButton
                      onClick={() =>
                        createRecord('capex_itens', {
                          block: block.key,
                          descricao: 'Novo item',
                          qtd: 1,
                          custo_unitario: 1000,
                        })
                      }
                    />
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#7a8aaa] font-bold uppercase tracking-wider">
                      <th className="py-2 px-2 text-left text-[10px]">Descrição</th>
                      <th className="py-2 px-2 text-right text-[10px]">Qtd</th>
                      <th className="py-2 px-2 text-right text-[10px]">Custo Unit.</th>
                      <th className="py-2 px-2 text-right text-[10px]">Total</th>
                      {editable && <th className="no-print"></th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d8dde8]/60">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-1.5 px-2">
                          <EditableText
                            value={item.descricao}
                            disabled={!editable}
                            className="text-xs font-bold"
                            onSave={async (v) =>
                              updateWithAudit(
                                'capex_itens',
                                item.id,
                                'descricao',
                                v,
                                'capex',
                                item.descricao,
                              )
                            }
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <EditableNumber
                            value={item.qtd || 0}
                            disabled={!editable}
                            onSave={async (v) =>
                              updateWithAudit('capex_itens', item.id, 'qtd', v, 'capex', item.qtd)
                            }
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <EditableNumber
                            value={item.custo_unitario || 0}
                            disabled={!editable}
                            prefix="R$"
                            onSave={async (v) =>
                              updateWithAudit(
                                'capex_itens',
                                item.id,
                                'custo_unitario',
                                v,
                                'capex',
                                item.custo_unitario,
                              )
                            }
                          />
                        </td>
                        <td className="py-1.5 px-2 text-right">
                          <CalcOutput className="text-[#b98a00]">
                            {fmtBRL(calcCapexItemTotal(item))}
                          </CalcOutput>
                        </td>
                        {editable && (
                          <td className="no-print py-1.5 px-2">
                            <button
                              onClick={() => deleteRecord('capex_itens', item.id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr>
                        <td
                          colSpan={editable ? 5 : 4}
                          className="py-3 text-center text-[#7a8aaa] text-xs"
                        >
                          Nenhum item
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-6 bg-[#1a2236] rounded-xl p-4 flex items-center justify-between">
        <span className="text-white font-black text-sm">CAPEX TOTAL</span>
        <div className="flex items-center gap-4">
          {editable && capexParams[0] && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#7a8aaa]">Contingência:</span>
              <EditableNumber
                value={contPct}
                disabled={!editable}
                suffix="%"
                onSave={async (v) =>
                  updateWithAudit(
                    'capex_parametros',
                    capexParams[0].id,
                    'contingencia_pct',
                    v,
                    'capex',
                    capexParams[0].contingencia_pct,
                  )
                }
              />
            </div>
          )}
          <span className="text-[#b98a00] font-black text-lg">{fmtBRL(total)}</span>
        </div>
      </div>
    </div>
  )
}
