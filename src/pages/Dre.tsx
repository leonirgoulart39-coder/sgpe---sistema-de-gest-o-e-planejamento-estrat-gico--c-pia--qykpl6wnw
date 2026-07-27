import { useState, useEffect, useMemo } from 'react'
import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit } from '@/services/collections'
import { EditableNumber } from '@/components/editable'
import { SectionHeader, PrintHeader, MetricCard } from '@/components/ui-helpers'
import { DreValueCell, type ValueFmt } from '@/components/dre-helpers'
import {
  calcFolhaTotal,
  calcCapexTotal,
  calcCapexBlockSubtotal,
  calcDre,
  getSemaforo,
  getDreParam,
  fmtBRL,
  fmtPct,
} from '@/lib/calculations'
import type {
  DreParametro,
  EquipeCargo,
  EncargoParametro,
  CapexItem,
  CapexParametro,
} from '@/types'

interface DreRow {
  label: string
  value?: number
  param?: string
  paramSuffix?: string
  isTotal?: boolean
  valueFmt: ValueFmt
}

export default function Dre() {
  const { items: dreParams } = useCollection<DreParametro>('dre_parametros')
  const { items: cargos } = useCollection<EquipeCargo>('equipe_cargos')
  const { items: encargos } = useCollection<EncargoParametro>('encargos_parametros')
  const { items: capexItems } = useCollection<CapexItem>('capex_itens')
  const { items: capexParams } = useCollection<CapexParametro>('capex_parametros')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'dre')
  const [drafts, setDrafts] = useState<Record<string, number>>({})

  const effectiveParams = useMemo(
    () =>
      dreParams.map((p) =>
        drafts[p.field_name] !== undefined ? { ...p, value: drafts[p.field_name] } : p,
      ),
    [dreParams, drafts],
  )

  useEffect(() => {
    setDrafts((prev) => {
      const next = { ...prev }
      let changed = false
      for (const key of Object.keys(next)) {
        const saved = dreParams.find((p) => p.field_name === key)
        if (saved && saved.value === next[key]) {
          delete next[key]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [dreParams])

  const encTotal = encargos.reduce((s, e) => s + e.percentual, 0)
  const folhaTotal = calcFolhaTotal(cargos, encTotal)
  const contPct = capexParams[0]?.contingencia_pct || 10
  const capexTotal = calcCapexTotal(capexItems, contPct)
  const obraSub = calcCapexBlockSubtotal(capexItems, 'obra')
  const dre = calcDre(effectiveParams, folhaTotal, capexTotal, obraSub)
  const semaforo = getSemaforo(dre.margemEbitda)
  const p = (name: string) => getDreParam(effectiveParams, name)

  const dreRows: DreRow[] = [
    { label: 'Nº de Alunos', param: 'alunos', valueFmt: 'num' },
    { label: 'Ticket Médio', param: 'ticket_medio', valueFmt: 'brl' },
    { label: 'Inadimplência', param: 'inadimplencia', paramSuffix: '%', valueFmt: 'pct' },
    { label: 'Receita Bruta', value: dre.receitaBruta, valueFmt: 'brl' },
    { label: 'Receita Líquida', value: dre.receitaLiquida, valueFmt: 'brl' },
    {
      label: 'Materiais Didáticos (R$/aluno)',
      value: dre.receitaMateriais,
      param: 'mat_por_aluno',
      valueFmt: 'brl',
    },
    {
      label: 'Uniformes (R$/aluno)',
      value: dre.receitaUniformes,
      param: 'uni_por_aluno',
      valueFmt: 'brl',
    },
    {
      label: 'Eletivos (R$/aluno)',
      value: dre.receitaEletivos,
      param: 'elet_por_aluno',
      valueFmt: 'brl',
    },
    { label: 'Receita Total', value: dre.receitaTotal, isTotal: true, valueFmt: 'brl' },
    {
      label: 'Simples Nacional',
      value: dre.custoSimples,
      param: 'simples_pct',
      paramSuffix: '%',
      valueFmt: 'brl',
    },
    {
      label: 'Royalties',
      value: dre.custoRoyalties,
      param: 'royalties_pct',
      paramSuffix: '%',
      valueFmt: 'brl',
    },
    {
      label: 'Marketing',
      value: dre.custoMkt,
      param: 'mkt_legacy_pct',
      paramSuffix: '%',
      valueFmt: 'brl',
    },
    {
      label: 'Materiais',
      value: dre.custoMateriais,
      param: 'mat_custo_pct',
      paramSuffix: '%',
      valueFmt: 'brl',
    },
    { label: 'Folha + Encargos', value: dre.custoFolha, valueFmt: 'brl' },
    { label: 'Aluguel', value: dre.custoAluguel, param: 'aluguel', valueFmt: 'brl' },
    { label: 'Energia', value: dre.custoEnergia, param: 'energia', valueFmt: 'brl' },
    { label: 'Manutenção Predial', value: dre.custoManutencao, valueFmt: 'brl' },
    { label: 'Custos Totais', value: dre.custoTotal, isTotal: true, valueFmt: 'brl' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <PrintHeader title="DRE & Resultado" />
      <SectionHeader
        title="DRE & Resultado"
        subtitle="Demonstração de resultado operacional"
        section="dre"
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Receita Total" value={fmtBRL(dre.receitaTotal)} />
        <MetricCard label="EBITDA" value={fmtBRL(dre.ebitda)} />
        <MetricCard label="Margem EBITDA" value={fmtPct(dre.margemEbitda)} semaforo={semaforo} />
        <MetricCard label="Payback" value={`${dre.paybackMeses.toFixed(1)} meses`} />
      </div>
      <div className="bg-white rounded-xl border border-[#d8dde8] overflow-hidden shadow-subtle">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 text-[#7a8aaa] font-bold uppercase tracking-wider border-b border-[#d8dde8]">
              <th className="py-2.5 px-3 text-left text-[10px]">Item DRE</th>
              <th className="py-2.5 px-3 text-right text-[10px]">Parâmetro</th>
              <th className="py-2.5 px-3 text-right text-[10px]">Valor (R$/mês)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d8dde8]/60">
            {dreRows.map((row, i) => (
              <tr
                key={i}
                className={row.isTotal ? 'bg-slate-50 font-black' : 'hover:bg-slate-50/50'}
              >
                <td className="py-2 px-3 text-[#1a2236]">{row.label}</td>
                <td className="py-2 px-3 text-right">
                  {row.param && editable ? (
                    <EditableNumber
                      value={getDreParam(effectiveParams, row.param)}
                      disabled={!editable}
                      suffix={row.paramSuffix}
                      onChange={(v) => setDrafts((prev) => ({ ...prev, [row.param!]: v }))}
                      onSave={async (v) => {
                        const param = dreParams.find((p) => p.field_name === row.param)
                        if (param)
                          await updateWithAudit(
                            'dre_parametros',
                            param.id,
                            'value',
                            v,
                            'dre',
                            param.value,
                          )
                      }}
                    />
                  ) : row.param ? (
                    <span className="text-[#7a8aaa]">
                      {p(row.param)}
                      {row.paramSuffix}
                    </span>
                  ) : (
                    <span className="text-[#7a8aaa]">—</span>
                  )}
                </td>
                <td className="py-2 px-3 text-right">
                  {row.value !== undefined ? (
                    <DreValueCell value={row.value} fmt={row.valueFmt} isTotal={row.isTotal} />
                  ) : (
                    <span className="text-[#7a8aaa]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#1a2236] text-white">
              <td className="py-3 px-3 font-black text-sm">EBITDA</td>
              <td className="py-3 px-3 text-right">
                <span className="text-[#7a8aaa] text-[10px]">
                  Margem: {fmtPct(dre.margemEbitda)}
                </span>
              </td>
              <td className="py-3 px-3 text-right font-black text-[#b98a00] text-lg">
                {fmtBRL(dre.ebitda)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
