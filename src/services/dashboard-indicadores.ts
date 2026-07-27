import pb from '@/lib/pocketbase/client'
import type { DashboardIndicador } from '@/types/dashboard'

export async function getIndicadores(): Promise<DashboardIndicador[]> {
  return pb.collection('dashboard_indicadores').getFullList<DashboardIndicador>({
    sort: 'ordem',
  })
}

export async function updateIndicador(id: string, valor: number): Promise<DashboardIndicador> {
  return pb.collection('dashboard_indicadores').update<DashboardIndicador>(id, { valor })
}
