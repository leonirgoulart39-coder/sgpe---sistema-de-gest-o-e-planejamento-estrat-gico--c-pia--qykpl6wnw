routerAdd(
  'POST',
  '/backend/v1/admin/users/{id}/reset-password',
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
    const body = e.requestInfo().body || {}
    if (!body.password || body.password.length < 8) {
      return e.badRequestError('password must be at least 8 characters')
    }

    const user = $app.findRecordById('users', id)
    user.setPassword(body.password)
    $app.save(user)

    try {
      const auditCol = $app.findCollectionByNameOrId('audit_log')
      const audit = new Record(auditCol)
      audit.set('user_id', userId)
      audit.set('user_name', e.auth.getString('name') || e.auth.getString('email'))
      audit.set('module', 'admin')
      audit.set('field_name', 'reset_password:' + user.getString('email'))
      audit.set('old_value', '')
      audit.set('new_value', '[redacted]')
      $app.save(audit)
    } catch (err) {}

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
