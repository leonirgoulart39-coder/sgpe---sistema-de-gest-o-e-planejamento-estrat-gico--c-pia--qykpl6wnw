import type { ReactNode } from 'react'
import { Download, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Semaforo } from '@/lib/calculations'

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const colors: Record<string, string> = {
    concluido: 'bg-success/10 text-success border-success/30',
    em_andamento: 'bg-warning/10 text-warning border-warning/30',
    pendente: 'bg-archived/10 text-archived border-archived/30',
  }
  return (
    <span
      className={cn(
        'px-2 py-0.5 rounded-full text-[10px] font-bold border font-sans',
        colors[status] || colors.pendente,
      )}
    >
      {label || status}
    </span>
  )
}

export function KpiSemaforo({ color, size = 12 }: { color: Semaforo; size?: number }) {
  const bg = color === 'green' ? 'bg-success' : color === 'yellow' ? 'bg-warning' : 'bg-destructive'
  return (
    <span className={cn('inline-block rounded-full', bg)} style={{ width: size, height: size }} />
  )
}

export function ExportButton({ section }: { section: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="no-print inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-accent border border-border hover:border-accent/30 rounded-lg transition-all font-sans"
    >
      <Download className="w-3.5 h-3.5" />
      PDF
    </button>
  )
}

export function SectionHeader({
  title,
  subtitle,
  section,
}: {
  title: string
  subtitle?: string
  section?: string
}) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="text-xl font-extrabold text-foreground font-display">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-1 font-sans">{subtitle}</p>}
      </div>
      {section && <ExportButton section={section} />}
    </div>
  )
}

export function MetricCard({
  label,
  value,
  sub,
  semaforo,
}: {
  label: string
  value: string
  sub?: string
  semaforo?: Semaforo
}) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-accent/30 transition-all duration-200 shadow-subtle">
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-sans">
        {label}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-2xl font-extrabold text-foreground tabular-nums font-display">{value}</p>
        {semaforo && <KpiSemaforo color={semaforo} size={14} />}
      </div>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">{sub}</p>}
    </div>
  )
}

export function AddRowButton({
  onClick,
  label = 'Adicionar',
}: {
  onClick: () => void
  label?: string
}) {
  return (
    <button
      onClick={onClick}
      className="no-print inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-accent hover:bg-accent/10 rounded-lg transition-all font-sans"
    >
      <Plus className="w-3.5 h-3.5" />
      {label}
    </button>
  )
}

export function PrintHeader({ title }: { title: string }) {
  return (
    <div className="print-only hidden print:block mb-6">
      <h1 className="text-lg font-bold font-display">IBMS × Legacy School — {title}</h1>
      <p className="text-xs text-gray-500 font-sans">
        Gerado em {new Date().toLocaleString('pt-BR')} · SGPE — Uso Interno IBMS — Confidencial
      </p>
    </div>
  )
}
