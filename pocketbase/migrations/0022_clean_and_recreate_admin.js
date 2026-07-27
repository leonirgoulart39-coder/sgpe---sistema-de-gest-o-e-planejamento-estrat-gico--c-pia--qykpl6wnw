migrate(
  (app) => {
    var usersCol = app.findCollectionByNameOrId('users')
    var profilesCol = app.findCollectionByNameOrId('user_profiles')

    var existingAdmin = null
    try {
      existingAdmin = app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
    } catch (_) {}

    if (existingAdmin) {
      var existingProfile = null
      try {
        existingProfile = app.findFirstRecordByData('user_profiles', 'user_id', existingAdmin.id)
      } catch (_) {}
      if (existingProfile) {
        if (existingProfile.get('role') !== 'admin') {
          existingProfile.set('role', 'admin')
          app.save(existingProfile)
        }
      } else {
        var profile = new Record(profilesCol)
        profile.set('user_id', existingAdmin.id)
        profile.set('role', 'admin')
        app.save(profile)
      }
      return
    }

    var allUsers = app.findRecordsByFilter('users', "email != ''", '', 0, 0)
    for (var i = 0; i < allUsers.length; i++) {
      app.delete(allUsers[i])
    }

    var allProfiles = app.findRecordsByFilter('user_profiles', "user_id != ''", '', 0, 0)
    for (var j = 0; j < allProfiles.length; j++) {
      app.delete(allProfiles[j])
    }

    var allAuditLogs = app.findRecordsByFilter('audit_log', "user_id != ''", '', 0, 0)
    for (var k = 0; k < allAuditLogs.length; k++) {
      app.delete(allAuditLogs[k])
    }

    var record = new Record(usersCol)
    record.setEmail('leonirgoulart39@gmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin SGPE')
    record.set('ativo', true)
    app.save(record)

    var adminProfile = new Record(profilesCol)
    adminProfile.set('user_id', record.id)
    adminProfile.set('role', 'admin')
    app.save(adminProfile)
  },
  (app) => {},
)
