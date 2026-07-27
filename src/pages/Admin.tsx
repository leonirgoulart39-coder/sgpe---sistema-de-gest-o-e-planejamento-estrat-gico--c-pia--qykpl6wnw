import { useState, useEffect, useCallback } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import { SectionHeader } from '@/components/ui-helpers'
import { UsersTab } from '@/components/admin/UsersTab'
import { AuditTab } from '@/components/admin/AuditTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import pb from '@/lib/pocketbase/client'
import type { AuditLog } from '@/types'

export default function Admin() {
  const [logs, setLogs] = useState<AuditLog[]>([])

  const loadLogs = useCallback(async () => {
    try {
      const auditLogs = await pb.collection('audit_log').getFullList({ sort: '-created' })
      setLogs(auditLogs as unknown as AuditLog[])
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useRealtime('audit_log', () => loadLogs())

  return (
    <div className="max-w-5xl mx-auto">
      <SectionHeader
        title="Administracao"
        subtitle="Gerenciamento de usuarios e auditoria"
        section="admin"
      />
      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="audit">Auditoria</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UsersTab />
        </TabsContent>
        <TabsContent value="audit">
          <AuditTab logs={logs} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
