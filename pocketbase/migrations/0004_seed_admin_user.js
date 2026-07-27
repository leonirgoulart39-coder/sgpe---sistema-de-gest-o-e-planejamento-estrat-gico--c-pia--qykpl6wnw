migrate(
  (app) => {
    var users = app.findCollectionByNameOrId('users')
    try {
      app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
      return
    } catch (_) {}

    var record = new Record(users)
    record.setEmail('leonirgoulart39@gmail.com')
    record.setPassword('Skip@Pass')
    record.setVerified(true)
    record.set('name', 'Admin SGPE')
    app.save(record)

    var profiles = app.findCollectionByNameOrId('user_profiles')
    try {
      app.findFirstRecordByData('user_profiles', 'user_id', record.id)
    } catch (_) {
      var profile = new Record(profiles)
      profile.set('user_id', record.id)
      profile.set('role', 'admin')
      app.save(profile)
    }
  },
  (app) => {
    try {
      var record = app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
      app.delete(record)
    } catch (_) {}
  },
)
