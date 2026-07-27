import pb from '@/lib/pocketbase/client'
import { createAuditLog } from '@/services/collections'

export interface PedagogicoTag {
  label: string
  color: string
}

export interface PedagogicoNivel {
  id: string
  nivel: string
  ordem: number
  subniveis: string[]
  tags: PedagogicoTag[]
  descricao: string
  created: string
  updated: string
}

export interface PedagogicoParceria {
  id: string
  titulo: string
  descricao: string
  ordem: number
  created: string
  updated: string
}

export async function getNiveis(): Promise<PedagogicoNivel[]> {
  return pb.collection('pedagogico_niveis').getFullList<PedagogicoNivel>({
    sort: 'ordem',
  })
}

export async function getParcerias(): Promise<PedagogicoParceria[]> {
  return pb.collection('pedagogico_parcerias').getFullList<PedagogicoParceria>({
    sort: 'ordem',
  })
}

export async function updateNivel(
  id: string,
  field: string,
  newValue: unknown,
  oldValue?: unknown,
) {
  await pb.collection('pedagogico_niveis').update(id, { [field]: newValue })
  await createAuditLog('pedagogico_niveis', field, String(oldValue ?? ''), String(newValue ?? ''))
}

export async function updateParceria(
  id: string,
  field: string,
  newValue: unknown,
  oldValue?: unknown,
) {
  await pb.collection('pedagogico_parcerias').update(id, { [field]: newValue })
  await createAuditLog(
    'pedagogico_parcerias',
    field,
    String(oldValue ?? ''),
    String(newValue ?? ''),
  )
}
