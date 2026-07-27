import pb from '@/lib/pocketbase/client'

export async function updateRecord(collection: string, id: string, data: Record<string, unknown>) {
  return pb.collection(collection).update(id, data)
}

export async function createRecord(collection: string, data: Record<string, unknown>) {
  return pb.collection(collection).create(data)
}

export async function deleteRecord(collection: string, id: string) {
  return pb.collection(collection).delete(id)
}

export async function createAuditLog(
  module: string,
  fieldName: string,
  oldValue: string,
  newValue: string,
) {
  const user = pb.authStore.record
  if (!user) return
  try {
    await pb.collection('audit_log').create({
      user_id: user.id,
      user_name: user.getString('name') || user.email || 'Usuário',
      module,
      field_name: fieldName,
      old_value: String(oldValue ?? ''),
      new_value: String(newValue ?? ''),
    })
  } catch {
    // silent fail
  }
}

export async function updateWithAudit(
  collection: string,
  id: string,
  field: string,
  newValue: unknown,
  module: string,
  oldValue?: unknown,
) {
  await updateRecord(collection, id, { [field]: newValue })
  await createAuditLog(module, field, String(oldValue ?? ''), String(newValue ?? ''))
}
