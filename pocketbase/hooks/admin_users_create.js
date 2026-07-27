routerAdd(
  'POST',
  '/backend/v1/admin/users',
  (e) => {
    const userId = e.auth ? e.auth.id : ''
    if (!userId) return e.unauthorizedError('auth required')
    let isAdmin = false
    try {
      const profile = $app.findFirstRecordByFilter('user_profiles', 'user_id = "' + userId + '"')
      isAdmin = profile.getString('role') === 'admin'
    } catch (err) {}
    if (!isAdmin) return e.forbiddenError('admin access required')

    const body = e.requestInfo().body || {}
    if (!body.email || !body.password) return e.badRequestError('email and password are required')
    if (body.password.length < 8) return e.badRequestError('password must be at least 8 characters')

    try {
      $app.findAuthRecordByEmail('users', body.email)
      return e.json(409, { error: 'E-mail ja cadastrado' })
    } catch (_) {}

    const usersCol = $app.findCollectionByNameOrId('users')
    const record = new Record(usersCol)
    record.setEmail(body.email)
    record.setPassword(body.password)
    record.setVerified(true)
    record.set('name', body.name || body.email.split('@')[0])
    record.set('ativo', true)
    $app.save(record)

    var profileId = null
    try {
      const profilesCol = $app.findCollectionByNameOrId('user_profiles')
      const profileRecord = new Record(profilesCol)
      profileRecord.set('user_id', record.id)
      profileRecord.set('role', body.role || 'leitura')
      $app.save(profileRecord)
      profileId = profileRecord.id
    } catch (err) {}

    try {
      const auditCol = $app.findCollectionByNameOrId('audit_log')
      const audit = new Record(auditCol)
      audit.set('user_id', userId)
      audit.set('user_name', e.auth.getString('name') || e.auth.getString('email'))
      audit.set('module', 'admin')
      audit.set('field_name', 'create_user')
      audit.set('old_value', '')
      audit.set('new_value', body.email)
      $app.save(audit)
    } catch (err) {}

    return e.json(201, {
      id: record.id,
      email: body.email,
      name: body.name || body.email.split('@')[0],
      ativo: true,
      role: body.role || 'leitura',
      profileId: profileId,
    })
  },
  $apis.requireAuth(),
)
