import pb from '@/lib/pocketbase/client'
import type { ModeloFonteReceita, Planejamento } from '@/types'

export async function getTaxasRoyalties(): Promise<Planejamento[]> {
  return pb.collection('planejamento').getFullList<Planejamento>({
    filter: 'section = "taxas_royalties"',
    sort: 'created',
  })
}

export async function getAcademyInfo(): Promise<Planejamento | null> {
  const list = await pb.collection('planejamento').getFullList<Planejamento>({
    filter: 'section = "academy_info" && field_name = "description"',
  })
  return list[0] || null
}

export async function getFontesReceita(): Promise<ModeloFonteReceita[]> {
  return pb.collection('modelo_fontes_receita').getFullList<ModeloFonteReceita>({
    sort: 'ordem',
  })
}

export async function updatePlanejamentoItem(id: string, data: Partial<Planejamento>) {
  return pb.collection('planejamento').update(id, data)
}

export async function createPlanejamentoItem(data: Partial<Planejamento>) {
  return pb.collection('planejamento').create(data)
}

export async function deletePlanejamentoItem(id: string) {
  return pb.collection('planejamento').delete(id)
}

export async function updateFonteReceita(id: string, data: Partial<ModeloFonteReceita>) {
  return pb.collection('modelo_fontes_receita').update(id, data)
}

export async function createFonteReceita(data: Partial<ModeloFonteReceita>) {
  return pb.collection('modelo_fontes_receita').create(data)
}

export async function deleteFonteReceita(id: string) {
  return pb.collection('modelo_fontes_receita').delete(id)
}
