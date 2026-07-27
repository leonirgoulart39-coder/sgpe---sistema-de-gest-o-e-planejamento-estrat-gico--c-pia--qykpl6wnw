import { useState, useCallback } from 'react'
import { useCollection } from '@/hooks/use-collection'
import { useAuth } from '@/hooks/use-auth'
import { MetricCard } from '@/components/ui-helpers'
import { WidgetErrorBoundary } from '@/components/WidgetErrorBoundary'
import { SectionCard } from '@/components/SectionCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import {
  calcFolhaTotal,
  calcCapexTotal,
  calcDre,
  calcCapexBlockSubtotal,
  calcLegalizacaoTotal,
  getSemaforo,
  fmtBRL,
  fmtPct,
} from '@/lib/calculations'
import type {
  EquipeCargo,
  EncargoParametro,
  CapexItem,
  CapexParametro,
  DreParametro,
  RegularizacaoEtapa,
  AuditLog,
} from '@/types'
import type { DashboardIndicador } from '@/types/dashboard'
import { getIndicadores, updateIndicador } from '@/services/dashboard-indicadores'
import { IndicadorWidget } from '@/components/IndicadorWidget'
import { IndicadorTable } from '@/components/IndicadorTable'
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react'

const QUICK_LINKS = [
  { path: '/diagnostico', label: 'Diagnóstico' },
  { path: '/identidade', label: 'Identidade' },
  { path: '/modelo', label: 'Modelo' },
  { path: '/regulamentacao', label: 'Regularização' },
  { path: '/pedagogico', label: 'Pedagógico' },
  { path: '/equipe', label: 'Equipe' },
  { path: '/capex', label: 'CAPEX' },
  { path: '/dre', label: 'DRE' },
  { path: '/captacao', label: 'Captação' },
  { path: '/roadmap', label: 'Roadmap' },
]

