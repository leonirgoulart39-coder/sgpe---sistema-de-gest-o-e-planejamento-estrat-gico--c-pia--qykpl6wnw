routerAdd(
  'PATCH',
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
    const body = e.requestInfo().body || {}
    const user = $app.findRecordById('users', id)
    const adminName = e.auth.getString('name') || e.auth.getString('email')

    if (body.name !== undefined && body.name !== null) {
      user.set('name', body.name)
    }
    if (body.ativo !== undefined && body.ativo !== null) {
      const oldAtivo = user.get('ativo') === false ? false : true
      user.set('ativo', body.ativo)
      try {
        const auditCol = $app.findCollectionByNameOrId('audit_log')
        const audit = new Record(auditCol)
        audit.set('user_id', userId)
        audit.set('user_name', adminName)
        audit.set('module', 'admin')
        audit.set('field_name', 'ativo:' + user.getString('email'))
        audit.set('old_value', String(oldAtivo))
        audit.set('new_value', String(body.ativo))
        $app.save(audit)
      } catch (err) {}
    }
    $app.save(user)

    if (body.role !== undefined && body.role !== null) {
      try {
        const profile = $app.findFirstRecordByFilter('user_profiles', 'user_id = "' + id + '"')
        const oldRole = profile.getString('role')
        profile.set('role', body.role)
        $app.save(profile)
        try {
          const auditCol = $app.findCollectionByNameOrId('audit_log')
          const audit = new Record(auditCol)
          audit.set('user_id', userId)
          audit.set('user_name', adminName)
          audit.set('module', 'admin')
          audit.set('field_name', 'role:' + user.getString('email'))
          audit.set('old_value', oldRole)
          audit.set('new_value', body.role)
          $app.save(audit)
        } catch (err) {}
      } catch (_) {
        try {
          const profilesCol = $app.findCollectionByNameOrId('user_profiles')
          const profileRecord = new Record(profilesCol)
          profileRecord.set('user_id', id)
          profileRecord.set('role', body.role)
          $app.save(profileRecord)
        } catch (err) {}
      }
    }

    return e.json(200, { success: true })
  },
  $apis.requireAuth(),
)
