import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CalcOutput } from '@/components/editable'
import { fmtBRL, fmtPct, fmtNum } from '@/lib/calculations'

export type ValueFmt = 'brl' | 'num' | 'pct'

export function useFlash(value: number) {
  const [flashing, setFlashing] = useState(false)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current !== value) {
      setFlashing(true)
      prev.current = value
      const t = setTimeout(() => setFlashing(false), 800)
      return () => clearTimeout(t)
    }
  }, [value])
  return flashing
}

export function formatValue(v: number, fmt: ValueFmt): string {
  if (fmt === 'num') return fmtNum(v)
  if (fmt === 'pct') return fmtPct(v)
  return fmtBRL(v)
}

export function DreValueCell({
  value,
  fmt,
  isTotal,
}: {
  value: number
  fmt: ValueFmt
  isTotal?: boolean
}) {
  const flashing = useFlash(value)
  return (
    <CalcOutput
      className={cn(
        isTotal && 'text-[#b98a00] text-sm',
        flashing && 'bg-[#b98a00]/15 rounded px-1 transition-colors duration-300',
      )}
    >
      {formatValue(value, fmt)}
    </CalcOutput>
  )
}
