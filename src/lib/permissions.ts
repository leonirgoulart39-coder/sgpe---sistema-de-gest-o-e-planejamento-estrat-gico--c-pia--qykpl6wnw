import type { Role } from '@/types'

export type Permission = 'write' | 'read' | 'none'

const MATRIX: Record<Role, Record<string, Permission>> = {
  admin: {
    diagnostico: 'write',
    identidade: 'write',
    modelo: 'write',
    regulamentacao: 'write',
    pedagogico: 'write',
    equipe: 'write',
    capex: 'write',
    dre: 'write',
    captacao: 'write',
    roadmap: 'write',
    proximos: 'write',
    admin: 'write',
  },
  financeiro: {
    diagnostico: 'read',
    identidade: 'read',
    modelo: 'read',
    regulamentacao: 'read',
    pedagogico: 'read',
    equipe: 'read',
    capex: 'write',
    dre: 'write',
    captacao: 'write',
    roadmap: 'read',
    proximos: 'read',
    admin: 'none',
  },
  operacional: {
    diagnostico: 'read',
    identidade: 'read',
    modelo: 'read',
    regulamentacao: 'write',
    pedagogico: 'write',
    equipe: 'write',
    capex: 'read',
    dre: 'read',
    captacao: 'read',
    roadmap: 'read',
    proximos: 'write',
    admin: 'none',
  },
  leitura: {
    diagnostico: 'read',
    identidade: 'read',
    modelo: 'read',
    regulamentacao: 'read',
    pedagogico: 'read',
    equipe: 'read',
    capex: 'read',
    dre: 'read',
    captacao: 'read',
    roadmap: 'read',
    proximos: 'read',
    admin: 'none',
  },
}

export function getPermission(role: Role, module: string): Permission {
  return MATRIX[role]?.[module] ?? 'read'
}

export function canEdit(role: Role, module: string): boolean {
  return getPermission(role, module) === 'write'
}
