import { useState, useEffect, useCallback } from 'react'
import { useRealtime } from '@/hooks/use-realtime'
import {
  listUsers,
  updateUser,
  resetPassword,
  deleteUser,
  type AdminUser,
} from '@/services/admin-users'
import { UserFormDialog } from '@/components/admin/UserFormDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Search, UserPlus, KeyRound, Trash2, Loader2 } from 'lucide-react'
import type { Role } from '@/types'

export function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    try {
      setUsers(await listUsers())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])
  useRealtime('user_profiles', () => load())

  const filtered = users.filter((u) => {
    const s = search.toLowerCase()
    const matchSearch = !s || u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s)
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const handleRoleChange = async (u: AdminUser, role: Role) => {
    try {
      await updateUser(u.id, { role })
      load()
    } catch {
      // ignore
    }
  }

  const handleToggleAtivo = async (u: AdminUser) => {
    try {
      await updateUser(u.id, { ativo: !u.ativo })
      load()
    } catch {
      // ignore
    }
  }

  const handleResetPassword = async () => {
    if (!resetTarget || !newPassword) return
    setActionLoading(true)
    try {
      await resetPassword(resetTarget.id, newPassword)
      setResetTarget(null)
      setNewPassword('')
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setActionLoading(true)
    try {
      await deleteUser(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      // ignore
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-sm text-[#7a8aaa] animate-pulse">Carregando…</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#7a8aaa] absolute left-3 top-2.5" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail…"
            className="pl-9 h-9 text-xs"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-9 text-xs rounded-lg border border-[#d8dde8] px-3 bg-white"
        >
          <option value="all">Todos os perfis</option>
          <option value="admin">Admin</option>
          <option value="financeiro">Financeiro</option>
          <option value="operacional">Operacional</option>
          <option value="leitura">Leitura</option>
        </select>
        <Button size="sm" onClick={() => setShowCreate(true)} className="h-9">
          <UserPlus className="w-4 h-4 mr-1" /> Novo Usuario
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-[#d8dde8] overflow-hidden shadow-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#d8dde8] bg-slate-50 text-[#7a8aaa] font-bold uppercase tracking-wider">
              <th className="py-3 px-4 text-left text-[10px]">Nome</th>
              <th className="py-3 px-4 text-left text-[10px]">E-mail</th>
              <th className="py-3 px-4 text-left text-[10px]">Perfil</th>
              <th className="py-3 px-4 text-center text-[10px]">Ativo</th>
              <th className="py-3 px-4 text-center text-[10px]">Acoes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d8dde8]/60">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-bold text-[#1a2236] text-xs">{u.name || '—'}</td>
                <td className="py-3 px-4 text-xs text-[#7a8aaa]">{u.email}</td>
                <td className="py-3 px-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                    className="text-[10px] font-bold rounded-full border border-[#d8dde8] px-2 py-1 bg-white focus:outline-none focus:border-[#b98a00]"
                  >
                    <option value="admin">Admin</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="operacional">Operacional</option>
                    <option value="leitura">Leitura</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-center">
                  <Switch checked={u.ativo} onCheckedChange={() => handleToggleAtivo(u)} />
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setResetTarget(u)}
                      className="text-[#7a8aaa] hover:text-[#b98a00] transition-colors"
                      title="Resetar senha"
                    >
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(u)}
                      className="text-rose-400 hover:text-rose-600 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserFormDialog open={showCreate} onOpenChange={setShowCreate} onCreated={load} />

      <Dialog
        open={!!resetTarget}
        onOpenChange={(v) => !v && (setResetTarget(null), setNewPassword(''))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resetar Senha</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Defina uma nova senha para <strong>{resetTarget?.email}</strong>
          </p>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nova senha (min. 8 caracteres)"
            className="h-9"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetTarget(null)}>
              Cancelar
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={actionLoading || newPassword.length < 8}
            >
              {actionLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Resetar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{deleteTarget?.email}</strong>? Esta acao nao
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading}>
              {actionLoading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
