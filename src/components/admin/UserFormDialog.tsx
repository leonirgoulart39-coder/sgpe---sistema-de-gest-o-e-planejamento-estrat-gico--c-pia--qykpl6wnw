import { useState } from 'react'
import { createUser } from '@/services/admin-users'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import type { Role } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function UserFormDialog({ open, onOpenChange, onCreated }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('leitura')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password || password.length < 8) {
      setError('Preencha e-mail e senha (min. 8 caracteres).')
      return
    }
    setLoading(true)
    setError('')
    try {
      await createUser({ name, email, password, role })
      onOpenChange(false)
      setName('')
      setEmail('')
      setPassword('')
      setRole('leitura')
      onCreated()
    } catch (err: any) {
      setError(err?.message || 'Erro ao criar usuario.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Usuario</DialogTitle>
        </DialogHeader>
        {error && <p className="text-xs text-destructive bg-destructive/10 rounded p-2">{error}</p>}
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Nome</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">E-mail</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 8 caracteres"
              className="h-9"
            />
          </div>
          <div>
            <Label className="text-xs">Perfil</Label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full h-9 text-xs rounded-lg border border-[#d8dde8] px-3 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="financeiro">Financeiro</option>
              <option value="operacional">Operacional</option>
              <option value="leitura">Leitura</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} Criar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
