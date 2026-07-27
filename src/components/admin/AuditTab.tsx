import { formatDate } from '@/lib/utils'

export interface AuditLog {
  id: string
  created: string
  user_name: string
  module: string
  field_name: string
  old_value: string
  new_value: string
}

export function AuditTab({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[#d8dde8] bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#d8dde8] bg-slate-50 text-[#7a8aaa] font-bold uppercase tracking-wider">
              <th className="py-3 px-4">Data/Hora</th>
              <th className="py-3 px-4">Usuário</th>
              <th className="py-3 px-4">Módulo</th>
              <th className="py-3 px-4">Campo</th>
              <th className="py-3 px-4">Valor Anterior</th>
              <th className="py-3 px-4">Novo Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d8dde8]/60">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-mono text-gray-500 whitespace-nowrap">
                  {formatDate(log.created)}
                </td>
                <td className="py-3 px-4 font-bold text-[#1a2236]">{log.user_name || 'Usuário'}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                    {log.module}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-gray-800">{log.field_name}</td>
                <td className="py-3 px-4 text-gray-400 line-through">{log.old_value || 'vazio'}</td>
                <td className="py-3 px-4 font-semibold text-emerald-700">{log.new_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
