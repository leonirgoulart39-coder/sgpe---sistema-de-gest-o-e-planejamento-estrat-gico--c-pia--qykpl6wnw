import pb from '@/lib/pocketbase/client'

export interface AdminUser {
  id: string
  email: string
  name: string
  ativo: boolean
  role: string
  profileId?: string | null
}

export const listUsers = (): Promise<AdminUser[]> =>
  pb.send('/backend/v1/admin/users', { method: 'GET' })

export const createUser = (data: { name: string; email: string; password: string; role: string }) =>
  pb.send('/backend/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

export const updateUser = (
  id: string,
  data: Partial<{ name: string; role: string; ativo: boolean }>,
) =>
  pb.send(`/backend/v1/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })

export const resetPassword = (id: string, password: string) =>
  pb.send(`/backend/v1/admin/users/${id}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ password }),
    headers: { 'Content-Type': 'application/json' },
  })

export const deleteUser = (id: string) =>
  pb.send(`/backend/v1/admin/users/${id}`, { method: 'DELETE' })
