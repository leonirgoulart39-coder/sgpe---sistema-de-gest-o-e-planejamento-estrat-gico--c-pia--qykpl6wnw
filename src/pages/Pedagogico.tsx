import { useState, useEffect, useCallback } from 'react'
import { SectionHeader } from '@/components/ui-helpers'
import { useRealtime } from '@/hooks/use-realtime'
import { NivelCard } from '@/components/pedagogico/NivelCard'
import { ParceriaCard } from '@/components/pedagogico/ParceriaCard'
import {
  getNiveis,
  getParcerias,
  type PedagogicoNivel,
  type PedagogicoParceria,
} from '@/services/pedagogico'

export default function Pedagogico() {
  const [niveis, setNiveis] = useState<PedagogicoNivel[]>([])
  const [parcerias, setParcerias] = useState<PedagogicoParceria[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [nData, pData] = await Promise.all([getNiveis(), getParcerias()])
      setNiveis(nData)
      setParcerias(pData)
    } catch (err) {
      console.warn('Erro ao carregar dados pedagógicos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('pedagogico_niveis', () => loadData())
  useRealtime('pedagogico_parcerias', () => loadData())

  return (
    <div className="space-y-8 pb-12">
      <SectionHeader
        title="Pedagógico"
        subtitle="Estrutura curricular, níveis de ensino e parcerias internacionais"
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-400 animate-pulse">
          Carregando informações pedagógicas...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {niveis.map((nivel, i) => (
              <NivelCard key={nivel.id} nivel={nivel} index={i} onRefresh={loadData} />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1a2236] dark:text-slate-100 border-b border-[#d2dce6] dark:border-slate-800 pb-3">
              Parcerias Internacionais Exclusivas
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {parcerias.map((parceria) => (
                <ParceriaCard key={parceria.id} parceria={parceria} onRefresh={loadData} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
