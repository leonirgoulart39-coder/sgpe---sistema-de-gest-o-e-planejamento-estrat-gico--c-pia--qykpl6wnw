import { useCollection } from '@/hooks/use-collection'
import { useRealtime } from '@/hooks/use-realtime'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit, createRecord, deleteRecord } from '@/services/collections'
import { EditableText, EditableNumber, CalcOutput } from '@/components/editable'
import { SectionHeader, PrintHeader, MetricCard, AddRowButton } from '@/components/ui-helpers'
import {
  calcEncargosTotal,
  calcSubtotalBruto,
  calcEncargos,
  calcCustoTotal,
  calcFolhaBruta,
  calcFolhaTotal,
  fmtBRL,
} from '@/lib/calculations'
import { Trash2 } from 'lucide-react'
import type { EquipeCargo, EncargoParametro } from '@/types'

const CATEGORIES = [
  { key: 'LIDERANÇA', label: '— LIDERANÇA' },
  { key: 'DOCENTES', label: '— DOCENTES' },
  { key: 'ADMINISTRATIVO E APOIO', label: '— ADMINISTRATIVO E APOIO' },
  { key: 'OPERACIONAL / SERVIÇOS', label: '— OPERACIONAL / SERVIÇOS' },
]

export default function Equipe() {
  const { items: cargos, refetch: refetchCargos } = useCollection<EquipeCargo>('equipe_cargos')
  const { items: encargos, refetch: refetchEncargos } =
    useCollection<EncargoParametro>('encargos_parametros')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'equipe')

  useRealtime('equipe_cargos', () => {
    refetchCargos?.()
  })
  useRealtime('encargos_parametros', () => {
    refetchEncargos?.()
  })

  const encTotal = calcEncargosTotal(encargos)
  const folhaBruta = calcFolhaBruta(cargos)
  const folhaTotal = calcFolhaTotal(cargos, encTotal)
  const totalColaboradores = cargos.reduce((acc, c) => acc + (c.qtd || 0), 0)
  const totalEncargosValor = (folhaBruta * encTotal) / 100

  const categorizedCargos = CATEGORIES.map((cat) => {
    const list = cargos.filter((c) => (c.area || '').toUpperCase() === cat.key)
    return { ...cat, items: list }
  })

  const knownAreas = CATEGORIES.map((c) => c.key)
  const uncategorized = cargos.filter((c) => !knownAreas.includes((c.area || '').toUpperCase()))

  const colSpan = editable ? 9 : 8

  const renderCargoRow = (c: EquipeCargo) => {
    const sub = calcSubtotalBruto(c)
    const enc = calcEncargos(c, encTotal)
    const tot = calcCustoTotal(c, encTotal)
    return (
      <tr key={c.id} className="hover:bg-amber-50/40 transition-colors group text-slate-800">
        <td className="py-2 px-3 font-medium min-w-[200px]">
          <EditableText
            value={c.cargo}
            disabled={!editable}
            className="text-xs font-semibold"
            onSave={async (v) =>
              updateWithAudit('equipe_cargos', c.id, 'cargo', v, 'equipe', c.cargo)
            }
          />
        </td>
        <td className="py-2 px-2 text-center font-bold w-14">
          <EditableNumber
            value={c.qtd || 0}
            disabled={!editable}
            onSave={async (v) => updateWithAudit('equipe_cargos', c.id, 'qtd', v, 'equipe', c.qtd)}
          />
        </td>
        <td className="py-2 px-2 text-slate-700 min-w-[120px]">
          <EditableText
            value={c.regime || ''}
            disabled={!editable}
            className="text-xs"
            onSave={async (v) =>
              updateWithAudit('equipe_cargos', c.id, 'regime', v, 'equipe', c.regime)
            }
          />
        </td>
        <td className="py-2 px-2 text-slate-600 min-w-[160px]">
          <EditableText
            value={c.horario || ''}
            disabled={!editable}
            className="text-xs"
            onSave={async (v) =>
              updateWithAudit('equipe_cargos', c.id, 'horario', v, 'equipe', c.horario)
            }
          />
        </td>
        <td className="py-2 px-2 text-right">
          <EditableNumber
            value={c.salario || 0}
            disabled={!editable}
            prefix="R$"
            onSave={async (v) =>
              updateWithAudit('equipe_cargos', c.id, 'salario', v, 'equipe', c.salario)
            }
          />
        </td>
        <td className="py-2 px-2 text-right">
          <CalcOutput className="font-semibold text-slate-900">{fmtBRL(sub)}</CalcOutput>
        </td>
        <td className="py-2 px-2 text-right text-slate-600 font-medium">{fmtBRL(enc)}</td>
        <td className="py-2 px-2 text-right">
          <CalcOutput className="text-[#1a2e63] font-bold">{fmtBRL(tot)}</CalcOutput>
        </td>
        {editable && (
          <td className="no-print py-2 px-2 text-center w-10">
            <button
              onClick={() => deleteRecord('equipe_cargos', c.id)}
              className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 transition-opacity"
              title="Excluir cargo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </td>
        )}
      </tr>
    )
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <PrintHeader title="Equipe & Folha" />
      <SectionHeader
        title="Equipe & Folha de Pagamento"
        subtitle="Cargos, encargos e custo total de pessoal"
        section="equipe"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Folha Bruta" value={fmtBRL(folhaBruta)} sub="Sem encargos" />
        <MetricCard
          label="Total Encargos"
          value={`${encTotal.toFixed(2)}%`}
          sub={fmtBRL(totalEncargosValor)}
        />
        <MetricCard label="Custo Total" value={fmtBRL(folhaTotal)} sub="Folha + encargos" />
        <MetricCard
          label="Nº Colaboradores"
          value={String(totalColaboradores)}
          sub={`${cargos.length} cargos`}
        />
      </div>

      <div className="bg-white rounded-xl border border-[#d8dde8] overflow-hidden shadow-subtle mb-6">
        <div className="flex items-center justify-between p-3.5 bg-slate-900 text-white border-b border-[#d8dde8]">
          <h2 className="text-sm font-black tracking-wide uppercase">Cargos & Salários</h2>
          {editable && (
            <AddRowButton
              onClick={() =>
                createRecord('equipe_cargos', {
                  cargo: 'Novo Cargo',
                  area: 'LIDERANÇA',
                  qtd: 1,
                  regime: 'CLT 44h',
                  horario: 'Seg–Sex 7h–16h',
                  salario: 2000,
                })
              }
            />
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#1a2e63] text-white font-bold text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3 text-left w-[28%]">Cargo / Função</th>
                <th className="py-2.5 px-2 text-center w-[5%]">Qtd.</th>
                <th className="py-2.5 px-2 text-left w-[12%]">Regime Contrat.</th>
                <th className="py-2.5 px-2 text-left w-[15%]">Horário Principal</th>
                <th className="py-2.5 px-2 text-right w-[10%]">Sal.Bruto Unit. (R$)</th>
                <th className="py-2.5 px-2 text-right w-[10%]">Subtotal Bruto (R$)</th>
                <th className="py-2.5 px-2 text-right w-[10%]">Encargos (R$)</th>
                <th className="py-2.5 px-2 text-right w-[10%]">Custo Total (R$)</th>
                {editable && <th className="no-print w-10"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {categorizedCargos.map((group) => (
                <tbody key={group.key} className="contents">
                  <tr className="bg-[#c58b00] text-white font-black text-[11px] uppercase tracking-wider">
                    <td colSpan={colSpan} className="py-1.5 px-3">
                      {group.label}
                    </td>
                  </tr>
                  {group.items.map(renderCargoRow)}
                </tbody>
              ))}

              {uncategorized.length > 0 && (
                <tbody className="contents">
                  <tr className="bg-slate-700 text-white font-black text-[11px] uppercase tracking-wider">
                    <td colSpan={colSpan} className="py-1.5 px-3">
                      — OUTROS
                    </td>
                  </tr>
                  {uncategorized.map(renderCargoRow)}
                </tbody>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-[#1a2236] text-white">
                <td colSpan={5} className="py-3 px-3 font-black text-xs uppercase tracking-wide">
                  TOTAL GERAL — FOLHA MENSAL ({totalColaboradores} colaboradores)
                </td>
                <td className="py-3 px-2 text-right font-black text-xs text-amber-300">
                  {fmtBRL(folhaBruta)}
                </td>
                <td className="py-3 px-2 text-right text-slate-300 text-xs font-semibold">
                  {fmtBRL(totalEncargosValor)}
                </td>
                <td className="py-3 px-2 text-right font-black text-xs text-amber-300">
                  {fmtBRL(folhaTotal)}
                </td>
                {editable && <td className="no-print"></td>}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
        <h2 className="text-sm font-black text-[#1a2236] mb-3">Encargos Sociais</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2">
          {encargos.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-2 py-1.5 border-b border-[#d8dde8]/40 last:border-0"
            >
              <span className="text-xs font-medium text-[#1a2236] flex-1">{e.nome}</span>
              <EditableNumber
                value={e.percentual || 0}
                disabled={!editable}
                suffix="%"
                onSave={async (v) =>
                  updateWithAudit(
                    'encargos_parametros',
                    e.id,
                    'percentual',
                    v,
                    'equipe',
                    e.percentual,
                  )
                }
              />
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-[#d8dde8] flex justify-between items-center">
          <span className="text-xs font-black text-[#1a2236]">Total Encargos</span>
          <CalcOutput className="text-[#b98a00] text-lg font-black">
            {encTotal.toFixed(2)}%
          </CalcOutput>
        </div>
      </div>
    </div>
  )
}
