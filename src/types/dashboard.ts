export interface DashboardIndicador {
  id: string
  nome: string
  valor: number
  formato: 'numero' | 'moeda' | 'percentual' | 'meses'
  categoria: 'widget' | 'tabela'
  ordem: number
  created: string
  updated: string
}

export function formatIndicador(valor: number, formato: string): string {
  switch (formato) {
    case 'moeda':
      return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    case 'percentual':
      return `${valor.toFixed(1).replace('.', ',')}%`
    case 'meses':
      return `${Math.round(valor)} meses`
    default:
      return String(Math.round(valor))
  }
}
