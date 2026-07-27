routerAdd(
  'DELETE',
  '/backend/v1/admin/users/{id}',
  (e) => {
    const userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    let isAdmin = false
    try {
      const profile = $app.findFirstRecordByFilter('user_profiles', 'user_id = "' + userId + '"')
      isAdmin = profile.getString('role') === 'admin'
    } catch (err) {}
    if (!isAdmin) return e.forbiddenError('admin access required')

    const id = e.request.pathValue('id')
    if (id === userId) return e.badRequestError('Cannot delete your own account')

    const user = $app.findRecordById('users', id)
    const email = user.getString('email')

    try {
      const profile = $app.findFirstRecordByFilter('user_profiles', 'user_id = "' + id + '"')
      $app.delete(profile)
    } catch (_) {}

    $app.delete(user)

    try {
      const auditCol = $app.findCollectionByNameOrId('audit_log')
      const audit = new Record(auditCol)
      audit.set('user_id', userId)
      audit.set('user_name', e.auth.getString('name') || e.auth.getString('email'))
      audit.set('module', 'admin')
      audit.set('field_name', 'delete_user')
      audit.set('old_value', email)
      audit.set('new_value', '')
      $app.save(audit)
    } catch (err) {}

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
