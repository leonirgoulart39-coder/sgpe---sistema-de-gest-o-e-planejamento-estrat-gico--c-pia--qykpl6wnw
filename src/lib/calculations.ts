import type {
  EquipeCargo,
  EncargoParametro,
  CapexItem,
  DreParametro,
  RegularizacaoEtapa,
} from '@/types'

export function calcEncargosTotal(encargos: EncargoParametro[]): number {
  return encargos.reduce((s, e) => s + (e.percentual || 0), 0)
}

export function calcSubtotalBruto(cargo: EquipeCargo): number {
  return (cargo.qtd || 0) * (cargo.salario || 0)
}

export function calcEncargos(cargo: EquipeCargo, encargosTotal: number): number {
  return calcSubtotalBruto(cargo) * (encargosTotal / 100)
}

export function calcCustoTotal(cargo: EquipeCargo, encargosTotal: number): number {
  return calcSubtotalBruto(cargo) + calcEncargos(cargo, encargosTotal)
}

export function calcFolhaBruta(cargos: EquipeCargo[]): number {
  return cargos.reduce((s, c) => s + calcSubtotalBruto(c), 0)
}

export function calcFolhaTotal(cargos: EquipeCargo[], encargosTotal: number): number {
  return cargos.reduce((s, c) => s + calcCustoTotal(c, encargosTotal), 0)
}

export function calcCapexItemTotal(item: CapexItem): number {
  return (item.qtd || 0) * (item.custo_unitario || 0)
}

export function calcCapexBlockSubtotal(items: CapexItem[], block: string): number {
  return items.filter((i) => i.block === block).reduce((s, i) => s + calcCapexItemTotal(i), 0)
}

export function calcCapexSemContingencia(items: CapexItem[]): number {
  return items.reduce((s, i) => s + calcCapexItemTotal(i), 0)
}

export function calcContingencia(capexSemCont: number, pct: number): number {
  return capexSemCont * (pct / 100)
}

export function calcLegalizacaoTotal(etapas: RegularizacaoEtapa[]): number {
  return etapas.reduce((s, e) => s + (e.custo_previsto || 0), 0)
}

export function calcCapexTotal(items: CapexItem[], pct: number, legalCost = 0): number {
  const sem = calcCapexSemContingencia(items)
  return sem + calcContingencia(sem, pct) + legalCost
}

export function calcManutencaoPredial(obraSubtotal: number): number {
  return (obraSubtotal * 0.01) / 12
}

export function getDreParam(params: DreParametro[], name: string): number {
  const p = params.find((p) => p.field_name === name)
  return p ? p.value || 0 : 0
}

export interface DreCalc {
  receitaBruta: number
  receitaLiquida: number
  receitaMateriais: number
  receitaUniformes: number
  receitaEletivos: number
  receitaTotal: number
  custoSimples: number
  custoRoyalties: number
  custoMkt: number
  custoMateriais: number
  custoFolha: number
  custoAluguel: number
  custoEnergia: number
  custoManutencao: number
  custoTotal: number
  ebitda: number
  margemEbitda: number
  paybackMeses: number
}

export function calcDre(
  params: DreParametro[],
  folhaCustoTotal: number,
  capexTotal: number,
  obraSubtotal: number,
): DreCalc {
  const alunos = getDreParam(params, 'alunos')
  const ticket = getDreParam(params, 'ticket_medio')
  const inad = getDreParam(params, 'inadimplencia')
  const mat = getDreParam(params, 'mat_por_aluno')
  const uni = getDreParam(params, 'uni_por_aluno')
  const elet = getDreParam(params, 'elet_por_aluno')
  const simplesPct = getDreParam(params, 'simples_pct')
  const royaltiesPct = getDreParam(params, 'royalties_pct')
  const mktPct = getDreParam(params, 'mkt_legacy_pct')
  const matCustoPct = getDreParam(params, 'mat_custo_pct')
  const aluguel = getDreParam(params, 'aluguel')
  const energia = getDreParam(params, 'energia')

  const receitaBruta = alunos * ticket
  const receitaLiquida = receitaBruta * (1 - inad / 100)
  const receitaMateriais = alunos * mat
  const receitaUniformes = alunos * uni
  const receitaEletivos = alunos * elet
  const receitaTotal = receitaLiquida + receitaMateriais + receitaUniformes + receitaEletivos

  const custoSimples = receitaBruta * (simplesPct / 100)
  const custoRoyalties = receitaBruta * (royaltiesPct / 100)
  const custoMkt = receitaBruta * (mktPct / 100)
  const custoMateriais = receitaBruta * (matCustoPct / 100)
  const custoManutencao = calcManutencaoPredial(obraSubtotal)
  const custoTotal =
    custoSimples +
    custoRoyalties +
    custoMkt +
    custoMateriais +
    folhaCustoTotal +
    aluguel +
    energia +
    custoManutencao

  const ebitda = receitaTotal - custoTotal
  const margemEbitda = receitaTotal > 0 ? (ebitda / receitaTotal) * 100 : 0
  const paybackMeses = ebitda > 0 ? capexTotal / ebitda : 0

  return {
    receitaBruta,
    receitaLiquida,
    receitaMateriais,
    receitaUniformes,
    receitaEletivos,
    receitaTotal,
    custoSimples,
    custoRoyalties,
    custoMkt,
    custoMateriais,
    custoFolha: folhaCustoTotal,
    custoAluguel: aluguel,
    custoEnergia: energia,
    custoManutencao,
    custoTotal,
    ebitda,
    margemEbitda,
    paybackMeses,
  }
}

export type Semaforo = 'green' | 'yellow' | 'red'

export function getSemaforo(margem: number): Semaforo {
  if (margem >= 20) return 'green'
  if (margem >= 10) return 'yellow'
  return 'red'
}

export function fmtBRL(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function fmtNum(v: number, decimals = 0): string {
  return v.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function fmtPct(v: number): string {
  return `${v.toFixed(1)}%`
}
