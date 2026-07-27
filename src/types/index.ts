export interface UserProfile {
  id: string
  user_id: string
  role: 'admin' | 'financeiro' | 'operacional' | 'leitura'
  created: string
  updated: string
}

export interface Planejamento {
  id: string
  section: string
  field_name: string
  content: string
  created: string
  updated: string
}

export interface SwotItem {
  id: string
  quadrant: 'forcas' | 'fraquezas' | 'oportunidades' | 'ameacas'
  text: string
}

export interface ValorFundamental {
  id: string
  title: string
  description: string
}

export interface EquipeCargo {
  id: string
  cargo: string
  area: string
  qtd: number
  salario: number
  regime?: string
  horario?: string
  created?: string
  updated?: string
}

export interface EncargoParametro {
  id: string
  nome: string
  percentual: number
}

export interface CapexItem {
  id: string
  block: 'obra' | 'equipamentos' | 'franquia' | 'giro'
  descricao: string
  qtd: number
  custo_unitario: number
}

export interface CapexParametro {
  id: string
  contingencia_pct: number
}

export interface DreParametro {
  id: string
  field_name: string
  value: number
}

export interface RegularizacaoEtapa {
  id: string
  nome: string
  status: 'pendente' | 'em_andamento' | 'concluido'
  responsavel: string
  ordem: number
  custo_previsto?: number
  mes_execucao?: string
}

export interface ModeloFonteReceita {
  id: string
  titulo: string
  descricao: string
  tag_label: string
  tag_color: string
  bullet_color: string
  ordem: number
  created?: string
  updated?: string
}

export interface AuditLog {
  id: string
  user_id: string
  user_name: string
  module: string
  field_name: string
  old_value: string
  new_value: string
  created: string
}

export type Role = 'admin' | 'financeiro' | 'operacional' | 'leitura'
