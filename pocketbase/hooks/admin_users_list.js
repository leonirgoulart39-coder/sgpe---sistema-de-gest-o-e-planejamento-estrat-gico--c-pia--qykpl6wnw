routerAdd(
  'GET',
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

    const users = $app.findRecordsByFilter('users', "email != ''", 'created', 0, 0)
    var profiles = []
    try {
      profiles = $app.findRecordsByFilter('user_profiles', "id != ''", '', 0, 0)
    } catch (err) {}

    var result = []
    for (var i = 0; i < users.length; i++) {
      var u = users[i]
      var profile = null
      for (var j = 0; j < profiles.length; j++) {
        if (profiles[j].getString('user_id') === u.id) {
          profile = profiles[j]
          break
        }
      }
      var ativoRaw = u.get('ativo')
      var ativo = ativoRaw === false ? false : true
      result.push({
        id: u.id,
        email: u.getString('email'),
        name: u.getString('name') || '',
        ativo: ativo,
        role: profile ? profile.getString('role') : 'leitura',
        profileId: profile ? profile.id : null,
      })
    }
    return e.json(200, result)
  },
  $apis.requireAuth(),
)