export default function Index() {
  const { user, profileMissing } = useAuth()
  const {
    items: cargos,
    loading: l1,
    error: e1,
    refetch: r1,
  } = useCollection<EquipeCargo>('equipe_cargos')
  const {
    items: encargos,
    loading: l2,
    error: e2,
    refetch: r2,
  } = useCollection<EncargoParametro>('encargos_parametros')
  const {
    items: capexItems,
    loading: l3,
    error: e3,
    refetch: r3,
  } = useCollection<CapexItem>('capex_itens')
  const {
    items: capexParams,
    loading: l4,
    error: e4,
    refetch: r4,
  } = useCollection<CapexParametro>('capex_parametros')
  const {
    items: dreParams,
    loading: l5,
    error: e5,
    refetch: r5,
  } = useCollection<DreParametro>('dre_parametros')
  const {
    items: etapas,
    loading: l6,
    error: e6,
    refetch: r6,
  } = useCollection<RegularizacaoEtapa>('regularizacao_etapas', 'ordem')
  const {
    items: logs,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useCollection<AuditLog>('audit_log', '-created')

  const [indicadores, setIndicadores] = useState<DashboardIndicador[]>([])
  const [indicadoresLoading, setIndicadoresLoading] = useState(true)
  const [indicadoresError, setIndicadoresError] = useState<Error | null>(null)

  const fetchIndicadores = useCallback(async () => {
    try {
      setIndicadoresLoading(true)
      const data = await getIndicadores()
      setIndicadores(data)
      setIndicadoresError(null)
    } catch (err) {
      setIndicadoresError(err instanceof Error ? err : new Error(String(err)))
      toast({ title: 'Não foi possível carregar os indicadores', variant: 'destructive' })
    } finally {
      setIndicadoresLoading(false)
    }
  }, [])

  useState(() => {
    fetchIndicadores()
    return undefined
  })

  const handleIndicadorUpdate = useCallback(async (id: string, valor: number) => {
    try {
      const updated = await updateIndicador(id, valor)
      setIndicadores((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      toast({ title: 'Indicador atualizado com sucesso' })
    } catch (err) {
      toast({
        title: 'Erro ao salvar indicador',
        description: err instanceof Error ? err.message : 'Tente novamente',
        variant: 'destructive',
      })
      throw err
    }
  }, [])

  const widgetIndicadores = indicadores.filter((i) => i.categoria === 'widget')
  const tabelaIndicadores = indicadores.filter((i) => i.categoria === 'tabela')

  const metricsLoading = l1 || l2 || l3 || l4 || l5 || l6
  const metricsError = e1 || e2 || e3 || e4 || e5 || e6 || null

  const refetchMetrics = () => {
    r1()
    r2()
    r3()
    r4()
    r5()
    r6()
  }

  const encargosTotal = Array.isArray(encargos)
    ? encargos.reduce((s, e) => s + (e.percentual || 0), 0)
    : 0
  const folhaTotal = calcFolhaTotal(cargos || [], encargosTotal)
  const contPct = capexParams?.[0]?.contingencia_pct || 10
  const legalCost = calcLegalizacaoTotal(etapas || [])
  const capexTotal = calcCapexTotal(capexItems || [], contPct, legalCost)
  const obraSub = calcCapexBlockSubtotal(capexItems || [], 'obra')
  const dre = calcDre(dreParams || [], folhaTotal, capexTotal, obraSub)
  const semaforo = getSemaforo(dre?.margemEbitda || 0)
  const concluidas = Array.isArray(etapas)
    ? etapas.filter((e) => e.status === 'concluido').length
    : 0
  const pctRegularizacao = etapas?.length > 0 ? (concluidas / etapas.length) * 100 : 0
  const alunosMeta = (dreParams || []).find((p) => p.field_name === 'alunos')?.value || 0
  const displayName = user?.name || user?.email || 'Usuário'

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-foreground font-display">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1 font-sans">Bem-vindo, {displayName}</p>
      </div>

      {profileMissing && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-xs text-warning">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0" />
          <span>
            Perfil de usuário não encontrado. Algumas funcionalidades podem estar restritas.
          </span>
        </div>
      )}

      <WidgetErrorBoundary title="Não foi possível carregar os indicadores de mercado">
        {indicadoresLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : indicadoresError ? (
          <div className="mb-8 bg-card rounded-xl border border-destructive/30 p-4 shadow-subtle">
            <p className="text-sm font-bold text-destructive">
              Não foi possível carregar os indicadores
            </p>
            <button
              onClick={fetchIndicadores}
              className="text-xs text-accent font-bold mt-2 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="mb-8">
            <h2 className="text-sm font-black text-[#1a2236] mb-3">Indicadores de Mercado</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {widgetIndicadores.map((ind) => (
                <IndicadorWidget
                  key={ind.id}
                  indicador={ind}
                  onUpdate={(updated) =>
                    setIndicadores((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
                  }
                />
              ))}
            </div>
          </div>
        )}
      </WidgetErrorBoundary>

      <WidgetErrorBoundary title="Não foi possível carregar as métricas do dashboard">
        <SectionCard
          loading={metricsLoading}
          error={metricsError}
          onRetry={refetchMetrics}
          skeleton={
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <MetricCard label="CAPEX Total" value={fmtBRL(capexTotal)} sub="Investimento total" />
            <MetricCard
              label="EBITDA Mensal"
              value={fmtBRL(dre?.ebitda || 0)}
              sub="Resultado operacional"
            />
            <MetricCard
              label="Payback"
              value={`${(dre?.paybackMeses || 0).toFixed(1)} meses`}
              sub="Retorno do investimento"
            />
            <MetricCard
              label="Margem EBITDA"
              value={fmtPct(dre?.margemEbitda || 0)}
              semaforo={semaforo}
            />
            <MetricCard
              label="% Regularização"
              value={fmtPct(pctRegularizacao)}
              sub={`${concluidas}/${etapas?.length || 0} etapas`}
            />
            <MetricCard label="Alunos (Meta)" value={String(alunosMeta)} sub="Meta de matrículas" />
            <MetricCard label="Folha Total" value={fmtBRL(folhaTotal)} sub="Custo com pessoal" />
            <MetricCard
              label="Semáforo Geral"
              value={
                semaforo === 'green' ? 'Verde' : semaforo === 'yellow' ? 'Amarelo' : 'Vermelho'
              }
              semaforo={semaforo}
            />
          </div>
        </SectionCard>
      </WidgetErrorBoundary>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WidgetErrorBoundary title="Não foi possível carregar os atalhos">
          <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
            <h2 className="text-sm font-black text-[#1a2236] mb-3">Acesso Rápido</h2>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between px-3 py-2 rounded-lg border border-[#d8dde8] hover:border-[#b98a00]/30 hover:bg-[#b98a00]/5 transition-all text-xs font-bold text-[#1a2236]"
                >
                  {link.label}
                  <ArrowRight className="w-3 h-3 text-[#b98a00]" />
                </Link>
              ))}
            </div>
          </div>
        </WidgetErrorBoundary>

        <WidgetErrorBoundary title="Não foi possível carregar as atividades recentes">
          <SectionCard
            loading={logsLoading}
            error={logsError}
            onRetry={refetchLogs}
            skeleton={
              <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
                <Skeleton className="h-4 w-32 mb-3" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              </div>
            }
          >
            <div className="bg-white rounded-xl border border-[#d8dde8] p-4 shadow-subtle">
              <h2 className="text-sm font-black text-[#1a2236] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#b98a00]" />
                Atividade Recente
              </h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(logs || []).slice(0, 10).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-2 text-xs py-1.5 border-b border-[#d8dde8]/40 last:border-0"
                  >
                    <div className="flex-1">
                      <span className="font-bold text-[#1a2236]">{log.user_name}</span>
                      <span className="text-[#7a8aaa]"> alterou </span>
                      <span className="font-medium text-[#1E2D6E]">{log.field_name}</span>
                      <span className="text-[#7a8aaa]"> em </span>
                      <span className="font-medium">{log.module}</span>
                    </div>
                    <span className="text-[10px] text-[#7a8aaa] whitespace-nowrap">
                      {formatDate(log.created)}
                    </span>
                  </div>
                ))}
                {(!logs || logs.length === 0) && (
                  <p className="text-xs text-[#7a8aaa] text-center py-4">
                    Nenhuma atividade ainda.
                  </p>
                )}
              </div>
            </div>
          </SectionCard>
        </WidgetErrorBoundary>
      </div>

      <div className="mt-6">
        <WidgetErrorBoundary title="Não foi possível carregar os indicadores estratégicos">
          <IndicadorTable
            items={tabelaIndicadores}
            loading={indicadoresLoading}
            error={indicadoresError}
            onUpdate={(updated) =>
              setIndicadores((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
            }
          />
        </WidgetErrorBoundary>
      </div>
    </div>
  )
}
