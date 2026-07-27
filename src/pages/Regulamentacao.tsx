import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { canEdit } from '@/lib/permissions'
import { updateWithAudit } from '@/services/collections'
import { EditableText, EditableNumber, CalcOutput } from '@/components/editable'
import { SectionHeader, PrintHeader, MetricCard, StatusBadge } from '@/components/ui-helpers'
import { fmtPct, fmtBRL, calcLegalizacaoTotal } from '@/lib/calculations'
import type { RegularizacaoEtapa } from '@/types'

export default function Regulamentacao() {
  const { items: etapas } = useCollection<RegularizacaoEtapa>('regularizacao_etapas', 'ordem')
  const { role } = useAuth()
  const editable = canEdit(role as any, 'regulamentacao')
  const concluidas = etapas.filter((e) => e.status === 'concluido').length
  const emAndamento = etapas.filter((e) => e.status === 'em_andamento').length
  const pct = etapas.length > 0 ? (concluidas / etapas.length) * 100 : 0
  const totalLegalizacao = calcLegalizacaoTotal(etapas)

  const statusOptions = ['pendente', 'em_andamento', 'concluido'] as const

  return (
    <div className="max-w-5xl mx-auto">
      <PrintHeader title="Regularização & Legalização" />
      <SectionHeader
        title="Regularização & Legalização"
        subtitle="Etapas de regularização da escola"
        section="regulamentacao"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Concluídas" value={`${concluidas}/${etapas.length}`} />
        <MetricCard label="Em Andamento" value={String(emAndamento)} />
        <MetricCard label="Pendentes" value={String(etapas.length - concluidas - emAndamento)} />
        <MetricCard label="Progresso" value={fmtPct(pct)} />
      </div>

      <div className="bg-white rounded-xl border border-[#d8dde8] overflow-hidden shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#d8dde8] bg-slate-50 text-[#7a8aaa] font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3 text-left text-[10px]">#</th>
                <th className="py-2.5 px-3 text-left text-[10px]">Etapa</th>
                <th className="py-2.5 px-3 text-left text-[10px]">Responsável</th>
                <th className="py-2.5 px-3 text-right text-[10px]">Custo Previsto</th>
                <th className="py-2.5 px-3 text-left text-[10px]">Mês de Execução</th>
                <th className="py-2.5 px-3 text-left text-[10px]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8dde8]/60">
              {etapas.map((etapa, i) => (
                <tr key={etapa.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-3 text-[#7a8aaa] font-mono text-xs">{i + 1}</td>
                  <td className="py-2.5 px-3">
                    <EditableText
                      value={etapa.nome}
                      disabled={!editable}
                      className="text-xs font-bold"
                      onSave={async (v) =>
                        updateWithAudit(
                          'regularizacao_etapas',
                          etapa.id,
                          'nome',
                          v,
                          'regulamentacao',
                          etapa.nome,
                        )
                      }
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <EditableText
                      value={etapa.responsavel || ''}
                      disabled={!editable}
                      className="text-xs"
                      onSave={async (v) =>
                        updateWithAudit(
                          'regularizacao_etapas',
                          etapa.id,
                          'responsavel',
                          v,
                          'regulamentacao',
                          etapa.responsavel,
                        )
                      }
                    />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <EditableNumber
                      value={etapa.custo_previsto || 0}
                      disabled={!editable}
                      prefix="R$"
                      onSave={async (v) =>
                        updateWithAudit(
                          'regularizacao_etapas',
                          etapa.id,
                          'custo_previsto',
                          v,
                          'regulamentacao',
                          etapa.custo_previsto,
                        )
                      }
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <EditableText
                      value={etapa.mes_execucao || ''}
                      disabled={!editable}
                      className="text-xs"
                      onSave={async (v) =>
                        updateWithAudit(
                          'regularizacao_etapas',
                          etapa.id,
                          'mes_execucao',
                          v,
                          'regulamentacao',
                          etapa.mes_execucao,
                        )
                      }
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    {editable ? (
                      <select
                        value={etapa.status}
                        onChange={async (e) =>
                          updateWithAudit(
                            'regularizacao_etapas',
                            etapa.id,
                            'status',
                            e.target.value,
                            'regulamentacao',
                            etapa.status,
                          )
                        }
                        className="text-[10px] font-bold rounded-full border border-[#d8dde8] px-2 py-1 bg-white focus:outline-none focus:border-[#b98a00]"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>
                            {s === 'em_andamento'
                              ? 'Em Andamento'
                              : s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <StatusBadge
                        status={etapa.status}
                        label={
                          etapa.status === 'em_andamento'
                            ? 'Em Andamento'
                            : etapa.status.charAt(0).toUpperCase() + etapa.status.slice(1)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 bg-[#1a2236] rounded-xl p-4 flex items-center justify-between">
        <span className="text-white font-black text-sm">Total de Custos de Legalização</span>
        <CalcOutput className="text-[#b98a00] font-black text-lg">
          {fmtBRL(totalLegalizacao)}
        </CalcOutput>
      </div>
    </div>
  )
}
