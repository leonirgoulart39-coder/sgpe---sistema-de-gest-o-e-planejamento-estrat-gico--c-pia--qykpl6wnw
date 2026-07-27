import { useState, useEffect, useCallback } from 'react'
import { SectionHeader } from '@/components/ui-helpers'
import { useRealtime } from '@/hooks/use-realtime'
import { TaxasTable } from '@/components/modelo/TaxasTable'
import { FontesReceitaList } from '@/components/modelo/FontesReceitaList'
import { AcademyCard } from '@/components/modelo/AcademyCard'
import { getTaxasRoyalties, getAcademyInfo, getFontesReceita } from '@/services/modelo'
import type { Planejamento, ModeloFonteReceita } from '@/types'

export default function Modelo() {
  const [taxas, setTaxas] = useState<Planejamento[]>([])
  const [academy, setAcademy] = useState<Planejamento | null>(null)
  const [fontes, setFontes] = useState<ModeloFonteReceita[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [tData, aData, fData] = await Promise.all([
        getTaxasRoyalties(),
        getAcademyInfo(),
        getFontesReceita(),
      ])
      setTaxas(tData)
      setAcademy(aData)
      setFontes(fData)
    } catch (err) {
      console.warn('Erro ao carregar dados do modelo:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('planejamento', () => {
    loadData()
  })

  useRealtime('modelo_fontes_receita', () => {
    loadData()
  })

  return (
    <div className="space-y-6 pb-12">
      <SectionHeader
        title="Modelo de Negócio"
        subtitle="Proposta de valor, receitas e estrutura operacional do franqueado"
      />

      {loading ? (
        <div className="py-12 text-center text-sm text-slate-400 animate-pulse">
          Carregando informações do modelo de negócio...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            <TaxasTable taxas={taxas} onRefresh={loadData} />
            <FontesReceitaList fontes={fontes} onRefresh={loadData} />
          </div>

          <AcademyCard academyInfo={academy} onRefresh={loadData} />
        </div>
      )}
    </div>
  )
}
